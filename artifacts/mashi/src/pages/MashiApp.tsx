import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  type User,
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import {
  subscribeToProducts,
  addProduct,
  deleteProduct,
  loadFavorites,
  addFavorite,
  removeFavorite,
  submitOrder,
  updateOrderStatus,
  addNotification,
  subscribeToNotifications,
  subscribeToSellerOrders,
  subscribeToBuyerOrders,
  markNotificationRead,
  deleteNotificationDoc,
  markAllNotificationsRead,
  deleteAllReadNotifications,
  uploadProductImage,
} from "../lib/firestore";
import { fetchUserData } from "../lib/firestore";
import type { Product, Favorite, Order, Notification, UserData, View } from "../lib/types";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import StoreView from "../components/StoreView";
import MyProductsView from "../components/MyProductsView";
import OrdersView from "../components/OrdersView";
import FavoritesView from "../components/FavoritesView";
import NotificationsView from "../components/NotificationsView";
import LoginModal from "../components/LoginModal";
import AddProductModal from "../components/AddProductModal";
import OrderModal from "../components/OrderModal";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

type OrdersTab = "pending" | "completed" | "cancelled" | "all";
type NotifTab = "all" | "unread" | "orders" | "system";

export default function MashiApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userType, setUserType] = useState<"user" | "store" | "guest" | null>(null);
  const [currentView, setCurrentView] = useState<View>("store");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [myPlacedOrders, setMyPlacedOrders] = useState<Order[]>([]);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [ordersTab, setOrdersTab] = useState<OrdersTab>("pending");
  const [notifTab, setNotifTab] = useState<NotifTab>("all");

  const [userId, setUserId] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);

  const [confirmState, setConfirmState] = useState<{
    title: string;
    message: string;
    resolve: (v: boolean) => void;
  } | null>(null);

  const [toasts, setToasts] = useState<{ id: number; msg: string; color: string }[]>([]);
  const toastIdRef = useRef(0);

  const notifUnsubRef = useRef<(() => void) | null>(null);
  const productsUnsubRef = useRef<(() => void) | null>(null);
  const sellerOrdersUnsubRef = useRef<(() => void) | null>(null);
  const buyerOrdersUnsubRef = useRef<(() => void) | null>(null);

  const [buyerSid] = useState<string>(() => {
    const stored = localStorage.getItem("mashi_buyer_sid");
    if (stored) return stored;
    const newId = "bs_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem("mashi_buyer_sid", newId);
    return newId;
  });

  const showToast = useCallback((msg: string, color = "bg-indigo-600") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, msg, color }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const showConfirm = useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ title, message, resolve });
    });
  }, []);

  const handleConfirmClose = useCallback(
    (result: boolean) => {
      confirmState?.resolve(result);
      setConfirmState(null);
    },
    [confirmState]
  );

  const startProductListener = useCallback(() => {
    if (productsUnsubRef.current) productsUnsubRef.current();
    productsUnsubRef.current = subscribeToProducts((prods) => {
      setProducts(prods);
    });
  }, []);

  const stopNotifListener = useCallback(() => {
    if (notifUnsubRef.current) {
      notifUnsubRef.current();
      notifUnsubRef.current = null;
    }
  }, []);

  const startNotifListener = useCallback((uid: string) => {
    stopNotifListener();
    notifUnsubRef.current = subscribeToNotifications(uid, (notifs) => {
      setNotifications(notifs);
      setUnreadNotifCount(notifs.filter((n) => !n.isRead).length);
    });
  }, [stopNotifListener]);

  const loadUserFavorites = useCallback(async (uid: string) => {
    try {
      const favs = await loadFavorites(uid);
      setFavorites(favs);
      setLikedProducts(new Set(favs.map((f) => f.productId)));
    } catch {}
  }, []);

  const stopSellerOrdersListener = useCallback(() => {
    if (sellerOrdersUnsubRef.current) {
      sellerOrdersUnsubRef.current();
      sellerOrdersUnsubRef.current = null;
    }
  }, []);

  const startSellerOrdersListener = useCallback((uid: string) => {
    stopSellerOrdersListener();
    sellerOrdersUnsubRef.current = subscribeToSellerOrders(uid, (orders) => {
      setMyOrders(orders);
      setNewOrdersCount(orders.filter((o) => !o.isReadBySeller && o.orderStatus === "جديد").length);
    });
  }, [stopSellerOrdersListener]);

  const stopBuyerOrdersListener = useCallback(() => {
    if (buyerOrdersUnsubRef.current) {
      buyerOrdersUnsubRef.current();
      buyerOrdersUnsubRef.current = null;
    }
  }, []);

  const startBuyerOrdersListener = useCallback((sid: string) => {
    stopBuyerOrdersListener();
    buyerOrdersUnsubRef.current = subscribeToBuyerOrders(sid, (orders) => {
      setMyPlacedOrders(orders);
    });
  }, [stopBuyerOrdersListener]);

  const handleUserLogin = useCallback(
    async (user: User) => {
      const data = await fetchUserData(user.uid);
      if (data) {
        data.emailVerified = user.emailVerified;
        setUserId(user.uid);
        setUserData(data);
        setUserType(data.type as "user" | "store");
        setIsLoggedIn(true);
        setIsGuest(false);
        loadUserFavorites(user.uid);
        startSellerOrdersListener(user.uid);
        const loginSid = user.uid;
        localStorage.setItem("mashi_buyer_sid", loginSid);
        startBuyerOrdersListener(loginSid);
        startNotifListener(user.uid);
      }
    },
    [loadUserFavorites, startSellerOrdersListener, startBuyerOrdersListener, startNotifListener]
  );

  useEffect(() => {
    startProductListener();
    startBuyerOrdersListener(buyerSid);

    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user && !isGuest) {
        await handleUserLogin(user);
      } else if (!user && !isGuest) {
        setUserId(null);
        setUserData(null);
        setIsLoggedIn(false);
        setUserType(null);
        setFavorites([]);
        setLikedProducts(new Set());
        setMyOrders([]);
        setNewOrdersCount(0);
        setNotifications([]);
        setUnreadNotifCount(0);
        stopNotifListener();
        stopSellerOrdersListener();
      }
    });

    return () => {
      unsubAuth();
      if (productsUnsubRef.current) productsUnsubRef.current();
      stopNotifListener();
      stopSellerOrdersListener();
      stopBuyerOrdersListener();
    };
  }, []);

  const switchView = useCallback(
    (view: View) => {
      const strictlyProtected: View[] = ["my_products", "favorites", "notifications"];
      if (strictlyProtected.includes(view) && !isLoggedIn) {
        showToast("الرجاء تسجيل الدخول للوصول إلى هذه الصفحة", "bg-yellow-600");
        setShowLoginModal(true);
        return;
      }
      if (isGuest && view === "my_products") {
        showToast("لا يمكنك البيع كزائر", "bg-yellow-600");
        return;
      }
      setCurrentView(view);
    },
    [isLoggedIn, isGuest, showToast]
  );

  const handleGuestLogin = useCallback(() => {
    setIsLoggedIn(true);
    setIsGuest(true);
    setUserType("guest");
    setUserId("guest-" + Date.now());
    setUserData({ displayName: "زائر", type: "guest" });
    setShowLoginModal(false);
    setCurrentView("store");
    showToast("مرحباً بك كزائر! يمكنك التسوق ولكن لا يمكنك البيع", "bg-blue-600");
  }, [showToast]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await handleUserLogin(cred.user);
      setShowLoginModal(false);
      showToast(`✅ مرحباً بعودتك!`, "bg-green-600");
    },
    [handleUserLogin, showToast]
  );

  const handleSignup = useCallback(
    async (
      email: string,
      password: string,
      displayName: string,
      type: "user" | "store",
      phoneNumber: string,
      instagramUsername: string
    ) => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const newUserData: UserData = { displayName, type, phoneNumber, instagramUsername };
      await setDoc(doc(db, "users", cred.user.uid), newUserData);
      try {
        await sendEmailVerification(cred.user);
      } catch {}

      newUserData.emailVerified = false;
      setUserId(cred.user.uid);
      setUserData(newUserData);
      setUserType(type);
      setIsLoggedIn(true);
      setIsGuest(false);
      setShowLoginModal(false);
      showToast("✅ تم إنشاء الحساب بنجاح! مرحباً بك في ماشي", "bg-green-600");
    },
    [showToast]
  );

  const handleLogout = useCallback(async () => {
    const confirmed = await showConfirm("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟");
    if (!confirmed) return;

    stopNotifListener();
    stopSellerOrdersListener();
    setIsLoggedIn(false);
    setIsGuest(false);
    setUserType(null);
    setUserId(null);
    setUserData(null);
    setFavorites([]);
    setLikedProducts(new Set());
    setMyOrders([]);
    setMyPlacedOrders([]);
    setNewOrdersCount(0);
    setNotifications([]);
    setUnreadNotifCount(0);
    setCurrentView("store");

    if (!isGuest) {
      try {
        await signOut(auth);
      } catch {}
    }
    showToast("تم تسجيل الخروج بنجاح", "bg-gray-700");
  }, [showConfirm, stopNotifListener, isGuest, showToast]);

  const handleResendVerification = useCallback(async () => {
    if (!auth.currentUser) {
      showToast("الرجاء تسجيل الدخول أولاً", "bg-yellow-600");
      return;
    }
    try {
      await sendEmailVerification(auth.currentUser);
      showToast("✅ تم إرسال رابط التحقق إلى بريدك الإلكتروني", "bg-green-600");
    } catch {
      showToast("❌ فشل في إرسال رابط التحقق", "bg-red-500");
    }
  }, [showToast]);

  const handleResetPassword = useCallback(
    async (email: string) => {
      try {
        await sendPasswordResetEmail(auth, email);
        showToast("✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك", "bg-green-600");
      } catch {
        showToast("❌ فشل في إرسال رابط إعادة التعيين", "bg-red-500");
      }
    },
    [showToast]
  );

  const handleMashiLike = useCallback(
    async (productId: string) => {
      if (!isLoggedIn) {
        showToast("الرجاء تسجيل الدخول أولاً", "bg-yellow-600");
        setShowLoginModal(true);
        return;
      }
      if (isGuest) {
        showToast("الرجاء إنشاء حساب لإضافة للمفضلة", "bg-yellow-600");
        return;
      }
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const alreadyLiked = likedProducts.has(productId);
      if (alreadyLiked) {
        const fav = favorites.find((f) => f.productId === productId);
        if (fav) {
          setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
          setLikedProducts((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
          try {
            await removeFavorite(fav.id);
            showToast("تمت الإزالة من المفضلة ❌", "bg-gray-700");
          } catch {
            setFavorites((prev) => [...prev, fav]);
            setLikedProducts((prev) => new Set([...prev, productId]));
          }
        }
      } else {
        const tempFav: Favorite = {
          id: "temp-" + Date.now(),
          userId: userId!,
          productId,
          addedAt: new Date().toISOString(),
          productName: product.name,
          productPrice: product.price,
          productImage: product.imageUrl,
          productBrand: product.brand,
        };
        setFavorites((prev) => [...prev, tempFav]);
        setLikedProducts((prev) => new Set([...prev, productId]));
        try {
          const newId = await addFavorite({
            userId: userId!,
            productId,
            addedAt: new Date().toISOString(),
            productName: product.name,
            productPrice: product.price,
            productImage: product.imageUrl,
            productBrand: product.brand,
          });
          setFavorites((prev) =>
            prev.map((f) => (f.id === tempFav.id ? { ...f, id: newId } : f))
          );
          showToast("تمت الإضافة للمفضلة ❤️", "bg-red-500");
        } catch {
          setFavorites((prev) => prev.filter((f) => f.id !== tempFav.id));
          setLikedProducts((prev) => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
          });
        }
      }
    },
    [isLoggedIn, isGuest, products, likedProducts, favorites, userId, showToast]
  );

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      const confirmed = await showConfirm("حذف الإعلان", "هل أنت متأكد من حذف هذا الإعلان؟");
      if (!confirmed) return;
      const removed = products.find((p) => p.id === productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      try {
        await deleteProduct(productId);
        showToast("تم حذف الإعلان بنجاح", "bg-green-600");
      } catch {
        if (removed) setProducts((prev) => [removed, ...prev]);
        showToast("حدث خطأ أثناء الحذف", "bg-red-500");
      }
    },
    [showConfirm, showToast, products]
  );

  const handleSubmitProduct = useCallback(
    async (formData: {
      name: string;
      brand: string;
      price: number;
      contactPhone: string;
      contactInstagram: string;
      desc: string;
      imageFile: File | null;
    }) => {
      if (!userId || !userData) {
        showToast("الرجاء تسجيل الدخول أولاً", "bg-yellow-600");
        return;
      }
      let imageUrl = "https://placehold.co/600x400/e2e8f0/64748b?text=صورة+المنتج";
      if (formData.imageFile) {
        imageUrl = await uploadProductImage(formData.imageFile);
      }

      const createdAt = new Date().toISOString();
      const productData: Omit<Product, "id"> = {
        name: formData.name,
        brand: formData.brand,
        price: formData.price,
        desc: formData.desc,
        imageUrl,
        sellerId: userId,
        sellerName: userData.displayName,
        sellerType: (userType as "user" | "store") || "user",
        contactPhone: formData.contactPhone,
        sellerPhone: formData.contactPhone,
        contactInstagram: formData.contactInstagram,
        sellerInstagram: formData.contactInstagram,
        createdAt,
      };

      const tempId = "temp-" + Date.now();
      const tempProduct: Product = { id: tempId, ...productData };

      setProducts((prev) => [tempProduct, ...prev]);
      setShowAddModal(false);
      showToast("تم نشر الإعلان بنجاح! 🎉", "bg-green-600");

      try {
        const realId = await addProduct(productData);
        setProducts((prev) =>
          prev.map((p) => (p.id === tempId ? { ...p, id: realId } : p))
        );
      } catch {
        setProducts((prev) => prev.filter((p) => p.id !== tempId));
        showToast("حدث خطأ أثناء نشر الإعلان، تحقق من الاتصال بالإنترنت", "bg-red-500");
      }
    },
    [userId, userData, userType, showToast]
  );

  const handleSubmitOrder = useCallback(
    async (orderData: {
      customerName: string;
      customerPhone: string;
      customerAddress: string;
      city: string;
      neighborhood: string;
      sizeColor: string;
      notes: string;
      quantity: number;
    }) => {
      if (!orderModalProduct) return;
      const fullAddress = [orderData.city, orderData.neighborhood, orderData.customerAddress]
        .filter(Boolean)
        .join("، ");

      const order: Omit<Order, "id"> = {
        productId: orderModalProduct.id,
        productName: orderModalProduct.name,
        productPrice: orderModalProduct.price * orderData.quantity,
        productImage: orderModalProduct.imageUrl,
        productBrand: orderModalProduct.brand,
        sellerId: orderModalProduct.sellerId,
        sellerName: orderModalProduct.sellerName,
        sellerType: orderModalProduct.sellerType,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerAddress: fullAddress,
        sizeColor: [orderData.sizeColor, orderData.notes].filter(Boolean).join(" | "),
        orderStatus: "جديد",
        orderType: "طلب فوري",
        isGuestOrder: !isLoggedIn || isGuest,
        guestSessionId: buyerSid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isReadBySeller: false,
      };

      try {
        const orderId = await submitOrder(order);
        addNotification({
          type: "order",
          subType: "new_order",
          title: "طلب جديد! 🎉",
          message: `لديك طلب جديد على منتج ${orderModalProduct.name} من ${orderData.customerName} - ${fullAddress}`,
          userId: orderModalProduct.sellerId,
          relatedId: orderId,
          relatedType: "order",
          isRead: false,
          createdAt: new Date().toISOString(),
        }).catch(() => {});
      } catch {
        /* allow even if Firestore fails — success screen still shows */
      }
    },
    [orderModalProduct, isLoggedIn, isGuest, buyerSid]
  );

  const handleUpdateOrderStatus = useCallback(
    async (orderId: string, status: Order["orderStatus"]) => {
      const msg =
        status === "مكتمل"
          ? "هل تريد تأكيد إتمام هذا الطلب؟"
          : "هل تريد تأكيد إلغاء هذا الطلب؟";
      const confirmed = await showConfirm("تحديث حالة الطلب", msg);
      if (!confirmed) return;

      const order = myOrders.find((o) => o.id === orderId);
      if (!order) return;

      setMyOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, orderStatus: status, isReadBySeller: true } : o
        )
      );
      setNewOrdersCount(
        myOrders.filter(
          (o) => o.id !== orderId && !o.isReadBySeller && o.orderStatus === "جديد"
        ).length
      );

      try {
        await updateOrderStatus(orderId, status);
        const notifTitle =
          status === "مكتمل" ? "تم إكمال طلبك! ✅" : "تم إلغاء طلبك ❌";
        const notifMessage =
          status === "مكتمل"
            ? `تم إكمال طلبك على منتج ${order.productName}. شكراً لاختيارك!`
            : `تم إلغاء طلبك على منتج ${order.productName}. للاستفسار، تواصل مع البائع.`;
        await addNotification({
          type: "order",
          subType: status === "مكتمل" ? "order_completed" : "order_cancelled",
          title: notifTitle,
          message: notifMessage,
          userId: order.isGuestOrder ? order.guestSessionId! : order.customerPhone,
          relatedId: orderId,
          relatedType: "order",
          isRead: false,
          createdAt: new Date().toISOString(),
        });
        showToast(`تم تحديث حالة الطلب إلى "${status}"`, "bg-green-600");
      } catch {
        showToast("حدث خطأ أثناء تحديث حالة الطلب", "bg-red-500");
        if (userId) loadUserOrders(userId);
      }
    },
    [myOrders, showConfirm, userId, showToast]
  );

  const handleMarkNotifRead = useCallback(
    async (notifId: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
      );
      setUnreadNotifCount((c) => Math.max(0, c - 1));
      try {
        await markNotificationRead(notifId);
      } catch {}
    },
    []
  );

  const handleDeleteNotif = useCallback(
    async (notifId: string) => {
      const confirmed = await showConfirm("حذف الإشعار", "هل تريد حذف هذا الإشعار؟");
      if (!confirmed) return;
      const wasUnread = notifications.find((n) => n.id === notifId && !n.isRead);
      setNotifications((prev) => prev.filter((n) => n.id !== notifId));
      if (wasUnread) setUnreadNotifCount((c) => Math.max(0, c - 1));
      try {
        await deleteNotificationDoc(notifId);
      } catch {}
    },
    [notifications, showConfirm]
  );

  const handleMarkAllNotifRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) {
      showToast("لا توجد إشعارات غير مقروءة", "bg-blue-500");
      return;
    }
    const confirmed = await showConfirm(
      "تعليم الكل كمقروء",
      `هل تريد تعليم جميع الإشعارات غير المقروءة (${unread.length}) كمقروءة؟`
    );
    if (!confirmed) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadNotifCount(0);
    try {
      await markAllNotificationsRead(unread.map((n) => n.id));
      showToast("تم تعليم جميع الإشعارات كمقروءة", "bg-green-600");
    } catch {
      showToast("حدث خطأ أثناء تحديث الإشعارات", "bg-red-500");
    }
  }, [notifications, showConfirm, showToast]);

  const handleDeleteAllReadNotifs = useCallback(async () => {
    const read = notifications.filter((n) => n.isRead);
    if (read.length === 0) {
      showToast("لا توجد إشعارات مقروءة", "bg-blue-500");
      return;
    }
    const confirmed = await showConfirm(
      "حذف الإشعارات المقروءة",
      `هل تريد حذف جميع الإشعارات المقروءة (${read.length})؟`
    );
    if (!confirmed) return;
    setNotifications((prev) => prev.filter((n) => !n.isRead));
    try {
      await deleteAllReadNotifications(read.map((n) => n.id));
      showToast("تم حذف جميع الإشعارات المقروءة", "bg-green-600");
    } catch {
      showToast("حدث خطأ أثناء حذف الإشعارات", "bg-red-500");
    }
  }, [notifications, showConfirm, showToast]);

  const handleRemoveFromFavorites = useCallback(
    async (favoriteId: string, productId: string) => {
      const confirmed = await showConfirm(
        "إزالة من المفضلة",
        "هل تريد إزالة هذا المنتج من المفضلة؟"
      );
      if (!confirmed) return;
      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId));
      setLikedProducts((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      try {
        await removeFavorite(favoriteId);
        showToast("تمت الإزالة من المفضلة ❌", "bg-gray-700");
      } catch {}
    },
    [showConfirm, showToast]
  );

  const handleClearAllFavorites = useCallback(async () => {
    if (favorites.length === 0) return;
    const confirmed = await showConfirm(
      "مسح جميع المفضلة",
      `هل أنت متأكد من حذف جميع المنتجات (${favorites.length} منتج) من المفضلة؟`
    );
    if (!confirmed) return;
    const toDelete = [...favorites];
    setFavorites([]);
    setLikedProducts(new Set());
    try {
      await Promise.all(toDelete.map((f) => removeFavorite(f.id)));
      showToast("تم مسح جميع المفضلة بنجاح 🗑️", "bg-green-600");
    } catch {}
  }, [favorites, showConfirm, showToast]);

  const myProductsCount = products.filter((p) => p.sellerId === userId).length;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#f8fafc] text-[#0f172a] overflow-x-hidden"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <Header
        isLoggedIn={isLoggedIn}
        isGuest={isGuest}
        userType={userType}
        userData={userData}
        userId={userId}
        unreadNotifCount={unreadNotifCount}
        favoritesCount={favorites.length}
        newOrdersCount={newOrdersCount}
        onShowLogin={() => setShowLoginModal(true)}
        onShowAddModal={() => {
          if (!isLoggedIn) { setShowLoginModal(true); return; }
          if (isGuest) { showToast("لا يمكنك نشر إعلانات كزائر", "bg-yellow-600"); return; }
          setShowAddModal(true);
        }}
        onLogout={handleLogout}
        onSwitchView={switchView}
        onResendVerification={handleResendVerification}
      />

      <main
        className="max-w-6xl mx-auto px-4 py-8"
        style={{ paddingBottom: "80px", paddingTop: "70px" }}
      >
        <BottomNav
          currentView={currentView}
          onSwitchView={switchView}
          newOrdersCount={newOrdersCount}
          unreadNotifCount={unreadNotifCount}
          myProductsCount={myProductsCount}
          isLoggedIn={isLoggedIn}
          isGuest={isGuest}
        />

        {currentView === "store" && (
          <StoreView
            products={products}
            userId={userId}
            likedProducts={likedProducts}
            onLike={handleMashiLike}
            onOrder={(p) => setOrderModalProduct(p)}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
        {currentView === "my_products" && (
          <MyProductsView
            products={products}
            userId={userId}
            likedProducts={likedProducts}
            onLike={handleMashiLike}
            onOrder={(p) => setOrderModalProduct(p)}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={() => setShowAddModal(true)}
          />
        )}
        {currentView === "orders" && (
          <OrdersView
            sellerOrders={myOrders}
            buyerOrders={myPlacedOrders}
            tab={ordersTab}
            onTabChange={setOrdersTab}
            onUpdateStatus={handleUpdateOrderStatus}
            newOrdersCount={newOrdersCount}
            isSeller={isLoggedIn && !isGuest}
          />
        )}
        {currentView === "favorites" && (
          <FavoritesView
            favorites={favorites}
            products={products}
            likedProducts={likedProducts}
            onRemove={handleRemoveFromFavorites}
            onClearAll={handleClearAllFavorites}
            onLike={handleMashiLike}
            onSwitchView={switchView}
          />
        )}
        {currentView === "notifications" && (
          <NotificationsView
            notifications={notifications}
            tab={notifTab}
            onTabChange={setNotifTab}
            unreadCount={unreadNotifCount}
            onMarkRead={handleMarkNotifRead}
            onDelete={handleDeleteNotif}
            onMarkAllRead={handleMarkAllNotifRead}
            onDeleteAllRead={handleDeleteAllReadNotifs}
            onViewOrder={(orderId) => {
              switchView("orders");
              setOrdersTab("all");
            }}
          />
        )}
      </main>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onGuest={handleGuestLogin}
          onResetPassword={handleResetPassword}
          showToast={showToast}
        />
      )}

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitProduct}
          showToast={showToast}
        />
      )}

      {orderModalProduct && (
        <OrderModal
          product={orderModalProduct}
          onClose={() => setOrderModalProduct(null)}
          onSubmit={handleSubmitOrder}
          showToast={showToast}
        />
      )}

      {confirmState && (
        <ConfirmModal
          title={confirmState.title}
          message={confirmState.message}
          onConfirm={() => handleConfirmClose(true)}
          onCancel={() => handleConfirmClose(false)}
        />
      )}

      <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[70] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.msg} colorClass={t.color} />
        ))}
      </div>
    </div>
  );
}
