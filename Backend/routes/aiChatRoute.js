// aiChatRoute.js
import express from 'express';
import verifyToken from '../middlewares/verifyToken.js';
import { getGroqChatCompletion } from '../controllers/aiChatController.js'; // Correctly import the controller

const aiChatRouter = express.Router();

// The route now uses the imported controller function
aiChatRouter.post('/chat', verifyToken, getGroqChatCompletion);

export default aiChatRouter;