import React, { useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import type { Product } from "../lib/types";

interface Props {
  product: Product;
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    sizeColor: string;
  }) => Promise<void>;
  showToast: (msg: string, color?: string) => void;
}

export default function OrderModal({ product, onClose, onSubmit, showToast }: Props) {
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [sizeColor, setSizeColor] = useState("");

  const handleSubmit = async () => {
    if (!customerName.trim()) { showToast("يرجى إدخال اسمك", "bg-yellow-600"); return; }
    if (!customerPhone.trim()) { showToast("يرجى إدخال رقم هاتفك", "bg-yellow-600"); return; }
    if (!customerAddress.trim()) { showToast("يرجى إدخال عنوانك", "bg-yellow-600"); return; }
    setLoading(true);
    try {
      await onSubmit({ customerName, customerPhone, customerAddress, sizeColor });
    } catch {
      showToast("حدث خطأ أثناء إرسال الطلب", "bg-red-500");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 z-10 max-h-[90vh] overflow-y-auto"
        dir="rtl"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-black text-gray-900">تفاصيل الطلب</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-4 flex gap-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-gray-100"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/64748b?text=صورة";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-indigo-600 font-bold mb-0.5">{product.brand || "عام"}</p>
              <h3 className="font-black text-gray-900 line-clamp-2">{product.name}</h3>
              <p className="text-lg font-black mt-1" dir="ltr">
                {product.price.toFixed(2)} <span className="text-sm font-normal text-gray-500">د.أ</span>
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1.5">اسمك الكامل *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="محمد أحمد"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1.5">رقم هاتفك *</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="07xxxxxxxx"
              dir="ltr"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1.5">عنوانك التفصيلي *</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="المدينة، المنطقة، الشارع"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1.5">المقاس / اللون (اختياري)</label>
            <input
              type="text"
              value={sizeColor}
              onChange={(e) => setSizeColor(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="مثال: L / أحمر"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all min-h-[52px] shadow-lg"
            style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                تأكيد الطلب
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
