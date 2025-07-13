import React from 'react';
import { motion } from 'framer-motion';
import greet from '../assets/greet.gif'; 

export default function Greeting({greetMessage}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-full h-full flex flex-col items-center justify-center"
    >
      
      <img src={greet} alt="Welcome" className="w-64 h-64 object-contain" />
      <h1 className="text-2xl md:text-3xl font-semibold text-[#f47521] text-center mb-2 tracking-tight" style={{textShadow: '0 2px 16px #23252688'}}>
          {greetMessage}
        </h1>
        <p className="text-[#e0e0e0] text-base text-center opacity-80 font-normal mt-2 max-w-xs">
          We're glad you're here.
        </p>
    </motion.div>
  );
}
