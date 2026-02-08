import express from 'express';
import { registerUser, loginUser, emailExists } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/check-email', emailExists);

export default router;
