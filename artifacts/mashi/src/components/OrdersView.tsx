import React, { useState } from "react";
import { ShoppingCart, CheckCircle, Clock, XCircle, Package, Inbox, ShoppingBag } from "lucide-react";
import type { Order } from "../lib/types";

type Tab = "pending" | "completed" | "cancelled" | "all";
type Mode = "seller" | "buyer";

interface Props {
  sellerOrders: Order[];
  buyerOrders: Order[];
  tab: Tab;
  onTabChange: (t: Tab) => void;
  onUpdateStatus: (id: string, status: Order["orderStatus"]) => void;
  newOrdersCount: number;
  isSeller: boolean;
}

const statusConfig: Record<string, { cls: string; dot: string; icon: React.ReactNode; label: string }> = {
  "جديد": {
    cls: "bg-green-100 text-green-800 border border-green-200",
    dot: "bg-green-500",
    icon: <Clock className="w-3.5 h-3.5" />,
    label: "قيد الانتظار",
  },
  "قيد الانتظار": {
    cls: "bg-amber-100 text-amber-800 border border-amber-200",
    dot: "bg-amber-500",
    icon: <Clock className="w-3.5 h-3.5" />,
    label: "قيد الانتظار",
  },
  "مكتمل": {
    cls: "bg-blue-100 text-blue-800 border border-blue-200",
    dot: "bg-blue-500",
    icon: <CheckCircle className="w-3.5 h-3.5" />,
    label: "مكتمل",
  },
  "ملغي": {
    cls: "bg-red-100 text-red-800 border border-red-200",
    dot: "bg-red-500",
    icon: <XCircle className="w-3.5 h-3.5" />,
    label: "ملغي",
  },
};

function OrderStatusTracker({ status }: { status: Order["orderStatus"] }) {
  const steps = [
    { key: "جديد", label: "تم الطلب", icon: <ShoppingBag className="w-4 h-4" /> },
    { key: "قيد الانتظار", label: "جاري التجهيز", icon: <Package className="w-4 h-4" /> },
    { key: "مكتمل", label: "تم التسليم", icon: <CheckCircle className="w-4 h-4" /> },
  ];
  const isComplete = status === "مكتمل";
  const isCancelled = status === "ملغي";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3 mt-3">
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-red-700">تم إلغاء الطلب</p>
          <p className="text-xs text-red-500">للاستفسار تواصل مع البائع مباشرةً</p>
        </div>
      </div>
    );
  }

  const activeIdx = isComplete ? 2 : status === "قيد الانتظار" ? 1 : 0;

  return (
    <div className="mt-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
      <p className="text-xs text-gray-400 font-bold mb-3">تتبع طلبك:</p>
      <div className="flex items-center" dir="rtl">
        {steps.map((step, idx) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  idx <= activeIdx
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <p className={`text-[10px] mt-1 font-bold text-center leading-tight max-w-[56px] ${idx <= activeIdx ? "text-indigo-700" : "text-gray-400"}`}>
                {step.label}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                  idx < activeIdx ? "bg-indigo-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function BuyerOrderCard({ order }: { order: Order }) {
  const sc = statusConfig[order.orderStatus] || statusConfig["جديد"];
  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
      order.orderStatus === "ملغي" ? "border-red-100 opacity-80" : 
      order.orderStatus === "مكتمل" ? "border-blue-100" : "border-indigo-100"
    }`}>
      <div className="p-4">
        <div className="flex gap-3 items-start">
          {order.productImage && (
            <img
              src={order.productImage}
              alt={order.productName}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
              loading="lazy"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                {order.productBrand && (
                  <p className="text-xs text-indigo-600 font-bold">{order.productBrand}</p>
                )}
                <h4 className="font-bold text-gray-900 text-sm leading-snug">{order.productName}</h4>
                <p className="text-xs text-gray-400 mt-0.5">من: {order.sellerName}</p>
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${sc.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {sc.label}
              </span>
            </div>
            <p className="text-base font-black text-gray-800 mt-1" dir="ltr">
              {order.productPrice.toFixed(2)} <span className="text-xs font-normal text-gray-500">د.أ</span>
            </p>
          </div>
        </div>

        <OrderStatusTracker status={order.orderStatus} />

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            <span className="text-gray-400">العنوان: </span>
            <span className="font-medium text-gray-700">{order.customerAddress || "—"}</span>
          </div>
          {order.sizeColor && (
            <div>
              <span className="text-gray-400">المقاس/اللون: </span>
              <span className="font-medium text-gray-700">{order.sizeColor}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(order.createdAt).toLocaleDateString("ar-JO", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

function SellerOrderCard({ order, onUpdateStatus }: { order: Order; onUpdateStatus: (id: string, status: Order["orderStatus"]) => void }) {
  const sc = statusConfig[order.orderStatus] || statusConfig["جديد"];
  const isNew = order.orderStatus === "جديد" && !order.isReadBySeller;
  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isNew ? "border-green-300" : "border-gray-100"}`}>
      {isNew && (
        <div className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-2">
          <span className="animate-pulse w-2 h-2 bg-white rounded-full" />
          طلب جديد!
        </div>
      )}
      <div className="p-4">
        <div className="flex gap-3">
          {order.productImage && (
            <img
              src={order.productImage}
              alt={order.productName}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
              loading="lazy"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                {order.productBrand && <p className="text-xs text-indigo-600 font-bold">{order.productBrand}</p>}
                <h4 className="font-bold text-gray-900 text-sm">{order.productName}</h4>
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${sc.cls}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {order.orderStatus}
              </span>
            </div>
            <p className="text-base font-black text-gray-900" dir="ltr">
              {order.productPrice.toFixed(2)} <span className="text-xs font-normal text-gray-500">د.أ</span>
            </p>
          </div>
        </div>

        <div className="mt-3 bg-gray-50 rounded-xl p-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">اسم العميل</p>
            <p className="font-bold text-gray-800">{order.customerName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">رقم الهاتف</p>
            <a href={`tel:${order.customerPhone}`} className="font-bold text-indigo-600">{order.customerPhone}</a>
          </div>
          {order.customerAddress && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">العنوان</p>
              <p className="font-medium text-gray-700">{order.customerAddress}</p>
            </div>
          )}
          {order.sizeColor && (
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-0.5">المقاس / اللون / ملاحظات</p>
              <p className="font-medium text-gray-700">{order.sizeColor}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-2 mb-3">
          {new Date(order.createdAt).toLocaleDateString("ar-JO", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>

        {(order.orderStatus === "جديد" || order.orderStatus === "قيد الانتظار") && (
          <div className="flex gap-2">
            <button
              onClick={() => onUpdateStatus(order.id, "مكتمل")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 min-h-[44px] text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              إكمال الطلب
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, "ملغي")}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold border border-red-200 transition-colors flex items-center justify-center gap-2 min-h-[44px] text-sm"
            >
              <XCircle className="w-4 h-4" />
              إلغاء
            </button>
          </div>
        )}
        {order.orderStatus === "مكتمل" && (
          <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 border border-blue-100">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <p className="text-sm font-bold text-blue-700">تم إكمال الطلب بنجاح</p>
          </div>
        )}
        {order.orderStatus === "ملغي" && (
          <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2 border border-red-100">
            <XCircle className="w-4 h-4 text-red-500" />
            <p className="text-sm font-bold text-red-600">تم إلغاء هذا الطلب</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersView({ sellerOrders, buyerOrders, tab, onTabChange, onUpdateStatus, newOrdersCount, isSeller }: Props) {
  const [mode, setMode] = useState<Mode>(isSeller && sellerOrders.length > 0 ? "seller" : "buyer");

  const filteredSeller = sellerOrders.filter((o) => {
    if (tab === "all") return true;
    if (tab === "pending") return o.orderStatus === "جديد" || o.orderStatus === "قيد الانتظار";
    if (tab === "completed") return o.orderStatus === "مكتمل";
    if (tab === "cancelled") return o.orderStatus === "ملغي";
    return true;
  });

  const tabItems: { key: Tab; label: string }[] = [
    { key: "pending", label: `قيد الانتظار (${sellerOrders.filter(o => o.orderStatus === "جديد" || o.orderStatus === "قيد الانتظار").length})` },
    { key: "completed", label: `مكتملة (${sellerOrders.filter(o => o.orderStatus === "مكتمل").length})` },
    { key: "cancelled", label: `ملغية (${sellerOrders.filter(o => o.orderStatus === "ملغي").length})` },
    { key: "all", label: `الكل (${sellerOrders.length})` },
  ];

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {isSeller && (
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl">
          <button
            onClick={() => setMode("seller")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-[44px] ${
              mode === "seller"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Inbox className="w-4 h-4" />
            الطلبات الواردة
            {newOrdersCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {newOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMode("buyer")}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-[44px] ${
              mode === "buyer"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            طلباتي كمشتري
            {buyerOrders.length > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${mode === "buyer" ? "bg-white text-indigo-600" : "bg-indigo-100 text-indigo-700"}`}>
                {buyerOrders.length}
              </span>
            )}
          </button>
        </div>
      )}

      {(!isSeller || mode === "buyer") && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-7 w-1.5 bg-indigo-600 rounded-full" />
            <h2 className="text-xl font-black text-gray-900">طلباتي كمشتري</h2>
            {buyerOrders.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {buyerOrders.length} طلب
              </span>
            )}
          </div>
          {buyerOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <ShoppingCart className="w-14 h-14 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-bold mb-1">لا توجد طلبات بعد</p>
              <p className="text-gray-400 text-sm">اضغط "اطلب الآن" على أي منتج لتقديم طلبك</p>
            </div>
          ) : (
            <div className="space-y-4">
              {buyerOrders.map((o) => (
                <BuyerOrderCard key={o.id} order={o} />
              ))}
            </div>
          )}
        </div>
      )}

      {isSeller && mode === "seller" && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-7 w-1.5 bg-green-600 rounded-full" />
            <h2 className="text-xl font-black text-gray-900">الطلبات الواردة</h2>
            {newOrdersCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                {newOrdersCount} جديد
              </span>
            )}
          </div>

          <div className="flex overflow-x-auto gap-2 mb-5 pb-1">
            {tabItems.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onTabChange(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all min-h-[40px] ${
                  tab === key
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {filteredSeller.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <Package className="w-14 h-14 mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-bold">لا توجد طلبات في هذا التصنيف</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSeller.map((o) => (
                <SellerOrderCard key={o.id} order={o} onUpdateStatus={onUpdateStatus} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
