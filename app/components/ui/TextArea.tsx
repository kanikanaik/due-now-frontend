"use client";

import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextAreaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#111827] mb-1.5"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full px-4 py-3
          bg-white border border-[#E5E7EB] rounded-lg
          text-[#111827] placeholder-[#9CA3AF]
          transition-all duration-200
          hover:border-[#D1D5DB]
          focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20
          resize-none
          ${
            error
              ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
              : ""
          }
          ${className}
        `}
        rows={4}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-[#EF4444] flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
