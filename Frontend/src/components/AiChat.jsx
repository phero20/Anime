import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  FaRobot, 
  FaUser, 
  FaPaperPlane, 
  FaTimes, 
  FaTrash,
  FaSpinner,
  FaRegCopy,
  FaCheck
} from 'react-icons/fa';
import { 
  sendChatMessage, 
  addUserMessage, 
  clearMessages, 
  finishTyping,
  selectMessages, 
  selectChatLoading, 
  selectChatError, 
  selectIsTyping 
} from '../redux/apifetch/aiChatSlice';
import { selectUser } from '../redux/apifetch/AuthSlicer';
import { setShowAuthModel } from '../redux/apifetch/uiSlice';
import { useToast } from './Toast';
import formgirl from '../assets/formgirl.png'

export default function AiChat({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { success, error } = useToast();
  
  const [message, setMessage] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [typingMessageId, setTypingMessageId] = useState(null);
  const [typingContent, setTypingContent] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const user = useSelector(selectUser);
  const messages = useSelector(selectMessages);
  const loading = useSelector(selectChatLoading);
  const chatError = useSelector(selectChatError);
  const isTyping = useSelector(selectIsTyping);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, typingContent]);

  // Typewriter effect for AI messages
  const startTypewriterEffect = useCallback((content, messageId) => {
    setTypingMessageId(messageId);
    setTypingContent('');
    
    let index = 0;
    const words = content.split(' ');
    
    const typeNextWord = () => {
      if (index < words.length) {
        setTypingContent(prev => prev + (index > 0 ? ' ' : '') + words[index]);
        index++;
        typingTimeoutRef.current = setTimeout(typeNextWord, 50); // Adjust speed here
      } else {
        setTypingMessageId(null);
        setTypingContent('');
        dispatch(finishTyping(messageId)); // Mark as finished typing
      }
    };
    
    typeNextWord();
  }, [dispatch]);

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Trigger typewriter effect for new AI messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isTyping) {
      startTypewriterEffect(lastMessage.content, lastMessage.id);
    }
  }, [messages, startTypewriterEffect]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    if (!user) {
      error('Please login to use AI chat');
      dispatch(setShowAuthModel(true));
      onClose()
      return;
    }

    const userMessage = message.trim();
    setMessage('');
    
    // Add user message immediately
    dispatch(addUserMessage(userMessage));
    
    try {
      // Format history for backend (only send role and content)
      const formattedHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Send to AI
      await dispatch(sendChatMessage({
        message: userMessage,
        history: formattedHistory,
        token: user.token
      })).unwrap();
      
    } catch (err) {
      console.error('Chat error:', err);
      error(err || 'Failed to send message');
    }
  };

  const handleClearChat = () => {
    dispatch(clearMessages());
    success('Chat cleared successfully');
  };

  const handleCopyMessage = (messageId, content) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    success('Message copied to clipboard');
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleSkipTyping = (messageId) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTypingMessageId(null);
    setTypingContent('');
    dispatch(finishTyping(messageId));
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Custom markdown formatter for better AI responses
  const formatMessage = (content) => {
    if (!content) return '';
    
    // Clean up common formatting issues
    let formatted = content
      // Remove excessive asterisks and underscores
      .replace(/\*{3,}/g, '**')
      .replace(/_{3,}/g, '__')
      // Clean up table formatting
      .replace(/\|[\s-|]*\|/g, (match) => {
        const parts = match.split('|').filter(part => part.trim());
        if (parts.length === 1 && parts[0].includes('-')) {
          return '| --- |';
        }
        return match;
      })
      // Fix bullet points
      .replace(/^[\s]*•[\s]*/gm, '• ')
      .replace(/^[\s]*\*[\s]*/gm, '• ')
      // Clean up headers
      .replace(/^#{4,}/gm, '###')
      .replace(/^#{1,2}[\s]*/gm, (match) => match.replace(/\s+/, ' '))
      // Remove excessive line breaks
      .replace(/\n{3,}/g, '\n\n')
      // Clean up bold text
      .replace(/\*\*([^*]+)\*\*/g, '**$1**')
      // Clean up italic text
      .replace(/\*([^*]+)\*/g, '*$1*');

    return formatted;
  };

  // Simple markdown renderer
  const renderMarkdown = (content) => {
    const formatted = formatMessage(content);
    
    return formatted
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-bold text-[#f47521] mt-4 mb-2">
              {line.replace('### ', '')}
            </h3>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-bold text-white mt-4 mb-3">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-bold text-[#f47521] mt-4 mb-3">
              {line.replace('# ', '')}
            </h1>
          );
        }
        
        // Tables
        if (line.includes('|') && line.includes('---')) {
          return null; // Skip table separator lines
        }
        
        // List items
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <div key={index} className="flex items-start gap-2 mb-1">
              <span className="text-[#f47521] mt-1">•</span>
              <span className="flex-1">{line.replace(/^[•-]\s*/, '')}</span>
            </div>
          );
        }
        
        // Bold text
        if (line.includes('**')) {
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={index} className="mb-2">
              {parts.map((part, partIndex) => 
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={partIndex} className="font-bold text-white">
                    {part.slice(2, -2)}
                  </strong>
                ) : (
                  <span key={partIndex}>{part}</span>
                )
              )}
            </p>
          );
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return (
            <p key={index} className="mb-2 leading-relaxed">
              {line}
            </p>
          );
        }
        
        // Empty lines
        return <br key={index} />;
      });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end justify-end"
        onClick={onClose}
      >
        {/* Mobile Overlay */}
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        <motion.div
          className="relative w-full md:w-2/3 xl:w-1/2 h-full bg-gray-900/65 backdrop-blur-md border border-gray-700/50 shadow-2xl overflow-hidden flex flex-col"
          initial={{ 
            // y: '100%', 
            x: '100%' ,
          }}
          animate={{ 
            y: 0, 
            x: 0 
          }}
          exit={{ 
            // y: '100%', 
            x: '100%' 
          }}
          transition={{ 
            type: "spring", 
            damping: 40, 
            stiffness: 350 ,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#f47521]/10 to-[#f47521]/5 border-b border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f47521]/20 rounded-full flex items-center justify-center">
                <FaRobot className="text-[#f47521]" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ani-Bot</h3>
                <p className="text-xs text-gray-400">Your anime expert assistant</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearChat}
                className="p-2 text-gray-400 hover:text-[#f47521] transition-colors duration-300"
                title="Clear chat"
              >
                <FaTrash size={14} />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
                title="Close"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
              <div className="flex-1 overflow-y-auto scrollbar-custom p-2 space-y-4 min-h-0">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                    <div className="w-20 h-20 bg-[#f47521]/10 rounded-full flex items-center justify-center">
                      <FaRobot className="text-[#f47521]" size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Welcome to Ani-Bot!</h4>
                      <p className="text-gray-400 max-w-md">
                        I'm your anime expert assistant. Ask me about anime recommendations, 
                        character analysis, plot discussions, or anything anime-related!
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "Recommend me some action anime",
                        "What's the best romance anime?",
                        "Tell me about Attack on Titan",
                        "Suggest anime similar to Naruto"
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setMessage(suggestion)}
                          className="px-3 py-1 bg-gray-800/60 border border-gray-700/50 hover:border-[#f47521]/50 text-gray-300 hover:text-[#f47521] rounded-lg text-sm transition-all duration-300"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex gap-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-6 h-6  flex items-center justify-center flex-shrink-0">
                            <img src={formgirl} alt="" />
                          </div>
                        )}
                        
                        <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                          <div
                            className={`p-3 rounded-2xl ${
                              msg.role === 'user'
                                ? 'bg-[#f47521] text-black'
                                : 'bg-gray-800/60 border border-gray-700/50 text-white'
                            }`}
                          >
                            <div className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'ai-chat-content' : ''}`}>
                              {msg.role === 'assistant' ? (
                                typingMessageId === msg.id ? (
                                  <div className="flex items-center gap-2">
                                    <span>{renderMarkdown(typingContent)}</span>
                                    <span className="animate-pulse text-[#f47521]">|</span>
                                  </div>
                                ) : (
                                  renderMarkdown(msg.content)
                                )
                              ) : (
                                msg.content
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs opacity-70">
                                {formatTime(msg.timestamp)}
                              </span>
                              <div className="flex items-center gap-1">
                                {typingMessageId === msg.id && (
                                  <button
                                    onClick={() => handleSkipTyping(msg.id)}
                                    className="px-2 py-1 text-xs bg-[#f47521]/20 hover:bg-[#f47521]/30 text-[#f47521] rounded transition-colors duration-200"
                                    title="Skip typing"
                                  >
                                    Skip
                                  </button>
                                )}
                                <button
                                  onClick={() => handleCopyMessage(msg.id, msg.content)}
                                  className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                                  title="Copy message"
                                >
                                  {copiedMessageId === msg.id ? (
                                    <FaCheck className="text-green-400" size={10} />
                                  ) : (
                                    <FaRegCopy size={10} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {msg.role === 'user' && (
                          <div className="w-6 h-6 bg-gray-700/50 rounded-full overflow-hidden border-2 border-[#f47521]/30 flex items-center justify-center flex-shrink-0">
                            <img src={user?.avatar} alt="" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3 justify-start"
                      >
                        <div className="w-8 h-8 bg-[#f47521]/20 rounded-full flex items-center justify-center">
                          <FaRobot className="text-[#f47521]" size={14} />
                        </div>
                        <div className="bg-gray-800/60 border border-gray-700/50 rounded-2xl p-4">
                          <div className="flex items-center gap-1">
                            <FaSpinner className="animate-spin text-[#f47521]" size={12} />
                            <span className="text-sm text-gray-400">Ani-Bot is typing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Error Display */}
              {chatError && (
                <div className="px-4 py-2 bg-red-900/20 border-t border-red-500/30">
                  <p className="text-red-400 text-sm">{chatError}</p>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700/50">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about anime..."
                      className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#f47521] focus:ring-2 focus:ring-[#f47521]/20 transition-all duration-300"
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!message.trim() || loading}
                    className="px-6 py-3 bg-[#f47521] hover:bg-[#ff6600] disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    {loading ? (
                      <FaSpinner className="animate-spin" size={16} />
                    ) : (
                      <FaPaperPlane size={16} />
                    )}
                  </button>
                </div>
              </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
