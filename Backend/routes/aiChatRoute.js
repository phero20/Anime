import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { 
    getGroqChatCompletion, 
    getChatHistory, 
    clearChatHistory 
} from '../controllers/aiChatController.js';

const aiChatRouter = express.Router();


aiChatRouter.post('/chat', verifyToken, getGroqChatCompletion);


aiChatRouter.get('/history', verifyToken, getChatHistory);


aiChatRouter.delete('/history', verifyToken, clearChatHistory);

export default aiChatRouter;