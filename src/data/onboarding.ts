import type { PersonaQuestion, PersonaResult } from '../types';

export const onboardingQuestions: PersonaQuestion[] = [
  {
    id: '1',
    question: "When you receive unexpected money (e.g., ₹2,000 cashback or a gift), what do you usually do?",
    options: [
      { text: "Put it straight into savings", value: 'A' },
      { text: "Invest it cautiously (e.g., FD, Gold)", value: 'B' },
      { text: "Spend part, save part", value: 'C' },
      { text: "Use it to buy something I want", value: 'D' },
      { text: "Put it into high-risk investments (crypto, stocks)", value: 'E' }
    ]
  },
  {
    id: '2',
    question: "What do you think is the main reason to have money?",
    options: [
      { text: "For financial safety and emergencies", value: 'A' },
      { text: "For future goals like a home or education", value: 'B' },
      { text: "For a balanced life — save some, enjoy some", value: 'C' },
      { text: "To enjoy life now, because the future is uncertain", value: 'D' },
      { text: "To grow it fast and become wealthy", value: 'E' }
    ]
  },
  {
    id: '3',
    question: "When you think about investing, your first emotion is:",
    options: [
      { text: "Fear — \"What if I lose money?\"", value: 'A' },
      { text: "Caution — \"Better be safe than sorry\"", value: 'B' },
      { text: "Curiosity — \"I'd like to understand more\"", value: 'C' },
      { text: "Excitement — \"I want to try new things\"", value: 'D' },
      { text: "Confidence — \"I can handle risks to win big\"", value: 'E' }
    ]
  },
  {
    id: '4',
    question: "How do you usually make financial decisions?",
    options: [
      { text: "I ask elders/family for advice", value: 'A' },
      { text: "I do careful research and choose safe options", value: 'B' },
      { text: "I try things based on what I learn online", value: 'C' },
      { text: "I follow trends or influencer advice", value: 'D' },
      { text: "I trust my instincts and go with gut feeling", value: 'E' }
    ]
  },
  {
    id: '5',
    question: "Which of these best describes your monthly money habits?",
    options: [
      { text: "I track every rupee and save as much as possible", value: 'A' },
      { text: "I have a fixed budget and stick to it", value: 'B' },
      { text: "I spend freely on small things but limit big purchases", value: 'C' },
      { text: "I often go over budget or take credit for wants", value: 'D' },
      { text: "I like to experiment, even if it means borrowing", value: 'E' }
    ]
  },
  {
    id: '6',
    question: "How do you see your financial future in 10 years?",
    options: [
      { text: "I just want to be financially stable", value: 'A' },
      { text: "I hope to own a house or have a solid job", value: 'B' },
      { text: "I want to travel, enjoy life and be independent", value: 'C' },
      { text: "I see myself running a startup or side hustle", value: 'D' },
      { text: "I want to be financially free or retired early", value: 'E' }
    ]
  },
  {
    id: '7',
    question: "How do you respond when markets fall (e.g., stocks or crypto)?",
    options: [
      { text: "I avoid these markets entirely", value: 'A' },
      { text: "I feel anxious and want to pull out", value: 'B' },
      { text: "I wait and watch before reacting", value: 'C' },
      { text: "I see it as a buying opportunity", value: 'D' },
      { text: "I double down and invest more", value: 'E' }
    ]
  },
  {
    id: '8',
    question: "If your friend made a lot of money in a risky investment, what would you do?",
    options: [
      { text: "Be happy for them but stay with my plan", value: 'A' },
      { text: "Research what they did but not copy blindly", value: 'B' },
      { text: "Try to understand if it could work for me", value: 'C' },
      { text: "Feel FOMO and consider joining in", value: 'D' },
      { text: "Jump in — why miss the chance?", value: 'E' }
    ]
  },
  {
    id: '9',
    question: "What best describes your money identity?",
    options: [
      { text: "\"Saver first, spender later\"", value: 'A' },
      { text: "\"Disciplined and thoughtful\"", value: 'B' },
      { text: "\"Balanced and adaptable\"", value: 'C' },
      { text: "\"Spontaneous and bold\"", value: 'D' },
      { text: "\"Investor. Risk-taker. Wealth-builder.\"", value: 'E' }
    ]
  },
  {
    id: '10',
    question: "How do you learn about money and finance?",
    options: [
      { text: "I follow traditional advice (elders, books)", value: 'A' },
      { text: "I read trusted news, YouTube channels, blogs", value: 'B' },
      { text: "I experiment and learn from trial and error", value: 'C' },
      { text: "I follow influencers or financial creators", value: 'D' },
      { text: "I think about systems and trends and make bold bets", value: 'E' }
    ]
  }
];

export function calculatePersona(answers: ('A' | 'B' | 'C' | 'D' | 'E')[]): PersonaResult {
  // Convert answers to scores (A=1, B=2, C=3, D=4, E=5)
  const scoreMap = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5 };
  const total_score = answers.reduce((sum, answer) => sum + scoreMap[answer], 0);
  
  // Determine persona based on score ranges
  if (total_score >= 10 && total_score <= 17) {
    return {
      total_score,
      persona: 'The Guardian',
      description: 'Prioritizes security, avoids risk, saves meticulously.',
      financial_advice: 'Focus on safe instruments like FD, PPF, insurance. Gradually explore SIPs.'
    };
  } else if (total_score >= 18 && total_score <= 26) {
    return {
      total_score,
      persona: 'The Planner',
      description: 'Values structure, sets financial goals, prefers predictable returns.',
      financial_advice: 'Continue goal-based investing; consider balanced mutual funds.'
    };
  } else if (total_score >= 27 && total_score <= 35) {
    return {
      total_score,
      persona: 'The Explorer',
      description: 'Comfortable with some risk, values learning and flexibility.',
      financial_advice: 'Explore SIPs, diversified portfolios, moderate equity exposure.'
    };
  } else if (total_score >= 36 && total_score <= 43) {
    return {
      total_score,
      persona: 'The Hustler',
      description: 'Ambitious, follows trends, willing to take risks.',
      financial_advice: 'Learn risk management; invest systematically in equities/startups.'
    };
  } else {
    return {
      total_score,
      persona: 'The Maverick',
      description: 'Bold, high-risk mindset, invests instinctively.',
      financial_advice: 'Focus on diversification and long-term planning to balance aggression.'
    };
  }
}