import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicrophoneButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicrophoneButton({ isListening, onToggle, disabled = false }: MicrophoneButtonProps) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`
        relative w-20 h-20 rounded-full flex items-center justify-center
        transition-all duration-300 transform
        ${isListening 
          ? 'bg-gradient-to-r from-red-500 to-pink-500 scale-110 shadow-xl shadow-red-500/40' 
          : 'bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600 hover:scale-105'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-2xl border-2 border-white/20
      `}
    >
      {isListening ? (
        <MicOff className="w-8 h-8 text-white" />
      ) : (
        <Mic className="w-8 h-8 text-white" />
      )}
      
      {isListening && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-ping opacity-30"></div>
      )}
    </button>
  );
}