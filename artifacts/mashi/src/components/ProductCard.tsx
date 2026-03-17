import React, { memo } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
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
  const phoneNumber = p.contactPhone || p.sellerPhone || "";
  const instagramUsername = p.contactInstagram || p.sellerInstagram || "";
  const hasPhone = !!phoneNumber.trim();
  const hasInstagram = !!instagramUsername.trim();
  const cleanPhone = phoneNumber.replace(/\D/g, "");

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
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-indigo-600 font-bold mb-1">{p.brand || "عام"}</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
              {p.name}
            </h3>
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

        <p className="text-gray-500 text-sm mb-3 line-clamp-3">{p.desc}</p>

        {!isMine && (hasPhone || hasInstagram) && (
          <div
            className="rounded-lg p-3 mt-1 mb-2 border border-gray-100"
            style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)" }}
          >
            <p className="text-xs text-gray-600 mb-2 font-bold">تواصل مع البائع:</p>
            <div className="flex gap-2 flex-wrap">
              {hasPhone && (
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg font-bold"
                  style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  واتساب
                </a>
              )}
              {hasInstagram && (
                <a
                  href={`https://instagram.com/${instagramUsername.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm text-white rounded-lg font-bold"
                  style={{ background: "linear-gradient(45deg, #405DE6, #833AB4, #E1306C, #FD1D1D)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  إنستغرام
                </a>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xl font-black text-gray-900" style={{ direction: "ltr" }}>
              {price.toFixed(2)}{" "}
              <span className="text-sm font-normal text-gray-500">د.أ</span>
            </span>
            <div className="flex items-center gap-2">
              {isMine ? (
                <button
                  onClick={() => onDelete(p.id)}
                  className="text-red-500 hover:bg-red-50 p-3 rounded-lg flex-1 border border-red-100 flex items-center justify-center gap-1 text-sm font-bold min-h-[44px]"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </button>
              ) : (
                <button
                  onClick={() => onOrder(p)}
                  className="px-4 py-3 rounded-xl font-bold shadow-lg flex-1 flex items-center justify-center gap-2 text-white min-h-[44px]"
                  style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>اطلب الآن</span>
                </button>
              )}
              <button
                onClick={() => onLike(p.id)}
                className={`like-btn px-3 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 border min-h-[44px] min-w-[44px] ${
                  isLiked
                    ? "bg-[#dcfce7] text-[#15803d] border-[#86efac]"
                    : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-current text-red-500" : ""}`}
                />
                <span className="text-xs">ماشي</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
