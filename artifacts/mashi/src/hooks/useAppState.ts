import { useState, useCallback, useRef } from "react";
import type { Product, UserData, Favorite, Order, Notification, View } from "../lib/types";

export interface AppState {
  products: Product[];
  isLoggedIn: boolean;
  isGuest: boolean;
  userType: "user" | "store" | "guest" | null;
  currentView: View;
  favorites: Favorite[];
  likedProducts: Set<string>;
  myOrders: Order[];
  newOrdersCount: number;
  notifications: Notification[];
  unreadNotificationsCount: number;
  ordersTab: "pending" | "completed" | "cancelled" | "all";
  notificationsTab: "all" | "unread" | "orders" | "system";
  myProductsCount: number;
}

export function useAppState() {
  const [state, setState] = useState<AppState>({
    products: [],
    isLoggedIn: false,
    isGuest: false,
    userType: null,
    currentView: "store",
    favorites: [],
    likedProducts: new Set(),
    myOrders: [],
    newOrdersCount: 0,
    notifications: [],
    unreadNotificationsCount: 0,
    ordersTab: "pending",
    notificationsTab: "all",
    myProductsCount: 0,
  });

  const userIdRef = useRef<string | null>(null);
  const userDataRef = useRef<UserData | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setUser = useCallback((id: string | null, data: UserData | null) => {
    userIdRef.current = id;
    userDataRef.current = data;
    setUserId(id);
    setUserData(data);
  }, []);

  return {
    state,
    setState,
    updateState,
    userId,
    userData,
    userIdRef,
    userDataRef,
    setUser,
  };
}
