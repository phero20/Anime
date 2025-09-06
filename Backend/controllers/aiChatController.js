
import Groq from 'groq-sdk';
import ChatMessage from '../models/ChatMessage.js';


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getGroqChatCompletion = async (req, res) => {
  const { message, history } = req.body;
  const userId = req.body.userId; // Available from verifyToken middleware

  if (!message) {
    return res.status(400).json({ message: "Message is required." });
  }

  // Ensure history messages have required properties
  const validHistory = (history || []).filter(msg => 
    msg && typeof msg === 'object' && 
    msg.role && typeof msg.role === 'string' &&
    msg.content && typeof msg.content === 'string'
  );

  const messages = [
    {
      role: "system",
      content: "You are a friendly and knowledgeable anime expert called 'Ani-Bot'. When providing responses, use clean formatting with proper markdown. Avoid excessive asterisks, underscores, or special characters. Use simple headers (##, ###), bullet points (•), and bold text (**text**) sparingly. Keep tables simple and readable. Focus on clear, well-structured content that's easy to read."
    },
    ...validHistory,
    {
      role: "user",
      content: message,
    },
  ];

  try {
    // Validate messages array before sending to API
    if (!Array.isArray(messages) || messages.length < 2) {
      throw new Error('Invalid message format');
    }

    // Verify each message has required properties
    messages.forEach((msg, index) => {
      if (!msg.role || !msg.content) {
        throw new Error(`Invalid message at position ${index}: missing role or content`);
      }
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "openai/gpt-oss-120b",
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";
    
    try {
    
      let chatHistory = await ChatMessage.findOne({ userId });
      
      if (!chatHistory) {
        chatHistory = new ChatMessage({ userId, messages: [] });
      }

      const currentDateTime = new Date();
      const currentDate = currentDateTime.toISOString().split('T')[0];
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: currentDateTime,
        date: currentDate
      };

      const assistantMessage = {
        role: 'assistant',
        content: reply,
        timestamp: currentDateTime,
        date: currentDate
      };

     
      chatHistory.messages.push(userMessage, assistantMessage);

   
      const savedChat = await chatHistory.save();

      const savedMessages = savedChat.messages.slice(-2);
      const [savedUserMsg, savedAssistantMsg] = savedMessages;

    
      const responseMessages = {
        user: { ...userMessage, id: savedUserMsg._id.toString() },
        assistant: { ...assistantMessage, id: savedAssistantMsg._id.toString() }
      };

      res.status(200).json({ 
        reply,
        messages: responseMessages
      });
    } catch (dbError) {
      console.error("Database Error:", dbError);
      // Still send the reply even if storage fails
      res.status(200).json({ 
        reply, 
        warning: "Failed to save chat history",
        messages: null
      });
    }
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ message: error.message });
  }
}
const formatDateHeader = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date);


  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  messageDate.setHours(0, 0, 0, 0);

  if (messageDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (messageDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};


export const getChatHistory = async (req, res) => {
  try {
    const userId = req.body.userId;
    const chatHistory = await ChatMessage.findOne({ userId });
    
    if (!chatHistory) {
      return res.status(200).json({ messages: [] });
    }

  
    let currentDate = null;
    const messagesWithDateHeaders = [];

    chatHistory.messages.forEach(message => {
      const messageDate = message.date; 
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        messagesWithDateHeaders.push({
          type: 'dateHeader',
          date: messageDate,
          formattedDate: formatDateHeader(message.timestamp) 
        });
      }
      
    
      messagesWithDateHeaders.push({
        id: message._id.toString(), 
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
        date: message.date
      });
    });

    res.status(200).json({ messages: messagesWithDateHeaders });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
};

export const clearChatHistory = async (req, res) => {
  try {
    const userId = req.body.userId;
    console.log(userId)
    await ChatMessage.findOneAndUpdate(
      { userId },
      { $set: { messages: [] } },
      { upsert: true }
    );
    
    res.status(200).json({ message: "Chat history cleared successfully" });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ message: "Failed to clear chat history" });
  }
};