import React, { memo } from "react";
import { Heart, ShoppingBag, Trash2, Phone, Instagram } from "lucide-react";
import type { Product } from "../lib/types";

interface Props {
  product: Product;
  userId: string | null;
  isLiked: boolean;
  onLike: (id: string) => void;
  onOrder: (p: Product) => void;
  onDelete: (id: string) => void;
}

function ProductCard({ product: p, userId, isLiked, onLike, onOrder, onDelete }: Props) {
  const isMine = p.sellerId === userId;
  const price = p.price || 0;
  const phoneNumber = (p.contactPhone || p.sellerPhone || "").trim();
  const instagramUsername = (p.contactInstagram || p.sellerInstagram || "").trim();
  const hasPhone = !!phoneNumber;
  const hasInstagram = !!instagramUsername;
  const cleanPhone = phoneNumber.replace(/\D/g, "");
  const cleanInsta = instagramUsername.replace("@", "");

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border flex flex-col h-full transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg ${
        isMine ? "border-teal-400 bg-[#f0fdfa] shadow-lg border-2" : "border-gray-100 shadow-md"
      }`}
      dir="rtl"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <div className="relative overflow-hidden" style={{ height: "260px" }}>
        <img
          src={p.imageUrl}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/600x400/e2e8f0/64748b?text=صورة+المنتج";
          }}
        />
        <span className="absolute top-3 left-3 bg-gray-900/80 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {price.toFixed(2)} د.أ
        </span>
        {isMine && (
          <span className="absolute top-3 right-3 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            إعلانك
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-600 font-bold mb-1">{p.brand || "عام"}</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-2">
              {p.name}
            </h3>
            <p className="text-xs text-gray-500 mb-2">البائع: {p.sellerName}</p>
          </div>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ml-2 flex-shrink-0 ${
              p.sellerType === "store"
                ? "bg-pink-100 text-pink-700 border border-pink-200"
                : "bg-indigo-100 text-indigo-700 border border-indigo-200"
            }`}
          >
            {p.sellerType === "store" ? "متجر" : "مستخدم"}
          </span>
        </div>

        {p.desc && (
          <p className="text-gray-500 text-sm mb-3 line-clamp-3">{p.desc}</p>
        )}

        {(hasPhone || hasInstagram) && (
          <div
            className={`rounded-xl p-3 mb-3 border ${
              isMine
                ? "bg-teal-50 border-teal-200"
                : "bg-gray-50 border-gray-100"
            }`}
          >
            {isMine && (
              <p className="text-xs text-teal-600 font-bold mb-2">معلومات التواصل (ما سيراه المشترون):</p>
            )}
            {!isMine && (
              <p className="text-xs text-gray-500 font-bold mb-2">تواصل مع البائع:</p>
            )}
            <div className="flex gap-2 flex-wrap">
              {hasPhone && (
                <a
                  href={isMine ? undefined : `https://wa.me/${cleanPhone}`}
                  target={isMine ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={isMine ? (e) => e.preventDefault() : undefined}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg font-bold min-h-[40px] ${
                    isMine ? "opacity-70 cursor-default" : "cursor-pointer"
                  }`}
                  style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.995 0C5.371 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.986l6.304-1.653A11.94 11.94 0 0011.995 24C18.629 24 24 18.627 24 12S18.629 0 11.995 0zm.01 21.818a9.895 9.895 0 01-5.045-1.379l-.361-.215-3.742.981.997-3.647-.235-.374A9.86 9.86 0 012.08 12.01C2.08 6.577 6.563 2.09 12.005 2.09c5.441 0 9.918 4.484 9.918 9.92 0 5.437-4.477 9.808-9.918 9.808z"/>
                  </svg>
                  {phoneNumber}
                </a>
              )}
              {hasInstagram && (
                <a
                  href={isMine ? undefined : `https://instagram.com/${cleanInsta}`}
                  target={isMine ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  onClick={isMine ? (e) => e.preventDefault() : undefined}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg font-bold min-h-[40px] ${
                    isMine ? "opacity-70 cursor-default" : "cursor-pointer"
                  }`}
                  style={{ background: "linear-gradient(45deg, #405DE6, #833AB4, #E1306C, #FD1D1D)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  @{cleanInsta}
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xl font-black text-gray-900" style={{ direction: "ltr" }}>
              {price.toFixed(2)}{" "}
              <span className="text-sm font-normal text-gray-500">د.أ</span>
            </span>
            <div className="flex items-center gap-2">
              {isMine ? (
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 flex items-center justify-center gap-1.5 text-sm font-bold min-h-[44px] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف الإعلان
                </button>
              ) : (
                <button
                  onClick={() => onOrder(p)}
                  className="px-4 py-2.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 text-white min-h-[44px] transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>اطلب الآن</span>
                </button>
              )}
              {!isMine && (
                <button
                  onClick={() => onLike(p.id)}
                  className={`px-3 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 border min-h-[44px] min-w-[52px] ${
                    isLiked
                      ? "bg-red-50 text-red-600 border-red-200"
                      : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                  />
                  <span className="text-xs">ماشي</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
