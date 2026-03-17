import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  getDoc,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Product, Favorite, Order, Notification, UserData } from "./types";

export async function fetchUserData(uid: string): Promise<UserData | null> {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) return userDoc.data() as UserData;
  return null;
}

export function subscribeToProducts(
  callback: (products: Product[]) => void,
  onError?: (e: Error) => void
): Unsubscribe {
  const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const products: Product[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Product, "id">),
      }));
      callback(products);
    },
    (error) => {
      if (error.code === "failed-precondition") {
        getDocs(collection(db, "products")).then((snap) => {
          callback(
            snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, "id">) }))
          );
        });
      } else {
        onError?.(error as Error);
      }
    }
  );
}

export async function addProduct(data: Omit<Product, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "products"), data);
  return ref.id;
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, "products", productId));
}

export async function loadFavorites(userId: string): Promise<Favorite[]> {
  const q = query(collection(db, "favorites"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Favorite, "id">) }));
}

export async function addFavorite(data: Omit<Favorite, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "favorites"), data);
  return ref.id;
}

export async function removeFavorite(favoriteId: string): Promise<void> {
  await deleteDoc(doc(db, "favorites", favoriteId));
}

export async function loadOrders(sellerId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, "orders"),
      where("sellerId", "==", sellerId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }));
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err?.code === "failed-precondition") {
      const q = query(collection(db, "orders"), where("sellerId", "==", sellerId));
      const snap = await getDocs(q);
      const orders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, "id">) }));
      return orders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    throw e;
  }
}

export async function submitOrder(data: Omit<Order, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), data);
  return ref.id;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["orderStatus"]
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), {
    orderStatus: status,
    updatedAt: new Date().toISOString(),
    isReadBySeller: true,
  });
}

export async function addNotification(
  data: Omit<Notification, "id">
): Promise<void> {
  await addDoc(collection(db, "notifications"), data);
}

export function subscribeToNotifications(
  userId: string,
  callback: (notifications: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Notification, "id">) }))
    );
  });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await updateDoc(doc(db, "notifications", notificationId), {
    isRead: true,
    readAt: new Date().toISOString(),
  });
}

export async function deleteNotificationDoc(notificationId: string): Promise<void> {
  await deleteDoc(doc(db, "notifications", notificationId));
}

export async function markAllNotificationsRead(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => {
    batch.update(doc(db, "notifications", id), {
      isRead: true,
      readAt: new Date().toISOString(),
    });
  });
  await batch.commit();
}

export async function deleteAllReadNotifications(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, "notifications", id)));
  await batch.commit();
}

export async function uploadProductImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
