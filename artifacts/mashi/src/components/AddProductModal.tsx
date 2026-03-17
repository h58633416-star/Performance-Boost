import React, { useState, useRef } from "react";
import { X, Upload, Image as ImageIcon, Plus } from "lucide-react";

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    brand: string;
    price: number;
    contactPhone: string;
    contactInstagram: string;
    desc: string;
    imageFile: File | null;
  }) => Promise<void>;
  showToast: (msg: string, color?: string) => void;
}

export default function AddProductModal({ onClose, onSubmit, showToast }: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactInstagram, setContactInstagram] = useState("");
  const [desc, setDesc] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { showToast("يرجى اختيار صورة صحيحة", "bg-yellow-600"); return; }
    if (file.size > 5 * 1024 * 1024) { showToast("حجم الصورة يجب أن لا يتجاوز 5 ميجابايت", "bg-yellow-600"); return; }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSubmit = async () => {
    if (!name.trim()) { showToast("يرجى إدخال اسم المنتج", "bg-yellow-600"); return; }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) { showToast("يرجى إدخال سعر صحيح", "bg-yellow-600"); return; }
    if (!contactPhone.trim() && !contactInstagram.trim()) {
      showToast("يرجى إدخال طريقة تواصل واحدة على الأقل", "bg-yellow-600");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        brand: brand.trim(),
        price: Number(price),
        contactPhone: contactPhone.trim(),
        contactInstagram: contactInstagram.trim(),
        desc: desc.trim(),
        imageFile,
      });
    } catch {
      showToast("حدث خطأ أثناء نشر الإعلان", "bg-red-500");
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
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xl font-black text-gray-900">إضافة إعلان جديد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="preview" className="w-full h-40 object-contain mx-auto rounded-xl" />
              ) : (
                <div className="text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-bold text-sm">انقر لرفع صورة المنتج</p>
                  <p className="text-xs mt-1">PNG, JPG (حتى 5 ميجا)</p>
                </div>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">اسم المنتج *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="اسم المنتج"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1.5">الماركة</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="الماركة"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1.5">السعر (دينار أردني) *</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
              min="0"
              step="0.01"
              dir="ltr"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700 block mb-1.5">وصف المنتج</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="صف منتجك بالتفصيل..."
            />
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-sm font-bold text-gray-700 mb-3">معلومات التواصل *</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">رقم الواتساب</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                  placeholder="07xxxxxxxx"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">حساب إنستغرام</label>
                <input
                  type="text"
                  value={contactInstagram}
                  onChange={(e) => setContactInstagram(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                  placeholder="@username"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors min-h-[52px] shadow-lg shadow-indigo-200"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                نشر الإعلان
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
