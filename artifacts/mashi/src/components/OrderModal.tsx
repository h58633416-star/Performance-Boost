import React, { useState } from "react";
import { X, ShoppingBag, CheckCircle, Phone, MapPin, User, Palette } from "lucide-react";
import type { Product } from "../lib/types";

interface Props {
  product: Product;
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    city: string;
    neighborhood: string;
    sizeColor: string;
    notes: string;
    quantity: number;
  }) => Promise<void>;
  showToast: (msg: string, color?: string) => void;
}

function formatWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00962")) return digits.slice(2);
  if (digits.startsWith("962")) return digits;
  if (digits.startsWith("07") && digits.length === 10) return "962" + digits.slice(1);
  if (digits.startsWith("7") && digits.length === 9) return "962" + digits;
  return digits;
}

export default function OrderModal({ product, onClose, onSubmit, showToast }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [sizeColor, setSizeColor] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState(1);

  const sellerPhone = (product.contactPhone || product.sellerPhone || "").trim();
  const sellerInstagram = (product.contactInstagram || product.sellerInstagram || "").trim();
  const waNumber = formatWhatsApp(sellerPhone);
  const cleanInsta = sellerInstagram.replace(/^@/, "");
  const totalAddress = [city, neighborhood, customerAddress].filter(Boolean).join("، ");

  const handleSubmit = async () => {
    if (!customerName.trim()) { showToast("يرجى إدخال اسمك الكامل", "bg-yellow-600"); return; }
    if (!customerPhone.trim()) { showToast("يرجى إدخال رقم هاتفك", "bg-yellow-600"); return; }
    if (!city.trim()) { showToast("يرجى إدخال المدينة", "bg-yellow-600"); return; }
    setLoading(true);
    try {
      await onSubmit({
        customerName,
        customerPhone,
        customerAddress: totalAddress || customerAddress,
        city,
        neighborhood,
        sizeColor,
        notes,
        quantity,
      });
      setSuccess(true);
    } catch {
      showToast("حدث خطأ أثناء إرسال الطلب", "bg-red-500");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[50] flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 z-10 overflow-y-auto max-h-[90vh]"
          dir="rtl"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">تم إرسال طلبك! 🎉</h2>
            <p className="text-gray-500 text-sm mb-6">
              تم استلام طلبك بنجاح. سيتواصل معك البائع في أقرب وقت.
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 text-right mb-4">
              <h3 className="font-bold text-gray-700 mb-3 text-sm">ملخص الطلب:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">المنتج:</span>
                  <span className="font-bold text-gray-800">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">السعر:</span>
                  <span className="font-bold text-green-600" dir="ltr">{(product.price * quantity).toFixed(2)} د.أ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">الكمية:</span>
                  <span className="font-bold">{quantity}</span>
                </div>
                {sizeColor && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">المقاس/اللون:</span>
                    <span className="font-bold">{sizeColor}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">العنوان:</span>
                  <span className="font-bold text-left max-w-[60%]">{totalAddress || customerAddress}</span>
                </div>
              </div>
            </div>

            {(sellerPhone || sellerInstagram) && (
              <div className="bg-indigo-50 rounded-2xl p-4 text-right mb-4 border border-indigo-100">
                <p className="text-xs text-indigo-700 font-bold mb-3">يمكنك أيضاً التواصل المباشر مع البائع:</p>
                <div className="flex gap-2">
                  {sellerPhone && (
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`مرحباً، أريد طلب: ${product.name} - السعر: ${product.price} د.أ`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm text-white rounded-xl font-bold min-h-[44px] hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M11.995 0C5.371 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.986l6.304-1.653A11.94 11.94 0 0011.995 24C18.629 24 24 18.627 24 12S18.629 0 11.995 0zm.01 21.818a9.895 9.895 0 01-5.045-1.379l-.361-.215-3.742.981.997-3.647-.235-.374A9.86 9.86 0 012.08 12.01C2.08 6.577 6.563 2.09 12.005 2.09c5.441 0 9.918 4.484 9.918 9.92 0 5.437-4.477 9.808-9.918 9.808z"/>
                      </svg>
                      واتساب البائع
                    </a>
                  )}
                  {sellerInstagram && (
                    <a
                      href={`https://instagram.com/${cleanInsta}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm text-white rounded-xl font-bold min-h-[44px] hover:opacity-90 transition-opacity"
                      style={{ background: "linear-gradient(45deg, #405DE6, #833AB4, #E1306C, #FD1D1D)" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                      إنستغرام
                    </a>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-colors min-h-[48px]"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 z-10 max-h-[90vh] overflow-y-auto"
        dir="rtl"
        style={{ fontFamily: "'Cairo', sans-serif" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-xl font-black text-gray-900">تفاصيل الطلب</h2>
            <p className="text-xs text-gray-400">يمكن للزوار والمستخدمين الطلب</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-3 flex gap-3 items-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100/e2e8f0/64748b?text=صورة"; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-indigo-600 font-bold">{product.brand || "عام"}</p>
              <h3 className="font-black text-gray-900 text-sm line-clamp-2">{product.name}</h3>
              <p className="text-base font-black text-green-600" dir="ltr">
                {(product.price * quantity).toFixed(2)} <span className="text-xs font-normal text-gray-400">د.أ</span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-xs text-gray-400 font-bold">الكمية</p>
              <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 min-h-[32px]"
                >−</button>
                <span className="px-3 font-bold text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 min-h-[32px]"
                >+</button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
            <p className="text-xs text-blue-700 font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              معلوماتك الشخصية
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">الاسم الكامل *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="محمد أحمد"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">رقم الهاتف (واتساب) *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="07xxxxxxxx"
                dir="ltr"
              />
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
            <p className="text-xs text-orange-700 font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              عنوان التوصيل
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">المدينة *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="عمّان"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">المنطقة / الحي</label>
              <input
                type="text"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="الجبيهة"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-600 block mb-1">تفاصيل العنوان (شارع، بناية...)</label>
              <input
                type="text"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="شارع الجامعة، بناية رقم ٥"
              />
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
            <p className="text-xs text-purple-700 font-bold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              تفاصيل المنتج (اختياري)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">المقاس / اللون</label>
              <input
                type="text"
                value={sizeColor}
                onChange={(e) => setSizeColor(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="XL / أبيض"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">ملاحظات إضافية</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="أي طلب خاص..."
              />
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-3 border border-green-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-bold">إجمالي الطلب:</span>
              <span className="text-xl font-black text-green-600" dir="ltr">
                {(product.price * quantity).toFixed(2)} <span className="text-sm font-normal">د.أ</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all min-h-[52px] shadow-lg text-base"
            style={{ background: loading ? "#9ca3af" : "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
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

          <p className="text-center text-xs text-gray-400">
            سيتواصل معك البائع عبر الواتساب لتأكيد الطلب
          </p>
        </div>
      </div>
    </div>
  );
}
