import React from "react";
import { Bell, Check, Trash2, CheckCheck, ShoppingCart } from "lucide-react";
import type { Notification } from "../lib/types";

type Tab = "all" | "unread" | "orders" | "system";

interface Props {
  notifications: Notification[];
  tab: Tab;
  onTabChange: (t: Tab) => void;
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteAllRead: () => void;
  onViewOrder: (orderId: string) => void;
}

export default function NotificationsView({
  notifications,
  tab,
  onTabChange,
  unreadCount,
  onMarkRead,
  onDelete,
  onMarkAllRead,
  onDeleteAllRead,
  onViewOrder,
}: Props) {
  const filtered = notifications.filter((n) => {
    if (tab === "all") return true;
    if (tab === "unread") return !n.isRead;
    if (tab === "orders") return n.type === "order";
    if (tab === "system") return n.type === "system" || n.type === "promo";
    return true;
  });

  const tabItems: { key: Tab; label: string; count?: number }[] = [
    { key: "all", label: "الكل", count: notifications.length },
    { key: "unread", label: "غير مقروء", count: unreadCount },
    { key: "orders", label: "طلبات", count: notifications.filter((n) => n.type === "order").length },
    { key: "system", label: "نظام", count: notifications.filter((n) => n.type === "system" || n.type === "promo").length },
  ];

  const iconColor: Record<string, string> = {
    order: "bg-green-100 text-green-600",
    system: "bg-blue-100 text-blue-600",
    promo: "bg-purple-100 text-purple-600",
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-blue-500 rounded-full" />
          <h2 className="text-2xl font-black text-gray-900">الإشعارات</h2>
          {unreadCount > 0 && (
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
              {unreadCount} جديد
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-blue-600 hover:text-blue-800 text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-50 border border-blue-200 flex items-center gap-1.5 min-h-[44px]"
          >
            <CheckCheck className="w-4 h-4" />
            قراءة الكل
          </button>
          <button
            onClick={onDeleteAllRead}
            className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-2 rounded-xl hover:bg-red-50 border border-red-200 flex items-center gap-1.5 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            حذف المقروءة
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-1">
        {tabItems.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all min-h-[44px] flex items-center gap-1.5 ${
              tab === key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
            {!!count && count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">لا توجد إشعارات في هذا التصنيف.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-4 border ${
                !n.isRead ? "border-blue-200 bg-blue-50/30" : "border-gray-100"
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor[n.type] || "bg-gray-100 text-gray-500"}`}>
                  {n.type === "order" ? (
                    <ShoppingCart className="w-5 h-5" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleDateString("ar-JO", {
                      year: "numeric", month: "long", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!n.isRead && (
                    <button
                      onClick={() => onMarkRead(n.id)}
                      className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                      title="تعليم كمقروء"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(n.id)}
                    className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {n.type === "order" && n.relatedId && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => { onMarkRead(n.id); onViewOrder(n.relatedId!); }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-2 min-h-[44px]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    عرض تفاصيل الطلب
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
