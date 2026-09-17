"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  aspectRatio?: "video" | "square";
  className?: string;
}

function ImageSkeleton({ aspectRatio }: { aspectRatio: "video" | "square" }) {
  return (
    <div className={cn("relative w-full bg-surface-2", aspectRatio === "video" ? "aspect-video" : "aspect-square")}>
      <Skeleton className="absolute inset-0" />
    </div>
  );
}

function ImageFallback({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center bg-surface-2 text-text-3", className)}>
      <ImageOff size={32} className="mb-2 opacity-50" />
      <span className="text-sm">Failed to load image</span>
    </div>
  );
}

export default function ImageGallery({
  images,
  aspectRatio = "video",
  className,
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadingStates, setLoadingStates] = useState<Record<number, "loading" | "error" | "loaded">>({});
  const [errorStates, setErrorStates] = useState<Set<number>>(new Set());

  const selected = images[selectedIndex];

  const handleLoad = useCallback((index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: "loaded" }));
  }, []);

  const handleError = useCallback((index: number) => {
    setLoadingStates((prev) => ({ ...prev, [index]: "error" }));
    setErrorStates((prev) => new Set(prev).add(index));
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setSelectedIndex(index);
      }
    },
    [images.length]
  );

  if (images.length === 0) {
    return (
      <div className={cn("rounded-[var(--radius-md)] overflow-hidden", className)}>
        <ImageFallback className={cn(aspectRatio === "video" ? "aspect-video" : "aspect-square")} />
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main image */}
      <div className="relative group">
        <div
          className={cn(
            "relative w-full rounded-[var(--radius-md)] overflow-hidden bg-surface-2",
            aspectRatio === "video" ? "aspect-video" : "aspect-square"
          )}
        >
          {loadingStates[selectedIndex] === undefined && (
            <ImageSkeleton aspectRatio={aspectRatio} />
          )}
          {errorStates.has(selectedIndex) ? (
            <ImageFallback className="absolute inset-0" />
          ) : (
            <img
              src={selected.src}
              alt={selected.alt}
              loading="lazy"
              onLoad={() => handleLoad(selectedIndex)}
              onError={() => handleError(selectedIndex)}
              className={cn(
                "w-full h-full object-cover property-photo transition-opacity duration-200",
                loadingStates[selectedIndex] === "loaded" ? "opacity-100" : "opacity-0"
              )}
            />
          )}

          {/* Caption overlay */}
          {selected.caption && !errorStates.has(selectedIndex) && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/60 to-transparent px-4 py-3">
              <p className="text-sm text-white font-medium">{selected.caption}</p>
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(selectedIndex - 1)}
                disabled={selectedIndex === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-ink/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => goTo(selectedIndex + 1)}
                disabled={selectedIndex === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-ink/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-ink/50 text-white text-xs font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                "relative shrink-0 w-16 h-16 rounded-[var(--radius-sm)] overflow-hidden border-2 transition-colors property-photo-thumb",
                i === selectedIndex
                  ? "border-gold"
                  : "border-transparent hover:border-border-strong"
              )}
              aria-label={`View ${img.alt}`}
            >
              {errorStates.has(i) ? (
                <div className="w-full h-full bg-surface-2 flex items-center justify-center">
                  <ImageOff size={14} className="text-text-3" />
                </div>
              ) : (
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
