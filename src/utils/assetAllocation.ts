export interface AssetAllocation {
  'Gold/Silver': { percent: number; amount: number };
  'Govt Schemes': { percent: number; amount: number };
  'Fixed Income': { percent: number; amount: number };
  'Mutual Funds': { percent: number; amount: number };
  'Equities': { percent: number; amount: number };
  'Crypto': { percent: number; amount: number };
}

export interface AllocationResult {
  persona: string;
  total_investment: number;
  allocations: AssetAllocation;
  recommended_categories: string[];
}

// Asset allocation percentages by persona
const ALLOCATION_MATRIX = {
  'The Guardian': {
    'Gold/Silver': 20,
    'Govt Schemes': 30,
    'Fixed Income': 35,
    'Mutual Funds': 15,
    'Equities': 0,
    'Crypto': 0
  },
  'The Planner': {
    'Gold/Silver': 15,
    'Govt Schemes': 20,
    'Fixed Income': 35,
    'Mutual Funds': 20,
    'Equities': 10,
    'Crypto': 0
  },
  'The Explorer': {
    'Gold/Silver': 10,
    'Govt Schemes': 15,
    'Fixed Income': 20,
    'Mutual Funds': 25,
    'Equities': 25,
    'Crypto': 5
  },
  'The Hustler': {
    'Gold/Silver': 5,
    'Govt Schemes': 10,
    'Fixed Income': 15,
    'Mutual Funds': 25,
    'Equities': 35,
    'Crypto': 10
  },
  'The Maverick': {
    'Gold/Silver': 0,
    'Govt Schemes': 5,
    'Fixed Income': 10,
    'Mutual Funds': 20,
    'Equities': 45,
    'Crypto': 20
  }
} as const;

export function calculateAssetAllocation(persona: string, totalAmount: number): AllocationResult {
  const percentages = ALLOCATION_MATRIX[persona as keyof typeof ALLOCATION_MATRIX];
  
  if (!percentages) {
    throw new Error(`Unknown persona: ${persona}`);
  }

  const allocations: AssetAllocation = {
    'Gold/Silver': {
      percent: percentages['Gold/Silver'],
      amount: Math.round((totalAmount * percentages['Gold/Silver']) / 100)
    },
    'Govt Schemes': {
      percent: percentages['Govt Schemes'],
      amount: Math.round((totalAmount * percentages['Govt Schemes']) / 100)
    },
    'Fixed Income': {
      percent: percentages['Fixed Income'],
      amount: Math.round((totalAmount * percentages['Fixed Income']) / 100)
    },
    'Mutual Funds': {
      percent: percentages['Mutual Funds'],
      amount: Math.round((totalAmount * percentages['Mutual Funds']) / 100)
    },
    'Equities': {
      percent: percentages['Equities'],
      amount: Math.round((totalAmount * percentages['Equities']) / 100)
    },
    'Crypto': {
      percent: percentages['Crypto'],
      amount: Math.round((totalAmount * percentages['Crypto']) / 100)
    }
  };

  // Get recommended categories (those with >0% allocation)
  const recommended_categories = Object.entries(allocations)
    .filter(([_, allocation]) => allocation.percent > 0)
    .map(([category, _]) => category)
    .slice(0, 3); // Top 3 categories

  return {
    persona,
    total_investment: totalAmount,
    allocations,
    recommended_categories
  };
}

export const PRODUCT_INTELLIGENCE = {
  'Gold/Silver': {
    products: ['Groww Gold ETF', 'Nippon Silver ETF', 'Sovereign Gold Bonds'],
    learn: ['https://www.nism.ac.in/understanding-gold-etfs-and-silver-etfs/', 'https://invest.gold/']
  },
  'Govt Schemes': {
    products: ['PPF (7.1%)', 'NSC (5 yrs)', 'KVP (7.5%)', 'Sukanya Samridhi Account (8.2%)'],
    learn: ['https://www.indiapost.gov.in/banking-services/saving']
  },
  'Fixed Income': {
    products: ['HDFC Bank FD (7.86%)', 'Bajaj Finance 12M FD (6.6%)', 'HDFC Ltd Bonds (7.7%)', 'Shriram Finance Bonds (9%)'],
    learn: ['https://www.thefixedincome.com/blog/']
  },
  'Mutual Funds': {
    products: ['HDFC Liquid Fund', 'ICICI Balanced Advantage Fund', 'Kotak Debt Fund', 'HDFC Nifty 50 ETF'],
    learn: ['https://groww.in/p/beginners-guide-mutual-funds']
  },
  'Equities': {
    products: ['Large Cap (Top 100)', 'Mid Cap (Next 150)', 'Small Cap (<₹5,000 Cr)', 'Penny Stocks (<₹2,000 Cr)'],
    learn: ['https://zerodha.com/varsity/chapter/the-stock-markets/']
  },
  'Crypto': {
    products: ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'XRP'],
    learn: ['https://academy.binance.com/en/start-here', 'https://www.coinbase.com/en-gb/learn/crypto-basics']
  }
} as const;