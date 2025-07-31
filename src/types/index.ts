export interface User {
  email: string;
  persona?: 'Conservative' | 'Balanced' | 'Aggressive';
  onboardingComplete: boolean;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface PersonaQuestion {
  id: string;
  question: string;
  options: Array<{
    text: string;
    scores: {
      Conservative: number;
      Balanced: number;
      Aggressive: number;
    };
  }>;
}