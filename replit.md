# ماشي (Mashi) - Arabic Marketplace App

## Overview
A full Arabic RTL marketplace web application built with React + Vite. Users can list products for sale, browse listings, manage favorites, receive orders, and get notifications. Powered by Firebase Firestore + Auth.

## Architecture

### Frontend: `artifacts/mashi/`
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS v4, Cairo font (Arabic), indigo-600 color scheme
- **Firebase**: v9 modular SDK (tree-shakable, faster load)
- **State**: React useState/useCallback (no global state library needed)

### Key Files
- `src/App.tsx` - Entry point, renders MashiApp
- `src/pages/MashiApp.tsx` - Main app logic, auth, state management
- `src/lib/firebase.ts` - Firebase init (singleton pattern)
- `src/lib/firestore.ts` - All Firestore operations
- `src/lib/types.ts` - TypeScript types
- `src/components/` - All UI components

### Components
- `Header.tsx` - Top navigation with user dropdown
- `BottomNav.tsx` - Mobile-first bottom tab navigation
- `StoreView.tsx` - Product listing grid
- `MyProductsView.tsx` - Seller's own products
- `OrdersView.tsx` - Incoming orders with status management
- `FavoritesView.tsx` - Saved products
- `NotificationsView.tsx` - Real-time notifications
- `ProductCard.tsx` - Memoized product card
- `LoginModal.tsx` - Login/signup/reset/guest flow
- `AddProductModal.tsx` - Add new product listing
- `OrderModal.tsx` - Place order form
- `ConfirmModal.tsx` - Reusable confirmation dialog
- `Toast.tsx` - Notification toasts

## Performance Improvements
1. **Firebase v9 modular SDK** - Only imports what's used (tree-shaking)
2. **No page reloads** - All state managed with React (no `window.location.reload()`)
3. **Optimistic UI** - Likes/favorites update instantly before Firestore confirms
4. **Lazy images** - All product images use `loading="lazy"`
5. **Memoized components** - ProductCard wrapped in `React.memo`
6. **Singleton Firebase** - App only initialized once

## Firebase Config
- Project: `mashi-ddfbc`
- Collections: `products`, `users`, `favorites`, `orders`, `notifications`

## Guest Login Fix
- Guest button sets React state (`isGuest: true`) and navigates to store view
- Original issue: `window.location.reload()` caused full page reload
- Fix: Pure state update, no reload needed

## Running
- Dev server: `pnpm --filter @workspace/mashi dev`
- Port: 25222 (assigned by Replit)
