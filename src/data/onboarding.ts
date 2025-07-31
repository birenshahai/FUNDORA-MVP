import type { PersonaQuestion } from '../types';

export const onboardingQuestions: PersonaQuestion[] = [
  {
    id: '1',
    question: "What's your primary investment timeline?",
    options: [
      {
        text: "Less than 2 years (Short-term)",
        scores: { Conservative: 3, Balanced: 1, Aggressive: 0 }
      },
      {
        text: "2-5 years (Medium-term)",
        scores: { Conservative: 1, Balanced: 3, Aggressive: 1 }
      },
      {
        text: "More than 5 years (Long-term)",
        scores: { Conservative: 0, Balanced: 1, Aggressive: 3 }
      }
    ]
  },
  {
    id: '2',
    question: "How do you currently invest your money?",
    options: [
      {
        text: "Fixed Deposits, PPF, Savings Account",
        scores: { Conservative: 3, Balanced: 0, Aggressive: 0 }
      },
      {
        text: "Mix of FDs and Mutual Funds",
        scores: { Conservative: 1, Balanced: 3, Aggressive: 1 }
      },
      {
        text: "Stocks, Crypto, High-risk investments",
        scores: { Conservative: 0, Balanced: 1, Aggressive: 3 }
      }
    ]
  },
  {
    id: '3',
    question: "How would you react if your investment loses 20% in a month?",
    options: [
      {
        text: "I'd panic and sell immediately",
        scores: { Conservative: 3, Balanced: 1, Aggressive: 0 }
      },
      {
        text: "I'd be concerned but wait to see",
        scores: { Conservative: 1, Balanced: 3, Aggressive: 1 }
      },
      {
        text: "I'd see it as a buying opportunity",
        scores: { Conservative: 0, Balanced: 0, Aggressive: 3 }
      }
    ]
  },
  {
    id: '4',
    question: "What's your monthly investable surplus?",
    options: [
      {
        text: "Less than ₹5,000",
        scores: { Conservative: 2, Balanced: 2, Aggressive: 1 }
      },
      {
        text: "₹5,000 - ₹25,000",
        scores: { Conservative: 1, Balanced: 2, Aggressive: 2 }
      },
      {
        text: "More than ₹25,000",
        scores: { Conservative: 0, Balanced: 1, Aggressive: 3 }
      }
    ]
  },
  {
    id: '5',
    question: "What's your primary source of investment knowledge?",
    options: [
      {
        text: "Bank advisors, family recommendations",
        scores: { Conservative: 3, Balanced: 1, Aggressive: 0 }
      },
      {
        text: "Financial websites, basic research",
        scores: { Conservative: 1, Balanced: 3, Aggressive: 1 }
      },
      {
        text: "Market analysis, trading platforms, financial news",
        scores: { Conservative: 0, Balanced: 1, Aggressive: 3 }
      }
    ]
  },
  {
    id: '6',
    question: "If the market crashes 30%, what would you do?",
    options: [
      {
        text: "Move everything to safe investments immediately",
        scores: { Conservative: 3, Balanced: 0, Aggressive: 0 }
      },
      {
        text: "Hold current investments and wait for recovery",
        scores: { Conservative: 1, Balanced: 3, Aggressive: 1 }
      },
      {
        text: "Invest more money to buy at lower prices",
        scores: { Conservative: 0, Balanced: 1, Aggressive: 3 }
      }
    ]
  }
];

export function calculatePersona(answers: number[]): 'Conservative' | 'Balanced' | 'Aggressive' {
  const scores = { Conservative: 0, Balanced: 0, Aggressive: 0 };
  
  answers.forEach((answerIndex, questionIndex) => {
    const question = onboardingQuestions[questionIndex];
    const selectedOption = question.options[answerIndex];
    
    scores.Conservative += selectedOption.scores.Conservative;
    scores.Balanced += selectedOption.scores.Balanced;
    scores.Aggressive += selectedOption.scores.Aggressive;
  });
  
  const maxScore = Math.max(scores.Conservative, scores.Balanced, scores.Aggressive);
  
  if (scores.Conservative === maxScore) return 'Conservative';
  if (scores.Aggressive === maxScore) return 'Aggressive';
  return 'Balanced';
}