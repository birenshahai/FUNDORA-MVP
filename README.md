# Fundora - Voice-Based Financial AI Assistant

A modern web application that provides voice-based investment advice for Indian users through an AI-powered assistant.

## Features

- **Voice-First Interface**: Interact with Fundora using natural speech
- **Persona Classification**: Onboarding questionnaire to classify users as Conservative, Balanced, or Aggressive investors
- **AI-Powered Advice**: Investment recommendations tailored to user's risk profile
- **Real-time Visualizations**: Animated sound waves during voice interactions
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Session Management**: Persistent user profiles with localStorage

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Voice Processing**: Web Speech API (Speech Recognition & Synthesis)
- **AI Integration**: OpenAI GPT API with fallback responses
- **State Management**: React Hooks + localStorage
- **Build Tool**: Vite

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup** (Optional)
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key for enhanced AI responses
   - The app works with fallback responses if no API key is provided

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Usage

1. **Login**: Enter your email to access Fundora
2. **Onboarding**: Answer 4 questions to determine your investment persona
3. **Voice Interaction**: Click the microphone button and ask investment questions
4. **Get Advice**: Receive personalized investment recommendations

## Browser Compatibility

- Chrome/Edge: Full support for Web Speech API
- Firefox: Limited speech recognition support
- Safari: Basic support with some limitations

## Investment Personas

- **Conservative**: Low-risk investments (FD, PPF, Debt Funds)
- **Balanced**: Mixed portfolio (60% Equity, 40% Debt)
- **Aggressive**: High-growth investments (Equity Funds, Stocks)

## Voice Commands Examples

- "I have ₹50,000 to invest, what should I do?"
- "Tell me about SIP investments"
- "Should I invest in mutual funds?"
- "What are the best tax-saving investments?"

## Features Highlights

- **Real-time Speech Recognition**: Uses Web Speech API for accurate voice-to-text
- **Natural Language Processing**: AI understands investment-related queries
- **Visual Feedback**: Animated sound waves show when user/AI is speaking
- **Contextual Responses**: Advice tailored to user's risk profile and Indian market
- **Responsive Design**: Optimized for both mobile and desktop usage

## Deployment

The application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

For enhanced AI responses, configure the OpenAI API key in your deployment environment.