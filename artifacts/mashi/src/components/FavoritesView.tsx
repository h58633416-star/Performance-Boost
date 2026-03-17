import React from "react";
import { Heart, Trash2, ShoppingBag, Store } from "lucide-react";
import type { Favorite, Product } from "../lib/types";
import type { View } from "../lib/types";

interface Props {
  favorites: Favorite[];
  products: Product[];
  likedProducts: Set<string>;
  onRemove: (favoriteId: string, productId: string) => void;
  onClearAll: () => void;
  onLike: (id: string) => void;
  onSwitchView: (v: View) => void;
}

export default function FavoritesView({
  favorites,
  products,
  likedProducts,
  onRemove,
  onClearAll,
  onLike,
  onSwitchView,
}: Props) {
  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-red-500 rounded-full" />
          <h2 className="text-2xl font-black text-gray-900">المفضلة</h2>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {favorites.length} منتج
          </span>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 border border-red-200 min-h-[44px]"
          >
            <Trash2 className="w-4 h-4" />
            مسح الكل
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-6">لم تضف أي منتج للمفضلة بعد.</p>
          <button
            onClick={() => onSwitchView("store")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 mx-auto min-h-[44px]"
          >
            <Store className="w-5 h-5" />
            تصفح السوق
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
          {favorites.map((fav) => {
            const product = products.find((p) => p.id === fav.productId);
            return (
              <div
                key={fav.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={fav.productImage || product?.imageUrl || "https://placehold.co/600x400/e2e8f0/64748b?text=صورة+المنتج"}
                    alt={fav.productName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/64748b?text=صورة+المنتج";
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-indigo-600 font-bold mb-1">{fav.productBrand || "عام"}</p>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{fav.productName}</h3>
                  <p className="text-lg font-black text-gray-900 mb-3" dir="ltr">
                    {fav.productPrice.toFixed(2)} <span className="text-sm font-normal text-gray-500">د.أ</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onRemove(fav.id, fav.productId)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl font-bold border border-red-200 flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                      إزالة
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
