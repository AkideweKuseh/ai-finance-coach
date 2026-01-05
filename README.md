# AI Diet Consultant App

A **simple, production-ready MVP** of an Android-first AI Diet Consultant app built with React Native (Expo) and Node.js.

## 📋 Product Overview

**App Type:** Mobile AI Diet Consultant  
**Platform:** React Native (Expo)  
**Design Philosophy:** Pixel-perfect implementation of provided UI designs

### Available Screens

1. **AI Chat / Consult** - Interactive nutrition consultation with AI
2. **Dashboard / Home** - Daily calorie tracking and macro overview
3. **Meal / Recipe Detail** - Detailed meal information with ingredients
4. **Profile & Goals** - User profile and fitness goal management
5. **Settings** - App preferences and account management

---

## 🛠️ Tech Stack

### Frontend

- **React Native** (Expo) - Cross-platform mobile framework
- **React Navigation** - Screen navigation
- **Zustand** - Lightweight state management
- **Axios** - HTTP client for API calls
- **expo-secure-store** - Secure JWT token storage

### Backend

- **Node.js** + **Express** - REST API server
- **MongoDB** (Mongoose) - NoSQL database
- **JWT** - Access & refresh token authentication
- **bcrypt** - Password hashing
- **dotenv** - Environment configuration

### AI Provider (Configurable)

- **OpenAI API** (GPT models)
- **Google Gemini API**

The AI provider is controlled by a single environment variable, allowing easy switching between providers without code changes.

---

## 🎨 Design System

All UI elements follow a **centralized theme system** ensuring consistency and easy customization.

### Theme Components

- **Colors**: Primary, accent, background, surface, text colors
- **Typography**: Font families, sizes, and weights
- **Spacing**: Consistent spacing tokens (xs, sm, md, lg, xl)
- **Border Radius**: Standardized corner radii
- **Elevation**: Shadow presets

### Dark Mode

Dark mode is the default and fully supported. The theme system enables easy switching between light and dark modes.

### Modifying UI Themes

All theme values are centralized in `frontend/src/theme/`:

```
frontend/src/theme/
├── colors.ts        # Color palette
├── typography.ts    # Font families & sizes
├── spacing.ts       # Spacing scale
├── radius.ts        # Border radius values
└── index.ts         # Main theme export
```

To change the primary color, simply edit `frontend/src/theme/colors.ts`:

```typescript
export const colors = {
  primary: "#2f7f34", // Change this value
  // ... other colors
};
```

---

## 📁 Folder Structure

```
ai-diet-consultant/
├── README.md
├── .gitignore
├── frontend/
│   ├── app.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── babel.config.js
│   ├── App.tsx
│   ├── .env.example
│   └── src/
│       ├── assets/
│       │   └── ui-designs/    # Original HTML/image designs (read-only)
│       ├── theme/
│       │   ├── colors.ts
│       │   ├── typography.ts
│       │   ├── spacing.ts
│       │   ├── radius.ts
│       │   └── index.ts
│       ├── navigation/
│       │   ├── AppNavigator.tsx
│       │   └── types.ts
│       ├── screens/
│       │   ├── AIChatScreen.tsx
│       │   ├── DashboardScreen.tsx
│       │   ├── MealDetailScreen.tsx
│       │   ├── ProfileScreen.tsx
│       │   ├── SettingsScreen.tsx
│       │   └── AuthScreen.tsx
│       ├── components/
│       │   ├── common/
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   └── ProgressBar.tsx
│       │   ├── chat/
│       │   │   ├── MessageBubble.tsx
│       │   │   ├── QuickReplyChip.tsx
│       │   │   └── MealCard.tsx
│       │   └── dashboard/
│       │       ├── CalorieRing.tsx
│       │       ├── MacroBar.tsx
│       │       └── MealSuggestionCard.tsx
│       ├── stores/
│       │   ├── authStore.ts
│       │   ├── userStore.ts
│       │   ├── chatStore.ts
│       │   └── mealStore.ts
│       ├── api/
│       │   ├── client.ts
│       │   ├── auth.ts
│       │   ├── chat.ts
│       │   ├── meals.ts
│       │   └── user.ts
│       └── types/
│           ├── user.ts
│           ├── meal.ts
│           └── chat.ts
└── backend/
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── server.ts
        ├── app.ts
        ├── routes/
        │   ├── auth.routes.ts
        │   ├── user.routes.ts
        │   ├── chat.routes.ts
        │   └── meal.routes.ts
        ├── controllers/
        │   ├── auth.controller.ts
        │   ├── user.controller.ts
        │   ├── chat.controller.ts
        │   └── meal.controller.ts
        ├── models/
        │   ├── User.model.ts
        │   ├── Chat.model.ts
        │   └── Meal.model.ts
        ├── middleware/
        │   ├── auth.middleware.ts
        │   ├── error.middleware.ts
        │   └── validate.middleware.ts
        ├── utils/
        │   ├── jwt.util.ts
        │   └── password.util.ts
        ├── services/
        │   └── ai/
        │       ├── provider.interface.ts
        │       ├── openai.service.ts
        │       ├── gemini.service.ts
        │       └── aiService.ts
        └── config/
            ├── database.ts
            └── environment.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **MongoDB** (local or Atlas)
- **Expo CLI** (`npm install -g expo-cli`)
- API Key for **OpenAI** or **Google Gemini**

### Installation

#### 1. Clone and Install

```bash
cd ai-diet-consultant

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

#### 2. Configure Environment Variables

**Backend** (`backend/.env`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/ai-diet-consultant

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# AI Provider Selection (openai | gemini)
AI_PROVIDER=openai

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4-turbo-preview

# Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-pro
```

**Frontend** (`frontend/.env`):

```env
# API Configuration
API_BASE_URL=http://localhost:5000/api
APP_ENV=development
```

#### 3. Start MongoDB

```bash
# If using local MongoDB
mongod
```

#### 4. Run the Backend

```bash
cd backend
npm run dev
```

The backend API will start on `http://localhost:5000`

#### 5. Run the Frontend

```bash
cd frontend
npx expo start
```

Scan the QR code with Expo Go app (iOS/Android) or press `a` for Android emulator, `i` for iOS simulator.

---

## 🔄 Switching AI Providers

The app supports both OpenAI and Google Gemini. To switch providers:

1. Open `backend/.env`
2. Change `AI_PROVIDER` to either `openai` or `gemini`
3. Ensure the corresponding API key is set
4. Restart the backend server

The AI abstraction layer automatically routes requests to the selected provider without any code changes.

---

## 🎯 AI Behavior & Safety

### AI Personality

- Acts strictly as a **nutrition expert**
- Friendly, supportive, and professional tone
- Uses light food & health-related emojis (🥗, 🥑, 💪)
- Provides concise, well-formatted responses

### Safety Rules

- Rejects non-nutrition questions politely
- Provides **general dietary advice only**
- Avoids medical diagnosis
- Includes user profile context in consultations
- Fallback responses if AI provider fails

### Response Formatting

- Clear headings and bullet points
- Short paragraphs for readability
- Macro breakdowns for meal suggestions
- Calorie information included

---

## 📊 Features

### ✅ Authentication

- Email/password registration and login
- JWT access & refresh token system
- Secure token storage (expo-secure-store)
- Automatic token refresh

### ✅ User Profile

- Age, height, weight tracking
- Fitness goals (lose fat, maintain, build muscle)
- Activity level selection
- Dietary preferences (vegan, paleo, keto, etc.)

### ✅ AI Chat Consultant

- Real-time nutrition advice
- Context-aware responses (includes user profile)
- Chat history persistence
- Rich media meal cards with macros
- Quick reply suggestions

### ✅ Dashboard

- Daily calorie tracking with progress ring
- Macro breakdown (protein, carbs, fat)
- AI-powered meal recommendations
- Quick action buttons (Ask Coach, Snap Meal, Text Log)

### ✅ Meal System

- Predefined meal database
- Detailed recipe views with ingredients
- Step-by-step preparation instructions
- Macro and calorie information
- Meal logging to daily totals

### ✅ Settings

- Theme toggle (dark/light mode)
- Unit preferences (metric/imperial)
- Notification settings
- Privacy controls
- Data export

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## 📦 Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend (EAS Build)

```bash
cd frontend
eas build --platform android
eas build --platform ios
```

---

## 🔐 Security Considerations

- All passwords are hashed with bcrypt (10 rounds)
- JWT tokens stored securely in expo-secure-store
- Refresh tokens for extended sessions
- Environment variables for sensitive data
- MongoDB connection with authentication
- Input validation and sanitization

---

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB is running
- Verify `.env` file exists with correct values
- Ensure port 5000 is not in use

### Frontend can't connect to API

- Verify `API_BASE_URL` in frontend `.env`
- For Android emulator, use `http://10.0.2.2:5000/api`
- For iOS simulator, use `http://localhost:5000/api`
- For physical device, use your computer's local IP

### AI responses not working

- Verify `AI_PROVIDER` is set correctly
- Check API key for the selected provider
- Review backend logs for error messages

---

## 📖 Architecture Decisions

### Why Zustand over Redux?

- Minimal boilerplate
- Simpler learning curve
- Sufficient for MVP scope
- Excellent TypeScript support

### Why Expo over React Native CLI?

- Faster development setup
- Built-in tooling (navigation, secure storage)
- Easy testing on physical devices
- Simplified build process with EAS

### Why MongoDB over PostgreSQL?

- Flexible schema for MVP iteration
- Easier JSON data handling
- Better fit for chat history storage
- Simpler deployment options

### Why JWT over Sessions?

- Stateless authentication
- Mobile-friendly
- Scales better for future growth
- Refresh token pattern for security

---

## 🔮 Future Enhancements (Out of MVP Scope)

- Camera-based meal logging (ML vision)
- Water intake tracking
- Exercise logging
- Social features (friends, sharing)
- Meal planning calendar
- Grocery list generation
- Barcode scanning
- Integration with fitness trackers
- Multi-language support
- Push notifications

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

This is an MVP project. Contributions welcome but must follow the design-strict principles:

- Match UI designs exactly
- Use global theme system
- Keep code minimal and readable
- Document all features

---

## 📞 Support

For questions or issues, please open a GitHub issue or contact the maintainers.

---

**Built with ❤️ following design-strict, minimal, and teachable principles.**
