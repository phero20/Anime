// Greeting.jsx
import React from 'react';
import { motion } from 'framer-motion';
import greet from '../assets/greet.gif'; 

export default function Greeting({ greetMessage }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
    >
    
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        className="z-10 flex flex-col items-center"
      >
        <img src={greet} alt="Welcome" className="w-56 h-56 object-contain" />
        <h1 className="text-3xl md:text-4xl font-bold text-[#f47521] text-center mb-2" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
            {greetMessage}
        </h1>
        <p className="text-gray-300 text-lg text-center mt-2">
          We're glad you're here.
        </p>
      </motion.div>
    </motion.div>
  );
}