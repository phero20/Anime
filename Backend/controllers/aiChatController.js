// aiChatController.js
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const getGroqChatCompletion = async (req, res) => {
  const { message, history } = req.body; // Expect a message and optional history

  if (!message) {
    return res.status(400).json({ message: "Message is required." });
  }

  const messages = [
    {
      role: "system",
      content: "You are a friendly and knowledgeable anime expert called 'Ani-Bot'. When providing responses, use clean formatting with proper markdown. Avoid excessive asterisks, underscores, or special characters. Use simple headers (##, ###), bullet points (•), and bold text (**text**) sparingly. Keep tables simple and readable. Focus on clear, well-structured content that's easy to read."
    },
    ...(history || []), // Add previous chat history if it exists
    {
      role: "user",
      content: message,
    },
  ];

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "openai/gpt-oss-120b",
    });

    const reply = chatCompletion.choices[0]?.message?.content || "";
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ message: error.message });
  }
};