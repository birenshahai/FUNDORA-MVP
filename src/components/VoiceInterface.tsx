import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogOut, User as UserIcon } from 'lucide-react';
import { MicrophoneButton } from './MicrophoneButton';
import { SoundWave } from './SoundWave';
import { MessageBubble } from './MessageBubble';
import { OnboardingQuestion } from './OnboardingQuestion';
import { SpeechService } from '../utils/speech';
import { getAIResponse } from '../utils/openai';
import { calculateAssetAllocation } from '../utils/assetAllocation';
import { onboardingQuestions, calculatePersona } from '../data/onboarding';
import type { User, Message } from '../types';

interface VoiceInterfaceProps {
  user: User;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export function VoiceInterface({ user, onUpdateUser, onLogout }: VoiceInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<('A' | 'B' | 'C' | 'D' | 'E')[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const speechService = useRef(new SpeechService());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user.onboardingComplete) {
      // Start onboarding
      const welcomeMessage: Message = {
        id: uuidv4(),
        text: "Welcome to Fundora! I'm here to help you with your investment decisions. Let me ask you a few questions to understand your investment profile better.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      
      // Speak the welcome message
      setTimeout(() => {
        speakMessage(welcomeMessage.text);
      }, 1000);
    } else {
      // Welcome back message
      const welcomeBackMessage: Message = {
        id: uuidv4(),
        text: `Welcome back! You're a ${user.persona} investor. How can I help you with your investments today?`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeBackMessage]);
      
      setTimeout(() => {
        speakMessage(welcomeBackMessage.text);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakMessage = (text: string) => {
    setIsSpeaking(true);
    speechService.current.speak(text, () => {
      setIsSpeaking(false);
    });
  };

  const addMessage = (text: string, isUser: boolean) => {
    const message: Message = {
      id: uuidv4(),
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);
    return message;
  };

  const handleMicrophoneToggle = () => {
    if (isListening) {
      speechService.current.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechService.current.startListening(
        (transcript) => {
          setIsListening(false);
          handleUserInput(transcript);
        },
        (error) => {
          setIsListening(false);
          console.error('Speech recognition error:', error);
          
          // Provide user feedback for speech recognition errors
          let errorMessage = "I'm having trouble hearing you. Please try again.";
          if (error === 'no-speech') {
            errorMessage = "I didn't hear anything. Please make sure your microphone is working and try speaking again.";
          } else if (error === 'not-allowed') {
            errorMessage = "Microphone access is blocked. Please allow microphone permissions and try again.";
          }
          
          addMessage(errorMessage, false);
          speakMessage(errorMessage);
        }
      );
    }
  };

  const handleUserInput = async (input: string) => {
    addMessage(input, true);
    setIsProcessing(true);

    if (!user.onboardingComplete) {
      // Handle onboarding voice input - for now, we'll use button-based onboarding
      const response = "Please select one of the options below to continue.";
      const responseMessage = addMessage(response, false);
      speakMessage(response);
    } else {
      // Handle regular investment queries
      const enhancedPrompt = `User Profile: ${user.persona} Investor
Email: ${user.email}

User Query: "${input}"

Context: This user has completed onboarding and been classified as a ${user.persona} investor based on their risk tolerance, investment timeline, and financial goals.

Please provide specific investment advice tailored to their profile and the exact query.`;
      
      try {
        const userName = user.email.split('@')[0]; // Extract name from email
        const aiResponse = await getAIResponse(enhancedPrompt, user.persona, userName);
        const responseMessage = addMessage(aiResponse, false);
        speakMessage(aiResponse);
      } catch (error) {
        const errorMessage = addMessage("I'm sorry, I'm having trouble processing your request right now. Please try again.", false);
        speakMessage(errorMessage.text);
      }
    }
    
    setIsProcessing(false);
  };

  const handleOnboardingAnswer = (answerValue: 'A' | 'B' | 'C' | 'D' | 'E') => {
    const newAnswers = [...onboardingAnswers, answerValue];
    setOnboardingAnswers(newAnswers);

    const selectedOption = onboardingQuestions[currentQuestionIndex].options.find(opt => opt.value === answerValue);
    addMessage(selectedOption?.text || '', true);

    if (currentQuestionIndex < onboardingQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Onboarding complete
      const personaResult = calculatePersona(newAnswers);
      const updatedUser: User = {
        ...user,
        persona: personaResult.persona,
        onboardingComplete: true,
      };
      
      onUpdateUser(updatedUser);
      
      const userName = user.email.split('@')[0];
      const completionMessage = `Perfect! You scored ${personaResult.total_score}/50. You are "${personaResult.persona}" - ${personaResult.description} 
      
Hi ${userName}! Based on your quiz, you're ${personaResult.persona}. How much do you plan to invest (in ₹)?`;
      const responseMessage = addMessage(completionMessage, false);
      speakMessage(completionMessage);
    }
  };

  const isOnboarding = !user.onboardingComplete && currentQuestionIndex < onboardingQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-800 flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Enhanced floating elements */}
        <div className="absolute top-10 left-20 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-15 animate-pulse blur-sm"></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-10 animate-bounce blur-sm"></div>
        <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 blur-sm"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full opacity-25 animate-ping blur-sm"></div>
        
        {/* Financial Chart Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,60 Q25,40 50,50 T100,30" stroke="url(#voiceGradient1)" strokeWidth="0.5" fill="none" className="animate-pulse" />
          <path d="M0,80 Q30,60 60,65 T100,45" stroke="url(#voiceGradient2)" strokeWidth="0.4" fill="none" />
          <path d="M0,50 Q40,30 70,40 T100,20" stroke="url(#voiceGradient3)" strokeWidth="0.3" fill="none" className="animate-pulse" />
          <defs>
            <linearGradient id="voiceGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="voiceGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="voiceGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-white/30 p-4 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-900">Fundora</h1>
              <p className="text-sm text-indigo-600 font-medium">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 
                       px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all duration-200
                       border border-indigo-200 hover:border-indigo-300 hover:shadow-md
                       cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 relative z-10">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Onboarding Question */}
            {isOnboarding && (
              <div className="mt-6">
                <OnboardingQuestion
                  question={onboardingQuestions[currentQuestionIndex]}
                  onAnswer={handleOnboardingAnswer}
                />
              </div>
            )}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/20">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Fundora is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Sound Wave Visualization */}
        {(isListening || isSpeaking) && (
          <div className="flex justify-center mb-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
              <SoundWave isActive={isListening || isSpeaking} isUser={isListening} />
            </div>
          </div>
        )}

        {/* Voice Controls */}
        {!isOnboarding && (
          <div className="flex flex-col items-center space-y-4">
            <MicrophoneButton
              isListening={isListening}
              onToggle={handleMicrophoneToggle}
              disabled={isProcessing || isSpeaking}
            />
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isListening 
                  ? "Listening... Speak now"
                  : isSpeaking 
                    ? "Fundora is speaking..."
                    : "Tap to ask Fundora about investments"
                }
              </p>
              {user.persona && (
                <p className="text-xs text-blue-600 mt-1">
                  <span className="text-white/90">Investment Profile: </span><span className="text-sky-200 font-semibold">{user.persona}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}