import React from "react";
import { Store, Package, ShoppingCart, Heart, Bell } from "lucide-react";
import type { View } from "../lib/types";

interface Props {
  currentView: View;
  onSwitchView: (v: View) => void;
  newOrdersCount: number;
  unreadNotifCount: number;
  myProductsCount: number;
  isLoggedIn: boolean;
  isGuest: boolean;
}

export default function BottomNav({
  currentView,
  onSwitchView,
  newOrdersCount,
  unreadNotifCount,
  myProductsCount,
  isLoggedIn,
  isGuest,
}: Props) {
  const navItems: { view: View; label: string; icon: React.ReactNode; badge?: number }[] = [
    { view: "store", label: "السوق", icon: <Store className="w-[18px] h-[18px]" /> },
    {
      view: "my_products",
      label: "إعلاناتي",
      icon: <Package className="w-[18px] h-[18px]" />,
      badge: isLoggedIn && !isGuest ? myProductsCount : undefined,
    },
    {
      view: "orders",
      label: "الطلبات",
      icon: <ShoppingCart className="w-[18px] h-[18px]" />,
      badge: newOrdersCount,
    },
    { view: "favorites", label: "المفضلة", icon: <Heart className="w-[18px] h-[18px]" /> },
    {
      view: "notifications",
      label: "الإشعارات",
      icon: <Bell className="w-[18px] h-[18px]" />,
      badge: unreadNotifCount,
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[999] bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] flex justify-around items-center px-2 safe-bottom"
      style={{ height: "60px", paddingBottom: "env(safe-area-inset-bottom)" }}
      dir="rtl"
    >
      {navItems.map(({ view, label, icon, badge }) => {
        const active = currentView === view;
        return (
          <button
            key={view}
            onClick={() => onSwitchView(view)}
            className={`flex-1 mx-0.5 px-1 py-1.5 rounded-[10px] text-[0.7rem] flex flex-col items-center justify-center h-11 min-h-[44px] min-w-[44px] relative transition-all font-bold ${
              active
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            style={{ fontFamily: "'Cairo', sans-serif" }}
          >
            <div className="mb-[3px]">{icon}</div>
            <span>{label}</span>
            {!!badge && badge > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
