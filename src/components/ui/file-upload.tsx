"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number;
  onChange?: (file: File | null) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export default function FileUpload({
  label,
  accept,
  maxSize,
  onChange,
  error,
  disabled = false,
  id,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (!file) {
        setSelectedFile(null);
        onChange?.(null);
        return;
      }
      if (maxSize && file.size > maxSize) {
        return;
      }
      setSelectedFile(file);
      onChange?.(file);
    },
    [maxSize, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0] ?? null;
      handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setIsDragOver(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-6",
          "border-2 border-dashed rounded-[var(--radius-md)] cursor-pointer",
          "transition-colors duration-150",
          disabled && "opacity-50 cursor-not-allowed",
          isDragOver
            ? "border-gold bg-gold/5"
            : error
            ? "border-danger bg-danger/5"
            : "border-border bg-surface hover:border-border-strong hover:bg-surface-2",
          className
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            !disabled && fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="hidden"
          disabled={disabled}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {selectedFile ? (
          <div className="flex items-center gap-3 w-full">
            <FileText size={20} className="text-gold flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-text-3">
                {formatSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFile(null);
              }}
              className="flex-shrink-0 w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center text-text-3 hover:text-danger hover:bg-danger-bg transition-colors"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={24} className="text-text-3" />
            <div className="text-center">
              <p className="text-sm text-text-2">
                <span className="text-gold font-medium">Click to upload</span>{" "}
                or drag and drop
              </p>
              {(accept || maxSize) && (
                <p className="text-xs text-text-3 mt-1">
                  {accept && `Accepted: ${accept}`}
                  {accept && maxSize && " · "}
                  {maxSize && `Max ${formatSize(maxSize)}`}
                </p>
              )}
            </div>
          </>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
