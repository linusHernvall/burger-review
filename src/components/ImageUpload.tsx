"use client";

import { useState, useCallback } from "react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImageUrl?: string;
}

export default function ImageUpload({
  onImageSelect,
  currentImageUrl,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageFile(file);
      }
    },
    []
  );

  const handleImageFile = (file: File) => {
    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelect(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Burger Image</label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative w-full aspect-video">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Drag and drop your image here, or{" "}
              <label
                htmlFor="image"
                className="text-primary hover:text-primary/90 cursor-pointer"
              >
                browse
              </label>
            </div>
            <div className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF (max 5MB)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
