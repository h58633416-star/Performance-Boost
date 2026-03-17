import React from "react";

interface ToastProps {
  message: string;
  colorClass: string;
}

export default function Toast({ message, colorClass }: ToastProps) {
  return (
    <div
      className={`px-6 py-3 rounded-full text-white font-bold shadow-xl pointer-events-auto ${colorClass}`}
      style={{ fontFamily: "'Cairo', sans-serif", direction: "rtl" }}
    >
      {message}
    </div>
  );
}
