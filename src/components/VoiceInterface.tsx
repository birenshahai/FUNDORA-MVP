import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LogOut, User as UserIcon } from 'lucide-react';
import { MicrophoneButton } from './MicrophoneButton';
import { SoundWave } from './SoundWave';
import { MessageBubble } from './MessageBubble';
import { OnboardingQuestion } from './OnboardingQuestion';
import { SpeechService } from '../utils/speech';
import { getAIResponse } from '../utils/openai';
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
  const [onboardingAnswers, setOnboardingAnswers] = useState<number[]>([]);
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
        const aiResponse = await getAIResponse(enhancedPrompt, user.persona);
        const responseMessage = addMessage(aiResponse, false);
        speakMessage(aiResponse);
      } catch (error) {
        const errorMessage = addMessage("I'm sorry, I'm having trouble processing your request right now. Please try again.", false);
        speakMessage(errorMessage.text);
      }
    }
    
    setIsProcessing(false);
  };

  const handleOnboardingAnswer = (answerIndex: number) => {
    const newAnswers = [...onboardingAnswers, answerIndex];
    setOnboardingAnswers(newAnswers);

    const selectedOption = onboardingQuestions[currentQuestionIndex].options[answerIndex];
    addMessage(selectedOption.text, true);

    if (currentQuestionIndex < onboardingQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Onboarding complete
      const persona = calculatePersona(newAnswers);
      const updatedUser: User = {
        ...user,
        persona,
        onboardingComplete: true,
      };
      
      onUpdateUser(updatedUser);
      
      const completionMessage = `Great! Based on your responses, I've identified you as a ${persona} investor. I'll tailor my investment advice accordingly. What would you like to know about investing?`;
      const responseMessage = addMessage(completionMessage, false);
      speakMessage(completionMessage);
    }
  };

  const isOnboarding = !user.onboardingComplete && currentQuestionIndex < onboardingQuestions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-sky-400 flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-20 h-20 bg-sky-300 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-32 h-32 bg-purple-300 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-sky-300 rounded-full opacity-20"></div>
        
        {/* Financial Chart Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,60 Q25,40 50,50 T100,30" stroke="url(#voiceGradient1)" strokeWidth="0.3" fill="none" />
          <path d="M0,80 Q30,60 60,65 T100,45" stroke="url(#voiceGradient2)" strokeWidth="0.2" fill="none" />
          <defs>
            <linearGradient id="voiceGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="voiceGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-white/20 p-4 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-sky-500 rounded-xl flex items-center justify-center shadow-lg">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-800">Fundora</h1>
              <p className="text-sm text-purple-600">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 
                     px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
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