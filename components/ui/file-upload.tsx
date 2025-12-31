"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { Upload, X, FileText, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = ".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg",
  maxSize = 10,
  className,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    setError(null);

    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const simulateUpload = (file: File) => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onFileSelect(file);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      simulateUpload(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      simulateUpload(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className={cn("w-full", className)}>
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer",
            isDragging
              ? "border-[#6366F1] bg-[#EEF2FF]"
              : "border-[#E5E7EB] hover:border-[#6366F1] hover:bg-[#F9FAFB]"
          )}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#EEF2FF] flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-[#6366F1]" />
            </div>
            <p className="text-[#111827] font-medium mb-1">
              Drop your file here, or{" "}
              <span className="text-[#6366F1]">browse</span>
            </p>
            <p className="text-sm text-[#6B7280]">
              PDF, DOC, DOCX, TXT, PNG, JPG up to {maxSize}MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-[#E5E7EB] rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#6366F1]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111827] truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-[#6B7280]">
                {formatFileSize(selectedFile.size)}
              </p>
              {uploadProgress < 100 && (
                <div className="mt-2 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6366F1] transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE2E2]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          {uploadProgress === 100 && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[#16A34A]">
              <CheckCircle className="w-4 h-4" />
              File uploaded successfully
            </div>
          )}
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-[#EF4444] flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}
