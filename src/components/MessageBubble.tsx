import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn`}>
      <div
        className={`
          max-w-xs lg:max-w-md px-5 py-3 rounded-3xl transform transition-all duration-200 hover:scale-105
          ${message.isUser
            ? 'bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 text-white rounded-br-md shadow-xl border border-white/20'
            : 'bg-white/95 backdrop-blur-lg text-gray-800 rounded-bl-md shadow-xl border border-white/30'
          }
        `}
      >
        <p className="text-sm leading-relaxed font-medium">{message.text}</p>
        <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-gray-500'} font-medium`}>
          {message.timestamp.toLocaleDateString('en-GB', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
          })} {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}