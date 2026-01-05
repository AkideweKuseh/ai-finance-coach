# AI Diet Consultant - Architecture Documentation

## System Overview

This document provides a comprehensive overview of the AI Diet Consultant app architecture, explaining key design decisions and how components interact.

---

## Tech Stack Justification

### Frontend: React Native (Expo)

**Why Expo?**

- Faster development with managed workflow
- Built-in tooling (navigation, secure storage, fonts)
- Easy testing on physical devices via Expo Go
- Simplified build process with EAS Build
- Cross-platform (iOS, Android) from single codebase

**Alternative Considered:** React Native CLI

- Rejected due to more complex setup and configuration needs

### Backend: Node.js + Express

**Why Express?**

- Minimalist, flexible framework
- Large ecosystem of middleware
- Excellent TypeScript support
- Fast development for REST APIs

**Alternative Considered:** NestJS

- Rejected as overkill for MVP scope

### Database: MongoDB + Mongoose

**Why MongoDB?**

- Flexible schema allows rapid iteration during MVP
- Natural fit for JSON-heavy data (chat messages, meals)
- Easy to deploy (MongoDB Atlas)
- Good Node.js integration

**Alternative Considered:** PostgreSQL

- Rejected; relational structure not necessary for MVP

### State Management: Zustand

**Why Zustand?**

- Minimal boilerplate compared to Redux
- Simple API, easy to learn
- Excellent TypeScript support
- Sufficient for MVP scope

**Alternative Considered:** Redux Toolkit

- Rejected due to excessive boilerplate for simple app

### Authentication: JWT (Access + Refresh Tokens)

**Why JWT?**

- Stateless authentication
- Mobile-friendly
- Scalable
- Secure with refresh token pattern

**Flow:**

1. User logs in → Receives access token (15min) + refresh token (7 days)
2. Access token stored in memory, refresh token in secure storage
3. Access token sent with each request
4. When access token expires, use refresh token to get new one
5. If refresh token invalid, user must login again

---

## AI Provider Abstraction Layer

### The Problem

Different AI providers (OpenAI, Gemini) have different APIs and response formats.

### The Solution

**Provider Interface Pattern** - Single abstraction layer that:

- Defines common interface (`IAIProvider`)
- Implements provider-specific services
- Routes requests based on environment variable
- Allows switching providers without code changes

### Implementation

```
services/ai/
├── provider.interface.ts    # Common interface
├── openai.service.ts        # OpenAI implementation
├── gemini.service.ts        # Gemini implementation
└── aiService.ts             # Router/facade
```

**Flow:**

1. Controller calls `aiService.chat()`
2. `aiService` routes to correct provider (OpenAI or Gemini)
3. Provider implements standard interface
4. Response normalized to standard format
5. Controller receives consistent response

**Key Benefit:** Change `AI_PROVIDER` in `.env` → no code changes needed!

---

## Theme System Architecture

### The Problem

Hardcoded colors and styles make UI changes difficult and inconsistent.

### The Solution

**Centralized Theme System** - All visual design tokens in one place:

```
theme/
├── colors.ts       # Color palette
├── typography.ts   # Font families, sizes, weights
├── spacing.ts      # Spacing scale
├── radius.ts       # Border radius values
├── shadows.ts      # Shadow presets
└── index.ts        # Main export
```

**Usage:**

```typescript
import { colors, spacing, typography } from "../theme";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundDark,
    padding: spacing.screenPadding,
  },
  text: {
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.md,
  },
});
```

**Key Benefit:** Change primary color in ONE file → entire app updates!

---

## API Client Architecture

### The Problem

- Need to attach JWT tokens to requests
- Handle token refresh automatically
- Provide consistent error handling

### The Solution

**Axios Interceptors Pattern**

**Request Interceptor:**

- Automatically adds `Authorization: Bearer <token>` header
- Gets token from Zustand store

**Response Interceptor:**

- Catches 401 errors (expired token)
- Automatically requests new access token using refresh token
- Retries original request with new token
- If refresh fails → logout user

**Flow:**

```
API Call
  ↓
Request Interceptor (add token)
  ↓
Server
  ↓
Response (401?)
  ↓
Response Interceptor
  ↓
Refresh Token
  ↓
Retry Request
  ↓
Success
```

---

## Data Flow Architecture

### Authentication Flow

```
User Login
  ↓
AuthScreen → authApi.login()
  ↓
Backend validates credentials
  ↓
Returns: user, accessToken, refreshToken
  ↓
authStore.setTokens() (saves to secure storage)
  ↓
userStore.setUser()
  ↓
Navigation → Main App
```

### Chat Flow

```
User sends message
  ↓
AIChatScreen → chatApi.sendMessage()
  ↓
Backend gets user profile
  ↓
Formats context for AI
  ↓
Calls aiService.chat()
  ↓
Routes to OpenAI/Gemini
  ↓
AI generates response
  ↓
Saves to Chat model
  ↓
Returns message
  ↓
chatStore.addMessage()
  ↓
UI updates
```

### Daily Summary Flow

```
DashboardScreen loads
  ↓
userApi.getDailySummary()
  ↓
Backend queries MealLog collection
  ↓
Calculates totals
  ↓
Compares to user's goals
  ↓
Returns summary
  ↓
userStore.setDailySummary()
  ↓
UI shows progress rings/bars
```

---

## Database Schema Design

### User Collection

```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  profile: {
    age, height, weight,
    goal: 'lose' | 'maintain' | 'gain',
    activityLevel: 'sedentary' | ... | 'athlete',
    dailyCalorieGoal: Number,
    macroGoals: { protein, carbs, fat },
    dietaryPreferences: [String],
  },
  refreshTokens: [String],
}
```

### Chat Collection

```javascript
{
  userId: ObjectId,
  messages: [
    {
      role: 'user' | 'assistant',
      content: String,
      timestamp: Date,
      metadata: { /* meal suggestions, etc */ }
    }
  ]
}
```

### Meal Collection

```javascript
{
  name, description, imageUrl,
  calories: Number,
  macros: { protein, carbs, fat },
  ingredients: [{ name, amount }],
  instructions: [{ stepNumber, instruction }],
  prepTime, cookTime, servings,
  difficulty: 'easy' | 'medium' | 'hard',
  tags: [String],
  mealType: ['breakfast', 'lunch', 'dinner', 'snack'],
}
```

### MealLog Collection

```javascript
{
  userId: ObjectId,
  mealId: ObjectId,
  date: Date,
  mealType: String,
  servings: Number,
}
```

---

## Security Considerations

### Password Security

- Hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Never returned in API responses

### JWT Security

- Access tokens: short-lived (15 minutes)
- Refresh tokens: longer-lived (7 days)
- Refresh tokens stored in secure storage (encrypted)
- Tokens invalidated on logout

### API Security

- CORS configured for specific origins
- Rate limiting (100 requests per 15 min)
- Helmet.js for HTTP header security
- Input validation with express-validator
- MongoDB injection prevention via Mongoose

### Environment Variables

- API keys never committed to version control
- `.env` in `.gitignore`
- Separate configs for dev/prod

---

## Error Handling Strategy

### Backend

- Centralized error middleware
- Custom `AppError` class for operational errors
- Automatic error logging in development
- Sanitized error messages to client
- Fallback AI responses on provider errors

### Frontend

- Try-catch in all API calls
- User-friendly error messages
- Loading states for async operations
- Retry logic for failed requests (via axios interceptor)

---

## Performance Optimizations

### Backend

- Database indexes on frequently queried fields
- Limit chat history to last 50 messages
- Efficient aggregation for daily summaries

### Frontend

- Zustand prevents unnecessary re-renders
- Lazy loading of screens (React Navigation)
- Image optimization (cached by Expo)
- Debounced API calls where appropriate

---

## Scalability Considerations

### Current MVP Limitations

- Single AI provider at a time
- In-memory session (no distributed caching)
- Basic meal recommendation algorithm

### Future Scalability Path

1. **Database:** Add read replicas for MongoDB
2. **Caching:** Add Redis for session management
3. **Load Balancing:** Deploy multiple backend instances
4. **CDN:** Serve static assets from CDN
5. **Queue:** Use Bull/RabbitMQ for async tasks (email, notifications)
6. **Microservices:** Split AI service if needed

---

## Testing Strategy

### Backend Tests

- Unit tests: Services, utilities
- Integration tests: API endpoints
- Mock external dependencies (OpenAI, MongoDB)

### Frontend Tests

- Component tests: React Testing Library
- Store tests: Zustand state management
- E2E tests: Detox (future)

---

## Deployment Architecture

### Backend Deployment

```
Code → GitHub
  ↓
CI/CD (GitHub Actions)
  ↓
Docker Container
  ↓
Cloud Platform (Heroku, Railway, AWS)
  ↓
MongoDB Atlas
```

### Frontend Deployment

```
Code → GitHub
  ↓
EAS Build (Expo)
  ↓
App Bundle (.aab, .ipa)
  ↓
Google Play Store / Apple App Store
```

---

## Design-Strict Principles

This project follows **design-strict** principles:

1. **No UI creativity** - Match designs exactly
2. **Centralized theming** - All design tokens in theme files
3. **No inline styles** - Use StyleSheet and theme
4. **Documented features** - Every feature explained
5. **Minimal code** - No unnecessary abstractions
6. **Teachable** - Code is readable and well-commented

---

## Extending the System

### Adding a New AI Provider

1. Create `newProvider.service.ts` implementing `IAIProvider`
2. Add config to `config/environment.ts`
3. Update `aiService.ts` router
4. Add API key to `.env.example`
5. Done! No other code changes needed.

### Adding a New Screen

1. Create component in `src/screens/`
2. Add route to `AppNavigator.tsx`
3. Add types to `navigation/types.ts`
4. Use theme system for styling
5. Connect to stores for state

### Adding a New API Endpoint

1. Add controller function in `controllers/`
2. Add route in `routes/`
3. Add validation middleware if needed
4. Update API client in frontend
5. Update TypeScript types

---

## Common Patterns

### Async Error Handling

```typescript
export const myFunction = catchAsync(async (req, res) => {
  // Your code
  // Errors automatically caught and sent to error middleware
});
```

### Protected Routes

```typescript
router.get("/protected", authenticate, myController);
```

### Zustand Store Pattern

```typescript
export const useMyStore = create<MyState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
  clearData: () => set({ data: null }),
}));
```

---

This architecture is designed to be:

- ✅ **Simple** - Easy to understand
- ✅ **Maintainable** - Clean separation of concerns
- ✅ **Scalable** - Can grow with needs
- ✅ **Secure** - Best practices for auth and data
- ✅ **Flexible** - Easy to swap providers/services
- ✅ **Documented** - Well-explained design decisions

For implementation details, refer to the inline code comments.
