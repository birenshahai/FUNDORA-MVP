import React from 'react';
import type { PersonaQuestion } from '../types';

interface OnboardingQuestionProps {
  question: PersonaQuestion;
  onAnswer: (answerValue: 'A' | 'B' | 'C' | 'D' | 'E') => void;
}

export function OnboardingQuestion({ question, onAnswer }: OnboardingQuestionProps) {
  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-lg mx-auto border border-white/30 transform hover:scale-105 transition-transform duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
      <h3 className="text-2xl font-bold text-indigo-900 mb-8 text-center leading-tight relative z-10">
        {question.question}
      </h3>
      
      <div className="space-y-4 relative z-10">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.value)}
            className="w-full text-left p-5 rounded-2xl border-2 border-indigo-200 
                     hover:border-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-cyan-50 
                     transition-all duration-200 transform hover:scale-105
                     focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:ring-opacity-50
                     shadow-md hover:shadow-lg"
          >
            <div className="flex items-start space-x-3">
              <span className="text-indigo-600 font-bold text-lg min-w-[24px]">{option.value}.</span>
              <span className="text-gray-800 font-medium text-base">{option.text}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}