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

  // Generate responses based on amount and conversation flow
  if (amount > 0) {
    return generateAllocationResponse(amount, userPersona);
  }

  // Check for category-specific questions
  const categories = ['gold', 'silver', 'govt', 'government', 'fixed income', 'fd', 'mutual fund', 'equity', 'stock', 'crypto'];
  const mentionedCategory = categories.find(cat => lowerPrompt.includes(cat));
  
  if (mentionedCategory) {
    return generateCategoryResponse(mentionedCategory, userPersona);
  }

  // Initial greeting
  const name = userName || 'there';
  const persona = userPersona || 'Balanced investor';
  
  return `Hi ${name}! Based on your profile, you are **${persona}**. Let's create your personalized investment plan.

How much would you like to invest in total (in ₹)?`;
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
    'fixed income': 'Fixed Income',
    'fd': 'Fixed Income',
    'mutual fund': 'Mutual Funds',
    'equity': 'Equities',
    'stock': 'Equities',
    'crypto': 'Crypto'
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