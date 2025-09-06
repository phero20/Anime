import React from 'react';

const DateHeader = ({ date }) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-3 py-1 bg-gray-800/80 rounded-full border border-gray-700/50">
        <span className="text-xs text-gray-400">{date}</span>
      </div>
    </div>
  );
};

export default DateHeader;
