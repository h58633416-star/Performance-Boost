import React, { useState } from "react";
import { Store, Bell, Heart, UserPlus, Plus, LogOut, Package, ShoppingCart, PlusCircle, ChevronLeft, CheckCircle, AlertCircle } from "lucide-react";
import type { UserData, View } from "../lib/types";

interface Props {
  isLoggedIn: boolean;
  isGuest: boolean;
  userType: "user" | "store" | "guest" | null;
  userData: UserData | null;
  userId: string | null;
  unreadNotifCount: number;
  favoritesCount: number;
  newOrdersCount: number;
  onShowLogin: () => void;
  onShowAddModal: () => void;
  onLogout: () => void;
  onSwitchView: (v: View) => void;
  onResendVerification: () => void;
}

export default function Header({
  isLoggedIn,
  isGuest,
  userType,
  userData,
  userId,
  unreadNotifCount,
  favoritesCount,
  newOrdersCount,
  onShowLogin,
  onShowAddModal,
  onLogout,
  onSwitchView,
  onResendVerification,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const avatarContent = () => {
    if (!isLoggedIn || !userData) return null;
    if (isGuest) {
      return (
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md relative"
          style={{ background: "linear-gradient(135deg, #4ade80 0%, #22d3ee 100%)" }}
        >
          <span>ز</span>
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        </div>
      );
    }
    const cls =
      userType === "store"
        ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    const initials = (userData.displayName || "م").charAt(0).toUpperCase();
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md relative"
        style={{ background: cls }}
      >
        {initials}
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </div>
    );
  };

  return (
    <header
      className="bg-white/90 border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-md"
      dir="rtl"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onSwitchView("store")}
        >
          <div className="bg-indigo-600 text-white p-2 rounded-xl">
            <Store className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">ماشي</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSwitchView("notifications")}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Bell className="w-6 h-6" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                {unreadNotifCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSwitchView("favorites")}
            className="p-2 text-gray-600 hover:text-red-500 transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Heart className="w-6 h-6" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                {favoritesCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setDropdownOpen((v) => !v)}
              >
                {avatarContent()}
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-700">{userData?.displayName}</p>
                  <div className="text-xs">
                    {userData?.emailVerified === false ? (
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">
                        <AlertCircle className="w-3 h-3" />
                        <span>غير مفعّل</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onResendVerification(); }}
                          className="text-yellow-600 hover:text-yellow-800 underline text-xs mr-1"
                        >
                          إعادة
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 ${
                          userType === "store"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {userType === "store" ? "متجر" : isGuest ? "زائر" : "مستخدم"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div
                    className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50"
                    style={{ direction: "rtl" }}
                  >
                    <div className="p-2">
                      <button
                        onClick={() => { onSwitchView("my_products"); setDropdownOpen(false); }}
                        className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-between"
                      >
                        <span>إعلاناتي</span>
                        <Package className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => { onSwitchView("orders"); setDropdownOpen(false); }}
                        className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-green-500" />
                          طلباتي
                        </span>
                        <div className="flex items-center gap-2">
                          {newOrdersCount > 0 && (
                            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                              {newOrdersCount}
                            </span>
                          )}
                          <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                      <button
                        onClick={() => { onSwitchView("favorites"); setDropdownOpen(false); }}
                        className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          المفضلة
                        </span>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => { onSwitchView("notifications"); setDropdownOpen(false); }}
                        className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-blue-500" />
                          الإشعارات
                        </span>
                        <div className="flex items-center gap-2">
                          {unreadNotifCount > 0 && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                              {unreadNotifCount}
                            </span>
                          )}
                          <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </div>
                      </button>
                      <button
                        onClick={() => { onShowAddModal(); setDropdownOpen(false); }}
                        className="w-full text-right px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-between"
                      >
                        <span>إضافة إعلان جديد</span>
                        <PlusCircle className="w-4 h-4 text-gray-400" />
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button
                        onClick={() => { onLogout(); setDropdownOpen(false); }}
                        className="w-full text-right px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 font-medium flex items-center justify-between"
                      >
                        <span>تسجيل الخروج</span>
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onShowLogin}
                className="text-gray-700 hover:text-indigo-600 font-bold py-2 px-4 transition-colors hidden sm:inline min-h-[44px]"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={onShowLogin}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 min-h-[44px]"
              >
                <UserPlus className="w-5 h-5" />
                <span className="hidden sm:inline">إنشاء حساب</span>
              </button>
            </div>
          )}

          <button
            onClick={onShowAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">إضافة إعلان</span>
          </button>
        </div>
      </div>
    </header>
  );
}
