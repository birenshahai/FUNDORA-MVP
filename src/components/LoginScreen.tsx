import React, { useState } from 'react';
import { Mail, ArrowRight, TrendingUp, Shield, Mic } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs with improved animations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-20 animate-pulse blur-sm"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full opacity-30 animate-bounce blur-sm"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-15 animate-pulse blur-sm"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full opacity-25 blur-sm"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute top-3/4 right-10 w-20 h-20 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-15 animate-pulse"></div>
        
        {/* Financial Progress Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M10,80 Q30,60 50,70 T90,50" stroke="url(#gradient1)" strokeWidth="0.8" fill="none" className="animate-pulse" />
          <path d="M20,90 Q40,70 60,75 T100,60" stroke="url(#gradient2)" strokeWidth="0.6" fill="none" />
          <path d="M5,70 Q35,50 65,60 T95,40" stroke="url(#gradient3)" strokeWidth="0.4" fill="none" className="animate-pulse" />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 relative">
            <img 
              src="/fundora.jpg" 
              alt="Fundora Logo" 
              className="w-20 h-20 rounded-3xl object-cover shadow-2xl border-3 border-white/30 backdrop-blur-sm"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
            Fundora
          </h1>
          <p className="text-cyan-100 text-xl font-medium drop-shadow-lg">Your Voice-Powered Financial Assistant</p>
          <div className="flex items-center justify-center mt-3 space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30 relative z-10 transform hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-indigo-900 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-4 border-2 border-indigo-200 rounded-2xl 
                           focus:outline-none focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500
                           text-gray-900 placeholder-indigo-400 bg-white/90 backdrop-blur-sm
                           transition-all duration-200 text-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!email.trim() || isLoading}
              className="w-full flex items-center justify-center px-6 py-4 border border-transparent 
                       text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 
                       hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600
                       focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500/50
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                       transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-3 h-6 w-6" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-lg text-cyan-100 mb-6 font-semibold">What makes Fundora special:</p>
          <div className="grid grid-cols-1 gap-4 text-sm text-white/90">
            <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <Mic className="w-5 h-5 text-cyan-400 mr-3" />
              <span className="font-medium">Voice-based investment guidance</span>
            </div>
            <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <Shield className="w-5 h-5 text-violet-400 mr-3" />
              <span className="font-medium">Personalized risk profiling</span>
            </div>
            <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
              <TrendingUp className="w-5 h-5 text-emerald-400 mr-3" />
              <span className="font-medium">AI-powered recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}