import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface MicrophoneButtonProps {
  isListening: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicrophoneButton({ isListening, onToggle, disabled = false }: MicrophoneButtonProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`
          relative w-24 h-24 rounded-full flex items-center justify-center
          transition-all duration-300 transform
          ${isListening 
            ? 'bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 scale-110 shadow-2xl shadow-red-500/50' 
            : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 hover:scale-110'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          shadow-2xl border-3 border-white/30 backdrop-blur-sm
        `}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
        {isListening ? (
          <MicOff className="w-10 h-10 text-white relative z-10" />
        ) : (
          <Mic className="w-10 h-10 text-white relative z-10" />
        )}
        
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-pink-500 animate-ping opacity-40"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-400 to-pink-400 animate-pulse opacity-30"></div>
          </>
        )}
      </button>
      
      {/* Floating particles around the button */}
      {!disabled && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute -top-2 -right-2 w-2 h-2 bg-violet-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-emerald-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-rose-400 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.5s' }}></div>
        </div>
      )}
    </div>
  );
}