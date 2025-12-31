"use client";

import * as React from "react";
import { useEffect, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({
  message,
  type = "info",
  isVisible,
  onClose,
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const variants = {
    success: {
      bg: "bg-[#DCFCE7]",
      text: "text-[#16A34A]",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    error: {
      bg: "bg-[#FEE2E2]",
      text: "text-[#DC2626]",
      icon: <AlertCircle className="w-5 h-5" />,
    },
    info: {
      bg: "bg-[#EEF2FF]",
      text: "text-[#6366F1]",
      icon: <Info className="w-5 h-5" />,
    },
  };

  const { bg, text, icon } = variants[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
          bg,
          text
        )}
      >
        {icon}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
