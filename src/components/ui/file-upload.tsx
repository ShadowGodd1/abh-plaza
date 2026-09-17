"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const simulateUpload = useCallback(() => {
    setUploadProgress(0);
    setUploadComplete(false);
    let progress = 0;
    const tick = () => {
      progress += Math.random() * 25 + 10;
      if (progress >= 100) {
        setUploadProgress(100);
        setUploadComplete(true);
        progressTimerRef.current = setTimeout(() => {
          setUploadProgress(null);
        }, 1500);
      } else {
        setUploadProgress(Math.round(progress));
        progressTimerRef.current = setTimeout(tick, 200);
      }
    };
    progressTimerRef.current = setTimeout(tick, 150);
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      setSizeError(null);
      if (!file) {
        setSelectedFile(null);
        setUploadProgress(null);
        setUploadComplete(false);
        onChange?.(null);
        return;
      }
      if (maxSize && file.size > maxSize) {
        setSizeError(`File exceeds maximum size of ${formatSize(maxSize)}. Please choose a smaller file.`);
        return;
      }
      setSelectedFile(file);
      onChange?.(file);
      simulateUpload();
    },
    [maxSize, onChange, simulateUpload]
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
            : error || sizeError
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
          aria-describedby={error || sizeError ? `${id}-error` : undefined}
        />

        {selectedFile ? (
          <div className="flex items-center gap-3 w-full">
            <div className="flex-shrink-0">
              {uploadComplete ? (
                <CheckCircle size={20} className="text-success" />
              ) : (
                <FileText size={20} className="text-gold" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-text-3">
                {formatSize(selectedFile.size)}
                {uploadProgress !== null && !uploadComplete && (
                  <span className="ml-2 text-gold">{uploadProgress}%</span>
                )}
                {uploadComplete && (
                  <span className="ml-2 text-success font-medium">Uploaded</span>
                )}
              </p>
              {uploadProgress !== null && !uploadComplete && (
                <div className="mt-2 h-1 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
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
      {(error || sizeError) && (
        <p id={`${id}-error`} className="text-xs text-danger flex items-center gap-1">
          <AlertCircle size={12} />
          {sizeError || error}
        </p>
      )}
    </div>
  );
}
