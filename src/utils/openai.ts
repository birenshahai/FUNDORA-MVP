const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function getAIResponse(prompt: string, userPersona?: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    // Fallback response when API key is not available
    return generateFallbackResponse(prompt, userPersona);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Fundora, a helpful financial AI assistant for Indian users. The user is a ${userPersona || 'Balanced'} investor. 

Guidelines:
- Provide specific, practical investment advice based on exact amounts mentioned
- Keep responses conversational and under 100 words
- Always consider the specific investment amount, timeline, and risk profile
- Focus on Indian investment options: SIP, FD, PPF, ELSS, mutual funds, stocks, etc.
- Give specific fund names and allocation percentages when relevant
- Consider current Indian market conditions and tax implications
- Adapt advice based on the user's ${userPersona || 'Balanced'} risk profile

For ${userPersona} investors:
${getPersonaGuidelines(userPersona)}

Always provide actionable, specific advice with exact amounts and percentages.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API error:', error);
    return generateFallbackResponse(prompt, userPersona);
  }
}

function getPersonaGuidelines(persona?: string): string {
  switch (persona) {
    case 'The Guardian':
      return `- Prioritize capital preservation and guaranteed returns
- Suggest 60-70% in FD/PPF/Debt funds, 30-40% in large-cap equity
- Focus on tax-saving instruments like PPF and ELSS
- Recommend shorter lock-in periods and liquid investments`;
    
    case 'The Planner':
      return `- Focus on goal-based investing and structured planning
- Suggest 50-60% in balanced mutual funds, 40-50% in debt/FD
- Recommend systematic investment approach
- Emphasize predictable returns and milestone tracking`;
    
    case 'The Explorer':
      return `- Balance between growth and stability with learning focus
- Suggest 60% equity (diversified), 40% debt allocation
- Recommend SIPs and moderate equity exposure
- Encourage financial education and gradual risk increase`;
    
    case 'The Hustler':
      return `- Focus on wealth creation and high growth potential
- Suggest 70-80% in equity (mix of large, mid, small-cap), 20-30% in debt
- Recommend direct equity, sectoral funds, and international exposure
- Consider longer investment horizons (5+ years)`;
    
    case 'The Maverick':
      return `- Focus on aggressive wealth building with high-risk tolerance
- Suggest 80-90% in equity/alternative investments, 10-20% in debt
- Recommend direct equity, crypto, and high-growth investments
- Emphasize diversification to balance aggressive approach`;
    
    default:
      return `- Balance between growth and stability (Explorer approach)
- Suggest 60% equity, 40% debt allocation
- Mix of large-cap stability with mid-cap growth
- Diversify across asset classes including gold/international`;
  }
}

function generateFallbackResponse(prompt: string, userPersona?: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract investment amount from the prompt
  const amountMatch = prompt.match(/₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:thousand|k|lakh|crore|million)?/i);
  let amount = 0;
  if (amountMatch) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    const fullMatch = amountMatch[0].toLowerCase();
    if (fullMatch.includes('crore')) {
      amount *= 10000000;
    } else if (fullMatch.includes('lakh')) {
      amount *= 100000;
    } else if (fullMatch.includes('thousand')) {
      amount *= 1000;
    } else if (fullMatch.includes('million')) {
      amount *= 1000000;
    } else if (fullMatch.includes('k') && !fullMatch.includes('lakh')) {
      amount *= 1000;
    }
  }

  // Extract persona from prompt
  const isGuardian = userPersona === 'The Guardian';
  const isPlanner = userPersona === 'The Planner';
  const isExplorer = userPersona === 'The Explorer';
  const isHustler = userPersona === 'The Hustler';
  const isMaverick = userPersona === 'The Maverick';

  // Generate dynamic responses based on amount and persona
  if (amount > 0) {
    return generateAmountBasedResponse(amount, userPersona, lowerPrompt);
  }

  // Topic-based responses
  if (lowerPrompt.includes('sip')) {
    return generateSIPResponse(userPersona);
  }
  
  if (lowerPrompt.includes('tax') || lowerPrompt.includes('80c') || lowerPrompt.includes('elss')) {
    return generateTaxSavingResponse(userPersona);
  }
  
  if (lowerPrompt.includes('emergency') || lowerPrompt.includes('fund')) {
    return generateEmergencyFundResponse();
  }
  
  if (lowerPrompt.includes('mutual fund')) {
    return generateMutualFundResponse(userPersona);
  }
  
  if (lowerPrompt.includes('fd') || lowerPrompt.includes('fixed deposit')) {
    return generateFDResponse(userPersona);
  }

  // Default responses based on persona
  if (isGuardian) {
    return "As The Guardian, focus on capital preservation. Consider FDs, PPF, and debt mutual funds. What specific amount are you looking to invest?";
  }
  
  if (isMaverick) {
    return "As The Maverick, you can handle high-risk investments. Equity mutual funds and direct stocks work well. What's your investment amount and timeline?";
  }
  
  return "I'd love to help with your investment query! Could you share the amount you're planning to invest and your timeline?";
}

function generateAllocationResponse(result: AllocationResult): string {
  const { persona, total_investment, allocations, final_value, portfolio_cagr } = result;
  
  let response = `Perfect! Here's your personalized portfolio for ₹${total_investment.toLocaleString('en-IN')} as ${persona}:\n\n`;
  
  // Add allocation breakdown
  Object.entries(allocations).forEach(([category, allocation]) => {
    if (allocation.amount > 0) {
      response += `${category}: ${allocation.percent}% (₹${allocation.amount.toLocaleString('en-IN')})\n`;
    }
  });
  
  response += `\nProjected value after 10 years: ₹${final_value.toLocaleString('en-IN')} (${portfolio_cagr}% CAGR)\n\n`;
  response += `Would you like to learn more about any of these categories?`;
  
  return response;
}

function generateAmountBasedResponse(amount: number, userPersona?: string, prompt?: string): string {
  // Small amounts (under ₹10,000)
  if (amount < 10000) {
    if (userPersona === 'The Guardian') {
      return `For ₹${amount.toLocaleString('en-IN')}, start with a recurring deposit or small SIP in a debt fund. Even ₹500/month SIP can grow significantly over time.`;
    }
    if (userPersona === 'The Maverick') {
      return `₹${amount.toLocaleString('en-IN')} is perfect to start! Begin with a small-cap mutual fund SIP of ₹1000-2000/month. Consider Parag Parikh Flexi Cap or Axis Small Cap.`;
    }
    return `₹${amount.toLocaleString('en-IN')} is a great start! Try a balanced hybrid fund SIP. HDFC Balanced Advantage or ICICI Prudential Balanced Advantage are good options.`;
  }
  
  // Medium amounts (₹10,000 - ₹1,00,000)
  if (amount < 100000) {
    if (userPersona === 'The Guardian') {
      return `For ₹${amount.toLocaleString('en-IN')}, consider: 60% in FD/PPF (₹${Math.round(amount * 0.6).toLocaleString('en-IN')}), 40% in debt mutual funds (₹${Math.round(amount * 0.4).toLocaleString('en-IN')}). This gives stability with some growth.`;
    }
    if (userPersona === 'The Maverick') {
      return `₹${amount.toLocaleString('en-IN')} can be split: 80% equity funds (₹${Math.round(amount * 0.8).toLocaleString('en-IN')}), 20% debt (₹${Math.round(amount * 0.2).toLocaleString('en-IN')}). Try Axis Bluechip + Mirae Asset Emerging Bluechip combo.`;
    }
    return `For ₹${amount.toLocaleString('en-IN')}, go 65% equity (₹${Math.round(amount * 0.65).toLocaleString('en-IN')}) in index funds, 35% debt (₹${Math.round(amount * 0.35).toLocaleString('en-IN')}) in corporate bond funds.`;
  }
  
  // Large amounts (₹1,00,000+)
  if (userPersona === 'The Guardian') {
    return `₹${amount.toLocaleString('en-IN')} is substantial! Diversify: 40% FD/PPF (₹${Math.round(amount * 0.4).toLocaleString('en-IN')}), 35% debt funds (₹${Math.round(amount * 0.35).toLocaleString('en-IN')}), 25% large-cap equity (₹${Math.round(amount * 0.25).toLocaleString('en-IN')}). Consider ELSS for tax benefits.`;
  }
  if (userPersona === 'The Maverick') {
    return `₹${amount.toLocaleString('en-IN')} offers great diversification! Try: 50% large-cap (₹${Math.round(amount * 0.5).toLocaleString('en-IN')}), 30% mid/small-cap (₹${Math.round(amount * 0.3).toLocaleString('en-IN')}), 20% international funds (₹${Math.round(amount * 0.2).toLocaleString('en-IN')}). Consider direct equity too.`;
  }
  return `₹${amount.toLocaleString('en-IN')} allows good diversification: 60% equity mix (₹${Math.round(amount * 0.6).toLocaleString('en-IN')}), 25% debt (₹${Math.round(amount * 0.25).toLocaleString('en-IN')}), 15% gold/international (₹${Math.round(amount * 0.15).toLocaleString('en-IN')}).`;
}

function generateTaxSavingResponse(userPersona: string): string {
  if (userPersona === 'The Guardian') {
    return "For tax saving: PPF and ELSS funds work well. What amount are you planning to invest for tax benefits?";
  }
  if (userPersona === 'The Maverick') {
    return "Maximize ELSS for 80C benefits! What's your total investment amount?";
  }
  return "Tax-saving investments like PPF and ELSS are great options. What amount would you like to invest?";
}

function generateEmergencyFundResponse(): string {
  return "Emergency fund should be 6-12 months of expenses in liquid investments. Use savings account + liquid funds. Keep it separate from investment goals!";
}

function generateMutualFundResponse(userPersona: string): string {
  if (userPersona === 'The Guardian') {
    return "Conservative mutual funds like debt and hybrid funds work well for you. What amount are you planning to invest?";
  }
  if (userPersona === 'The Maverick') {
    return "Aggressive mutual funds like small-cap and mid-cap funds suit your profile. What's your investment amount?";
  }
  return "Balanced mutual funds are great for diversification. What amount would you like to invest?";
}

function generateFDResponse(userPersona: string): string {
  if (userPersona === 'The Guardian') {
    return "FDs are perfect for guaranteed returns! What amount are you considering for FDs?";
  }
  if (userPersona === 'The Maverick') {
    return "FDs are safe but consider equity for better growth. What's your total investment amount?";
  }
  return "FDs are good for short-term goals. What amount are you planning to invest?";
}