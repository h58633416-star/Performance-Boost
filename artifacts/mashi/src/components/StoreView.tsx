import React from "react";
import { ShoppingBag } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "../lib/types";

interface Props {
  products: Product[];
  userId: string | null;
  likedProducts: Set<string>;
  onLike: (id: string) => void;
  onOrder: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export default function StoreView({
  products,
  userId,
  likedProducts,
  onLike,
  onOrder,
  onDeleteProduct,
}: Props) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
        <h2 className="text-2xl font-black text-gray-900">أحدث العروض</h2>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">لا توجد عناصر لعرضها حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:grid-cols-3">
          {products.map((p) => (
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
