import React from "react";
import { ShoppingCart, CheckCircle, Clock, XCircle, Package, Eye } from "lucide-react";
import type { Order } from "../lib/types";

type Tab = "pending" | "completed" | "cancelled" | "all";

interface Props {
  orders: Order[];
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onUpdateStatus: (id: string, status: Order["orderStatus"]) => void;
  newOrdersCount: number;
}

export default function OrdersView({ orders, tab, onTabChange, onUpdateStatus, newOrdersCount }: Props) {
  const filtered = orders.filter((o) => {
    if (tab === "all") return true;
    if (tab === "pending") return o.orderStatus === "جديد" || o.orderStatus === "قيد الانتظار";
    if (tab === "completed") return o.orderStatus === "مكتمل";
    if (tab === "cancelled") return o.orderStatus === "ملغي";
    return true;
  });

  const tabItems: { key: Tab; label: string }[] = [
    { key: "pending", label: `قيد الانتظار (${orders.filter(o => o.orderStatus === "جديد" || o.orderStatus === "قيد الانتظار").length})` },
    { key: "completed", label: `مكتملة (${orders.filter(o => o.orderStatus === "مكتمل").length})` },
    { key: "cancelled", label: `ملغية (${orders.filter(o => o.orderStatus === "ملغي").length})` },
    { key: "all", label: `الكل (${orders.length})` },
  ];

  const statusConfig: Record<string, { cls: string; dot: string }> = {
    "جديد": { cls: "bg-green-100 text-green-800 border border-green-200", dot: "bg-green-500" },
    "قيد الانتظار": { cls: "bg-amber-100 text-amber-800 border border-amber-200", dot: "bg-amber-500" },
    "مكتمل": { cls: "bg-blue-100 text-blue-800 border border-blue-200", dot: "bg-blue-500" },
    "ملغي": { cls: "bg-red-100 text-red-800 border border-red-200", dot: "bg-red-500" },
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1.5 bg-green-600 rounded-full" />
        <h2 className="text-2xl font-black text-gray-900">الطلبات الواردة</h2>
        {newOrdersCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {newOrdersCount} جديد
          </span>
        )}
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6 pb-1">
        {tabItems.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all min-h-[44px] ${
              tab === key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">لا توجد طلبات في هذا التصنيف.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => {
            const sc = statusConfig[o.orderStatus] || statusConfig["جديد"];
            const isNew = o.orderStatus === "جديد" && !o.isReadBySeller;
            return (
              <div
                key={o.id}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                  isNew ? "border-green-300 bg-green-50/30" : "border-gray-100"
                }`}
              >
                {isNew && (
                  <div className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
                    <span className="animate-pulse w-2 h-2 bg-white rounded-full" />
                    طلب جديد!
                  </div>
                )}
                <div className="p-4">
                  <div className="flex gap-4">
                    {o.productImage && (
                      <img
                        src={o.productImage}
                        alt={o.productName}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                        loading="lazy"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-bold text-gray-900">{o.productName}</h4>
                          {o.productBrand && (
                            <p className="text-xs text-indigo-600">{o.productBrand}</p>
                          )}
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${sc.cls}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {o.orderStatus}
                        </span>
                      </div>
                      <p className="text-lg font-black text-gray-900" dir="ltr">
                        {o.productPrice.toFixed(2)} <span className="text-sm font-normal text-gray-500">د.أ</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">اسم العميل</p>
                      <p className="font-medium">{o.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">رقم الهاتف</p>
                      <a href={`tel:${o.customerPhone}`} className="font-medium text-indigo-600">{o.customerPhone}</a>
                    </div>
                    {o.customerAddress && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400 mb-0.5">العنوان</p>
                        <p className="font-medium">{o.customerAddress}</p>
                      </div>
                    )}
                    {o.sizeColor && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400 mb-0.5">المقاس / اللون</p>
                        <p className="font-medium">{o.sizeColor}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-400 mt-3 mb-4">
                    {new Date(o.createdAt).toLocaleDateString("ar-JO", {
                      year: "numeric", month: "long", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>

                  {(o.orderStatus === "جديد" || o.orderStatus === "قيد الانتظار") && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => onUpdateStatus(o.id, "مكتمل")}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <CheckCircle className="w-4 h-4" />
                        إكمال الطلب
                      </button>
                      <button
                        onClick={() => onUpdateStatus(o.id, "ملغي")}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold border border-red-200 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <XCircle className="w-4 h-4" />
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
