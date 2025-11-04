export interface User {
  email: string;
  persona?: 'The Guardian' | 'The Planner' | 'The Explorer' | 'The Hustler' | 'The Maverick';
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
    value: 'A' | 'B' | 'C' | 'D' | 'E';
  }>;
}

export interface PersonaResult {
  total_score: number;
  persona: 'The Guardian' | 'The Planner' | 'The Explorer' | 'The Hustler' | 'The Maverick';
  description: string;
  financial_advice: string;
}