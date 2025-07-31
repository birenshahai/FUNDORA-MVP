import React from 'react';
import type { PersonaQuestion } from '../types';

interface OnboardingQuestionProps {
  question: PersonaQuestion;
  onAnswer: (answerIndex: number) => void;
}

export function OnboardingQuestion({ question, onAnswer }: OnboardingQuestionProps) {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-md mx-auto border border-white/20">
      <h3 className="text-xl font-bold text-purple-900 mb-6 text-center leading-tight">
        {question.question}
      </h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className="w-full text-left p-4 rounded-xl border-2 border-purple-200 
                     hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-sky-50 transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          >
            <span className="text-gray-700">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}