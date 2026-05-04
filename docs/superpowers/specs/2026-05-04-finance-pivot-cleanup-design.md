# Finance Pivot Cleanup & Feature Audit — Design Spec

**Date:** 2026-05-04
**Status:** Approved

---

## Overview

The app was originally built as an AI Diet Consultant and pivoted to an AI Financial Behavioral Coach. The AI system prompt, frontend screens, data models, and API routes were updated for finance — but the pivot was incomplete. This spec covers three phases:

1. **Cleanup** — Remove all remaining diet/nutrition references and fix the broken registration flow
2. **Bug Fixes** — Wire up three broken features that exist in code but don't work
3. **New Features** — Build out two stubbed UI actions into real screens

---

## Phase 1: Cleanup

Remove every diet/nutrition reference and fix the critical registration bug.

### Backend

**`backend/src/controllers/auth.controller.ts`** — Critical bug
- Delete the `calculateNutritionGoals()` function entirely (BMR calculation, calorie/macro math)
- Rewrite the `register()` normalizedProfile to use financial fields:
  - `age` (default 25)
  - `monthlyIncome` (default 0)
  - `primaryGoal` (default `"budget_control"`)
  - `riskTolerance` (default `"moderate"`)
  - `spendingCategories` (default `[]`)
- Remove the `nutritionGoals` spread from the `User.create()` call
- Registration currently fails silently because the User model schema expects financial fields but receives diet fields

**`backend/src/scripts/seed.ts`**
- Replace diet profile (`height`, `weight`, `goal: "maintain"`, `activityLevel`, `dietaryPreferences`, `dailyCalorieGoal`, `macroGoals`, `unitPreference`) with valid financial profile:
  ```ts
  profile: {
    age: 30,
    monthlyIncome: 4000,
    primaryGoal: "budget_control",
    riskTolerance: "moderate",
    spendingCategories: [],
  }
  ```

**`backend/src/server.ts`**
- Change banner: `"AI Diet Consultant Backend Server"` → `"AI Finance Coach Backend Server"`
- Remove `Meals:` line from the endpoint list in startup log

**`backend/src/services/ai/gemini.service.ts`**
- Rename JSDoc on `getSystemPrompt()`: `"Get system prompt for nutrition expert"` → `"Get system prompt for financial coach"`

**`backend/src/services/ai/openai.service.ts`**
- Same JSDoc rename on `getSystemPrompt()`
- Fix inline comment: `"Add system message with nutrition expert context"` → `"Add system message with financial coach context"`

**`backend/src/controllers/transaction.controller.ts`**
- Remove stale comment: `"Removed getMealSuggestions as it's not directly applicable..."`

**`backend/src/controllers/user.controller.ts`**
- Remove stale comments: `"Changed MealLog to Transaction"` (appears twice)

### Documentation

**`ARCHITECTURE.md`** — Full rewrite
- Title: AI Finance Coach — Architecture Documentation
- Update System Overview to describe financial behavioral coaching app
- Update Database Schema section: remove Meal and MealLog collections; document correct User (financial profile), Transaction (with mood/trigger), and Chat schemas
- Update Data Flow section: replace "Daily Summary Flow" with "Spending Summary Flow"; replace meal-related flows with transaction flows
- Update all other sections to reflect the finance domain (no diet references)

---

## Phase 2: Bug Fixes

### 1. Dashboard Spending Summary Not Loading

**File:** `frontend/src/screens/DashboardScreen.tsx`

**Problem:** `getSpendingSummary()` call is commented out. The dashboard always shows `$0 spent of $100 limit` regardless of actual data.

**Fix:**
- Import `userApi` and call `userApi.getSpendingSummary()` in the `useEffect` on mount
- Call `useUserStore.getState().setSpendingSummary(result)` with the response
- Also call it inside `onRefresh`
- The backend endpoint `GET /api/user/spending-summary` already exists and returns the correct shape

### 2. "See All" Transactions Broken

**Files:**
- `frontend/src/screens/AllTransactionsScreen.tsx` — new file
- `frontend/src/navigation/types.ts` — add `AllTransactions` route
- `frontend/src/navigation/AppNavigator.tsx` — register the screen
- `frontend/src/screens/DashboardScreen.tsx` — update "See All" press handler

**Problem:** "See All" navigates to `TransactionDetail` with `transactionId: "all"`. `TransactionDetailScreen` tries to find a transaction with `_id === "all"`, finds nothing, and shows "Loading..." forever.

**Fix:**
- Create `AllTransactionsScreen`: fetches all transactions (no date filter) on mount, groups them by date, shows a flat list with each item navigating to `TransactionDetailScreen`
- Add a filter bar at the top: All / Emotional (mood !== neutral) / By Category (dropdown)
- Running daily total shown in each date group header
- Add `AllTransactions: undefined` to `RootStackParamList`
- Change the "See All" press to `navigation.navigate("AllTransactions")`

### 3. Profile Changes Not Persisted

**File:** `frontend/src/screens/ProfileScreen.tsx`

**Problem:** `handleGoalChange`, `handleRiskChange`, and `toggleCategory` update the Zustand store only. Changes are lost on app restart/refresh because the backend is never called.

**Fix:**
- Import `userApi` and call `userApi.updateProfile({ profile: { ... } })` in each handler
- `handleGoalChange` and `handleRiskChange`: call API immediately on selection
- `toggleCategory`: debounce the API call by 500ms (fires on each chip tap; debounce prevents multiple rapid requests)
- On API error, revert the local store state and show a brief error alert

---

## Phase 3: New Features

### 1. Scan Receipt Screen

**Files:**
- `frontend/src/screens/ScanReceiptScreen.tsx` — new file
- `frontend/src/navigation/types.ts` — add `ScanReceipt` route
- `frontend/src/navigation/AppNavigator.tsx` — register as modal
- `frontend/src/screens/DashboardScreen.tsx` — wire "Scan Receipt" button
- `frontend/src/screens/LogTransactionScreen.tsx` — accept pre-fill params

**Design:**
- Modal presentation (same as LogTransaction)
- Receipt-themed card UI with a text area: "Paste or type receipt text"
- "Parse Receipt" button extracts: merchant name (→ description), dollar amount (→ amount), date if present
- Uses a simple regex parser: `/\$?([\d,]+\.?\d*)/` for amount, last non-numeric line for merchant
- On parse, navigates to `LogTransactionScreen` with `{ prefill: { description, amount, date } }` as route params
- `LogTransactionScreen` reads `route.params?.prefill` and pre-populates fields on mount
- Close button dismisses the modal

**Why no camera:** `expo-camera` and `expo-image-picker` are not installed. Adding them requires EAS build changes (managed workflow native module). The manual entry approach gives the feature a proper home without adding a dependency.

### 2. All Transactions Screen

**File:** `frontend/src/screens/AllTransactionsScreen.tsx`

**Design:**
- Fetches all transactions from `transactionStore.fetchTransactions()` (no date param = all records)
- Groups by date using `date-fns` (already installed): `format(date, 'MMM d, yyyy')`
- Each group shows: date header + daily total on the right
- Each transaction row: category icon, description, mood badge, amount
- Filter bar (horizontal scroll chips at top): All, Emotional, Food, Transport, Shopping, Bills, Entertainment, Health, Other
- Tapping a transaction navigates to `TransactionDetailScreen`
- Pull-to-refresh support
- Empty state: "No transactions yet. Start logging your spending!"

---

## Navigation Changes Summary

Add to `RootStackParamList` in `frontend/src/navigation/types.ts`:
```ts
AllTransactions: undefined;
ScanReceipt: undefined;
```

Add to `AppNavigator.tsx` inside the authenticated stack:
```tsx
<RootStack.Screen name="AllTransactions" component={AllTransactionsScreen} />
<RootStack.Screen
  name="ScanReceipt"
  component={ScanReceiptScreen}
  options={{ presentation: 'modal' }}
/>
```

---

## Architecture After Changes

### Backend Routes (final)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/spending-summary
DELETE /api/user/account
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/:id
DELETE /api/transactions/:id
POST   /api/chat/message
GET    /api/chat/conversation
DELETE /api/chat/conversation
```

### Frontend Screens (final)
```
Auth flow:   Landing → Login / SignUp / ForgotPassword
Main tabs:   Dashboard | Coach (AIChat) | Profile | Settings
Modals:      LogTransaction, ScanReceipt
Stack:       TransactionDetail, AllTransactions
```

### Data Models (final)
```
User:        { email, password, name, profile: { age, monthlyIncome, riskTolerance, primaryGoal, spendingCategories }, refreshTokens }
Transaction: { userId, description, amount, category, mood, trigger, notes, date }
Chat:        { userId, messages: [{ role, content, timestamp }] }
```
