import express from 'express';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import officeParser from 'officeparser';
import { GoogleGenAI } from '@google/genai';
import Document from '../models/Document.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max allowed by multer (PPTs)
});

// Upload and Parse PDF
router.post('/upload', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too big. Maximum allowed size is 10MB.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Extract text based on file type
    let textContent = '';
    try {
      if (req.file.mimetype === 'application/pdf') {
        if (req.file.size > 5 * 1024 * 1024) {
          return res.status(400).json({ message: 'PDF files must be under 5MB.' });
        }
        const parser = new PDFParse({ data: req.file.buffer });
        const data = await parser.getText();
        textContent = data.text;
        await parser.destroy();
      } else if (
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        req.file.mimetype === 'application/vnd.ms-powerpoint'
      ) {
        const ast = await officeParser.parseOffice(req.file.buffer);
        textContent = ast.toText();
      } else {
        return res.status(400).json({ message: 'Unsupported file type. Upload PDF or PowerPoint.' });
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return res.status(400).json({ message: 'Error processing document content.', error: parseError.message });
    }

    if (!textContent || textContent.trim() === '') {
      return res.status(400).json({ message: 'Could not extract any text from this file.' });
    }

    // Save to DB
    const doc = new Document({
      user: req.user._id,
      fileName: req.file.originalname,
      textContent: textContent
    });
    
    await doc.save();
    
    res.status(201).json({
      message: 'Document uploaded and processed successfully',
      document: {
        _id: doc._id,
        fileName: doc.fileName,
        createdAt: doc.createdAt
        // Note: not sending textContent back to keep response light
      }
    });

  } catch (error) {
    console.error('PDF Upload Error:', error);
    res.status(500).json({ message: 'Server error processing PDF' });
  }
});

// List User Documents
router.get('/documents', protect, async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user._id })
      .select('-textContent') // Exclude heavy text
      .sort({ createdAt: -1 });
    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents' });
  }
});

// Delete Document
router.delete('/:id', protect, async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document' });
  }
});

// Handle AI Predefined Actions
router.post('/action', protect, async (req, res) => {
  try {
    const { documentId, actionType } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured.' });
    }

    const doc = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    let actionPrompt = "";

    switch (actionType) {
      case 'pageSummary':
        actionPrompt = "Summarize the content progressively, outlining the key points as they appear from beginning to end.";
        break;
      case 'topics':
        actionPrompt = "Identify and list the top 5-10 main topics discussed in this text.";
        break;
      case 'topicSummary':
        actionPrompt = "Group the document's information by main topic and provide a comprehensive summary for each topic.";
        break;
      case 'quiz':
        actionPrompt = "Generate a 5-question multiple choice quiz with an answer key at the very end. Format it clearly.";
        break;
      case 'notes':
        actionPrompt = "Create highly structured, bulleted study notes covering the most important concepts, definitions, and formulas (if any). Use Markdown.";
        break;
      default:
        return res.status(400).json({ message: 'Invalid action type.' });
    }

    const fullPrompt = `You are a helpful student assistant. Based ONLY on the following extracted PDF text, complete the requested action. Do not use outside knowledge. \n\nTEXT:\n${doc.textContent}\n\nACTION:\n${actionPrompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });

    res.status(200).json({ result: response.text });

  } catch (error) {
    if (error.status === 429) {
      return res.status(429).json({ message: 'API rate limit exceeded. Please wait a minute before trying again.' });
    }
    console.error('AI Action Error:', error);
    res.status(500).json({ message: 'Error generating AI content', error: error.message });
  }
});

// Q&A
router.post('/ask', protect, async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question string is required.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured.' });
    }

    const doc = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!doc) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const fullPrompt = `You are a helpful study assistant. Answer the following question based ONLY on the provided text. If the answer is not in the text, say 'I cannot find the answer in the document.' \n\nTEXT:\n${doc.textContent}\n\nQUESTION:\n${question}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt
    });

    res.status(200).json({ answer: response.text });

  } catch (error) {
    if (error.status === 429) {
      return res.status(429).json({ message: 'API rate limit exceeded. Please wait a minute before trying again.' });
    }
    console.error('AI Ask Error:', error);
    res.status(500).json({ message: 'Error answering question', error: error.message });
  }
});

export default router;
