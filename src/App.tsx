import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { VoiceInterface } from './components/VoiceInterface';
import { storage } from './utils/storage';
import type { User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = storage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (email: string) => {
    const newUser: User = {
      email,
      persona: undefined,
      onboardingComplete: false,
    };
    setUser(newUser);
    storage.setUser(newUser);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    storage.setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    storage.clearUser();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-600 to-sky-400 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-medium">Loading Fundora...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <VoiceInterface
      user={user}
      onUpdateUser={handleUpdateUser}
      onLogout={handleLogout}
    />
  );
}

export default App;