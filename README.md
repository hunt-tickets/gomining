# GoMining Calculator

A powerful Bitcoin mining profitability calculator built with Expo SDK 54.

## Features

- 🏭 **Farm Management** - Track multiple virtual miners
- 📊 **Live Dashboard** - Real-time BTC price and difficulty tracking
- 🤖 **AI Advisor** - Get investment insights powered by Google Gemini
- ⚙️ **Customizable Settings** - Dark/Light mode, profile management
- 📱 **Cross-Platform** - iOS, Android, and Web support

## Tech Stack

- **Framework**: Expo SDK 54 / React Native 0.76
- **Navigation**: Expo Router
- **Styling**: Custom Design System with Atomic Design
- **Storage**: MMKV for local persistence
- **APIs**: CoinGecko (price), Blockchain.com (difficulty)
- **AI**: Google Gemini (web) / llama.rn (native - future)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Build for Web (Vercel)

```bash
npm run build:web
```

## Project Structure

```
gomining/
├── app/                    # Expo Router pages
├── components/
│   ├── atoms/             # Basic UI elements
│   └── molecules/         # Composite components
├── features/              # Feature modules
├── hooks/                 # Custom React hooks
├── services/              # API & storage services
├── theme/                 # Design tokens & theming
├── types/                 # TypeScript types
└── utils/                 # Utility functions
```

## Design System

The app uses the **Obsidian Mining** theme with:

- Dark mode by default
- Bitcoin Orange (#F7931A) as primary color
- Liquid Glass effects on iOS 26+
- Atomic Design component architecture

## License

MIT
