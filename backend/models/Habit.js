import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  streak: { 
    type: Number, 
    default: 0 
  },
  lastCompleted: { 
    type: Date 
  }, 
  history: [{ 
    type: Date 
  }] 
}, { timestamps: true });

export default mongoose.model("Habit", habitSchema);
