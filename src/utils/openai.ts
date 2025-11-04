const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
import { calculateAssetAllocation, PRODUCT_INTELLIGENCE, type AllocationResult } from './assetAllocation';

export async function getAIResponse(prompt: string, userPersona?: string, userName?: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    // Fallback response when API key is not available
    return generateFallbackResponse(prompt, userPersona, userName);
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
            content: `You are a friendly, expert financial assistant built inside a financial well-being app.
Your goal is to guide users from their Investor Persona → Personalized Asset Allocation → Product Education.

The user is a ${userPersona || 'Balanced'} investor.

### Interactive Conversation Flow:

1. Greet the user:
   "Hi ${userName || 'there'}! Based on your profile, you are **${userPersona}**. Let's create your personalized investment plan.
   How much would you like to invest in total (in ₹)?"

2. Once user enters amount:
   - Calculate allocation based on their persona.
   - Present a summary with exact amounts and percentages
   - End with: "Would you like to learn more about any of these categories?"

3. If the user asks about a specific category:
   - Display product examples and learning resources
   - Ask: "Would you like me to show example platforms or current returns for this category?"

4. If user says "Yes", provide platform guidance:
   - "Sure — you can explore these safely via verified apps like Groww, Zerodha, or Kuvera.
     Always review historical returns and lock-in periods before investing."

Guidelines:
- Be friendly, conversational, and accurate
- Calculate numbers precisely based on persona allocation matrix
- Educate, never advise specific buy/sell
- Encourage safe, long-term investing behavior
- Always end responses with a question or helpful next step
- Keep responses under 150 words for voice interaction`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
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
    return generateFallbackResponse(prompt, userPersona, userName);
  }
}

function generateFallbackResponse(prompt: string, userPersona?: string, userName?: string): string {
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

  // Check for platform/returns requests
  const platformKeywords = ['platform', 'platforms', 'returns', 'current returns', 'show me', 'tell me current', 'where to invest', 'how to invest'];
  const isPlatformRequest = platformKeywords.some(keyword => lowerPrompt.includes(keyword));
  
  if (isPlatformRequest) {
    return generatePlatformResponse();
  }
  // Check for category-specific questions first
  const categories = ['gold', 'silver', 'govt', 'government', 'government schemes', 'fixed income', 'fixed', 'fd', 'mutual fund', 'mutual funds', 'mutual', 'equity', 'equities', 'stock', 'stocks', 'crypto', 'cryptocurrency', 'bitcoin'];
  const mentionedCategory = categories.find(cat => lowerPrompt.includes(cat));
  
  if (mentionedCategory) {
    console.log('Detected category:', mentionedCategory); // Debug log
    return generateCategoryResponse(mentionedCategory, userPersona);
  }

  // Check for affirmative responses to learning more
  const affirmativeResponses = ['yes', 'yeah', 'sure', 'ok', 'okay', 'tell me more', 'learn more', 'interested'];
  const isAffirmative = affirmativeResponses.some(response => lowerPrompt.includes(response));
  
  if (isAffirmative && !amount) {
    return generatePlatformResponse();
  }

  // Generate responses based on amount and conversation flow
  if (amount > 0) {
    return generateAllocationResponse(amount, userPersona);
  }

  // Initial greeting
  const name = userName || 'there';
  const persona = userPersona || 'Balanced investor';
  
  return `Hi ${name}! Based on your profile, you are **${persona}**. Let's create your personalized investment plan.

Would you like my assistance in:
A) Investing a specific amount (e.g., ₹50,000)
B) Achieving a specific goal (e.g., buying a house, retirement)

Please tell me which option you prefer!`;
}

function generateAllocationResponse(amount: number, userPersona?: string): string {
  try {
    const result = calculateAssetAllocation(userPersona || 'The Explorer', amount);
    
    let response = `Here's your suggested portfolio based on your ₹${amount.toLocaleString('en-IN')} investment:\n\n`;
    
    // Add allocation breakdown
    Object.entries(result.allocations).forEach(([category, allocation]) => {
      if (allocation.amount > 0) {
        response += `${category} — ${allocation.percent}% (₹${allocation.amount.toLocaleString('en-IN')})\n`;
      }
    });
    
    response += `\nWould you like to learn more about any of these categories?`;
    
    return response;
  } catch (error) {
    return `I can help you create a personalized portfolio for ₹${amount.toLocaleString('en-IN')}. Please let me know your investment persona so I can provide accurate allocation recommendations.`;
  }
}

function generateCategoryResponse(category: string, userPersona?: string): string {
  // Map category keywords to actual categories
  const categoryMap: { [key: string]: keyof typeof PRODUCT_INTELLIGENCE } = {
    'gold': 'Gold/Silver',
    'silver': 'Gold/Silver',
    'govt': 'Govt Schemes',
    'government': 'Govt Schemes',
    'government schemes': 'Govt Schemes',
    'fixed income': 'Fixed Income',
    'fd': 'Fixed Income',
    'fixed': 'Fixed Income',
    'mutual fund': 'Mutual Funds',
    'mutual funds': 'Mutual Funds',
    'mutual': 'Mutual Funds',
    'equity': 'Equities',
    'equities': 'Equities',
    'stock': 'Equities',
    'stocks': 'Equities',
    'crypto': 'Crypto',
    'cryptocurrency': 'Crypto',
    'bitcoin': 'Crypto'
  };

  const actualCategory = categoryMap[category] || 'Mutual Funds';
  const productInfo = PRODUCT_INTELLIGENCE[actualCategory];

  let response = `${actualCategory} are great for diversifying your portfolio!\n\n`;
  response += `Here are some examples:\n`;
  productInfo.products.slice(0, 3).forEach(product => {
    response += `• ${product}\n`;
  });
  
  response += `\nLearn more: ${productInfo.learn[0]}\n\n`;
  response += `Would you like me to show example platforms or current returns for this category?`;

  return response;
}

function generatePlatformResponse(): string {
  return `**Current Investment Platforms & Returns (as of 2024):**

**🏛️ Government Schemes:**
• PPF: 7.1% annual return (15-year lock-in)
• NSC: 6.8% annual return (5-year term)
• Sukanya Samridhi: 8.2% annual return
• ELSS Tax Saver: 10-15% average returns

**📱 Trusted Platforms:**
• **Groww** - Beginner-friendly, zero brokerage on mutual funds
• **Zerodha** - Low-cost trading, excellent research tools
• **Kuvera** - Free mutual fund investments
• **HDFC Securities** - Full-service broker with advisory

**⚠️ Important:** Always review historical returns, expense ratios, and lock-in periods before investing. Past performance doesn't guarantee future results.

Would you like specific recommendations for your ${userPersona || 'investment'} profile?`;
}