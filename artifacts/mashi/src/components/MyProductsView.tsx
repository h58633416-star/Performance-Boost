import React from "react";
import { Tag, Plus, ShieldAlert, MapPin, Shield } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "../lib/types";

interface Props {
  products: Product[];
  userId: string | null;
  likedProducts: Set<string>;
  onLike: (id: string) => void;
  onOrder: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: () => void;
}

export default function MyProductsView({
  products,
  userId,
  likedProducts,
  onLike,
  onOrder,
  onDeleteProduct,
  onAddProduct,
}: Props) {
  const myProducts = products.filter((p) => p.sellerId === userId);

  return (
    <div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8" dir="rtl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-2 rounded-full text-amber-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-amber-800 text-lg">دليل الأمان</h3>
        </div>
        <ul className="space-y-3 text-sm text-amber-900/80">
          <li className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <span>احرص دائماً على مقابلة المشتري في أماكن عامة.</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <span>تواصل عبر واتساب وإنستغرام الرسمي فقط.</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-green-600 rounded-full" />
          <h2 className="text-2xl font-black text-gray-900">إعلاناتي</h2>
        </div>
        <button
          onClick={onAddProduct}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 min-h-[44px]"
          dir="rtl"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <Plus className="w-5 h-5" />
          <span>إضافة إعلان</span>
        </button>
      </div>

      {myProducts.length === 0 ? (
        <div
          className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
          dir="rtl"
          style={{ fontFamily: "'Cairo', sans-serif" }}
        >
          <Tag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">اضغط "إضافة إعلان" لنشر منتجك الأول.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-3">
          {myProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              userId={userId}
              isLiked={likedProducts.has(p.id)}
              onLike={onLike}
              onOrder={onOrder}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
