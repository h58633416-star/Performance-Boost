export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  desc: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerType: "user" | "store";
  sellerPhone?: string;
  contactPhone?: string;
  sellerInstagram?: string;
  contactInstagram?: string;
  createdAt: string;
}

export interface UserData {
  displayName: string;
  type: "user" | "store" | "guest";
  phoneNumber?: string;
  instagramUsername?: string;
  emailVerified?: boolean;
}

export interface Favorite {
  id: string;
  userId: string;
  productId: string;
  addedAt: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productBrand?: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productBrand?: string;
  sellerId: string;
  sellerName: string;
  sellerType: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  sizeColor?: string;
  orderStatus: "جديد" | "قيد الانتظار" | "مكتمل" | "ملغي";
  orderType: string;
  isGuestOrder?: boolean;
  guestSessionId?: string;
  createdAt: string;
  updatedAt?: string;
  isReadBySeller?: boolean;
}

export interface Notification {
  id: string;
  type: "order" | "system" | "promo";
  subType?: string;
  title: string;
  message: string;
  userId: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export type View = "store" | "my_products" | "orders" | "favorites" | "notifications";
