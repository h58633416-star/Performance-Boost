import React, { useState } from "react";
import { X, Eye, EyeOff, LogIn, UserPlus, Users, RotateCcw, Store, User } from "lucide-react";

interface Props {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (
    email: string,
    password: string,
    displayName: string,
    type: "user" | "store",
    phoneNumber: string,
    instagramUsername: string
  ) => Promise<void>;
  onGuest: () => void;
  onResetPassword: (email: string) => Promise<void>;
  showToast: (msg: string, color?: string) => void;
}

type ModalMode = "home" | "login" | "signup" | "reset";

export default function LoginModal({ onClose, onLogin, onSignup, onGuest, onResetPassword, showToast }: Props) {
  const [mode, setMode] = useState<ModalMode>("home");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [accountType, setAccountType] = useState<"user" | "store">("user");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { showToast("يرجى إدخال البريد وكلمة المرور", "bg-yellow-600"); return; }
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e?.code === "auth/user-not-found" || e?.code === "auth/wrong-password" || e?.code === "auth/invalid-credential") {
        showToast("البريد الإلكتروني أو كلمة المرور غير صحيحة", "bg-red-500");
      } else if (e?.code === "auth/too-many-requests") {
        showToast("الحساب مقفل مؤقتاً. يرجى المحاولة لاحقاً", "bg-red-500");
      } else {
        showToast("حدث خطأ أثناء تسجيل الدخول", "bg-red-500");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!displayName.trim()) { showToast("يرجى إدخال اسمك", "bg-yellow-600"); return; }
    if (!email || !password) { showToast("يرجى إدخال البريد وكلمة المرور", "bg-yellow-600"); return; }
    if (password.length < 6) { showToast("كلمة المرور يجب أن تكون 6 أحرف على الأقل", "bg-yellow-600"); return; }
    setLoading(true);
    try {
      await onSignup(email, password, displayName, accountType, phoneNumber, instagramUsername);
    } catch (err: unknown) {
      const e = err as { code?: string };
      if (e?.code === "auth/email-already-in-use") {
        showToast("هذا البريد الإلكتروني مستخدم بالفعل", "bg-red-500");
      } else if (e?.code === "auth/weak-password") {
        showToast("كلمة المرور ضعيفة، يرجى استخدام كلمة مرور أقوى", "bg-red-500");
      } else {
        showToast("حدث خطأ أثناء إنشاء الحساب", "bg-red-500");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!resetEmail) { showToast("يرجى إدخال بريدك الإلكتروني", "bg-yellow-600"); return; }
    setLoading(true);
    try {
      await onResetPassword(resetEmail);
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
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-xl font-black text-gray-900">
            {mode === "home" && "أهلاً بك في ماشي!"}
            {mode === "login" && "تسجيل الدخول"}
            {mode === "signup" && "إنشاء حساب جديد"}
            {mode === "reset" && "إعادة تعيين كلمة المرور"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {mode === "home" && (
            <div className="space-y-3">
              <p className="text-gray-600 text-sm mb-6 text-center">اختر طريقة الدخول المناسبة لك:</p>
              <button
                onClick={() => setMode("login")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors min-h-[48px] shadow-lg shadow-indigo-200"
              >
                <LogIn className="w-5 h-5" />
                تسجيل الدخول
              </button>
              <button
                onClick={() => setMode("signup")}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors min-h-[48px] shadow-lg shadow-green-200"
              >
                <UserPlus className="w-5 h-5" />
                إنشاء حساب جديد
              </button>
              <button
                onClick={onGuest}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors border border-gray-200 min-h-[48px]"
              >
                <Users className="w-5 h-5 text-gray-500" />
                الدخول كزائر (تسوق فقط)
              </button>
            </div>
          )}

          {mode === "login" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-12"
                    placeholder="••••••••"
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors min-h-[48px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    تسجيل الدخول
                  </>
                )}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => setMode("reset")}
                  className="text-indigo-600 hover:underline font-medium min-h-[44px]"
                >
                  نسيت كلمة المرور؟
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className="text-indigo-600 hover:underline font-medium min-h-[44px]"
                >
                  إنشاء حساب جديد
                </button>
              </div>
              <button
                onClick={() => setMode("home")}
                className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 min-h-[44px]"
              >
                ← العودة
              </button>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-2">نوع الحساب</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType("user")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all min-h-[48px] ${
                      accountType === "user"
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-indigo-300"
                    }`}
                  >
                    <User className="w-5 h-5" />
                    مستخدم
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("store")}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 transition-all min-h-[48px] ${
                      accountType === "store"
                        ? "border-pink-600 bg-pink-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-pink-300"
                    }`}
                  >
                    <Store className="w-5 h-5" />
                    متجر
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">
                  {accountType === "store" ? "اسم المتجر" : "الاسم"}
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={accountType === "store" ? "اسم متجرك" : "اسمك الكامل"}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-12"
                    placeholder="6 أحرف على الأقل"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">رقم الهاتف (اختياري)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="07xxxxxxxx"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">حساب إنستغرام (اختياري)</label>
                <input
                  type="text"
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="@username"
                  dir="ltr"
                />
              </div>
              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors min-h-[48px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    إنشاء الحساب
                  </>
                )}
              </button>
              <div className="text-center text-sm">
                <button onClick={() => setMode("login")} className="text-indigo-600 hover:underline font-medium min-h-[44px]">
                  لديك حساب؟ سجل الدخول
                </button>
              </div>
              <button onClick={() => setMode("home")} className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 min-h-[44px]">
                ← العودة
              </button>
            </div>
          )}

          {mode === "reset" && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
              </p>
              <div>
                <label className="text-sm font-bold text-gray-700 block mb-1.5">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 transition-colors min-h-[48px]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <RotateCcw className="w-5 h-5" />
                    إرسال رابط الاستعادة
                  </>
                )}
              </button>
              <button onClick={() => setMode("login")} className="w-full text-gray-500 text-sm font-medium py-2 min-h-[44px]">
                ← العودة
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
