import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
          ${message.isUser
            ? 'bg-gradient-to-r from-purple-600 to-sky-500 text-white rounded-br-sm shadow-lg'
            : 'bg-white/95 backdrop-blur-sm text-gray-800 rounded-bl-sm shadow-lg border border-white/20'
          }
        `}
      >
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${message.isUser ? 'text-white/80' : 'text-gray-500'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}