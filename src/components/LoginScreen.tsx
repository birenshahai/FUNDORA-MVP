import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    // Simulate a brief loading period
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onLogin(email.trim());
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-sky-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-sky-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-400 to-sky-300 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-sky-200 rounded-full opacity-25"></div>
        
        {/* Financial Progress Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,80 Q30,60 50,70 T90,50" stroke="url(#gradient1)" strokeWidth="0.5" fill="none" className="animate-pulse" />
          <path d="M20,90 Q40,70 60,75 T100,60" stroke="url(#gradient2)" strokeWidth="0.3" fill="none" />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <img 
              src="/fundora.jpg" 
              alt="Fundora Logo" 
              className="w-16 h-16 rounded-2xl object-cover shadow-2xl border-2 border-white/20"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Fundora</h1>
          <p className="text-sky-100 text-lg">Your Voice-Powered Financial Assistant</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 relative z-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-purple-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-purple-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-purple-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                           text-gray-900 placeholder-purple-300 bg-white/80"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email.trim() || isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent 
                       text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-sky-500 hover:from-purple-700 hover:to-sky-600
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       transform hover:scale-105"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-sm text-sky-100 mb-4 font-medium">What makes Fundora special:</p>
          <div className="grid grid-cols-1 gap-3 text-xs text-white/80">
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-sky-300 rounded-full mr-2 animate-pulse"></span>
              Voice-based investment guidance
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-sky-300 rounded-full mr-2 animate-pulse"></span>
              Personalized risk profiling
            </div>
            <div className="flex items-center justify-center">
              <span className="w-2 h-2 bg-sky-300 rounded-full mr-2 animate-pulse"></span>
              AI-powered recommendations
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}