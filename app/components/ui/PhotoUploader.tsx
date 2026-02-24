"use client";

import { useState } from "react";

interface PhotoUploaderProps {
  onPhotosSelected?: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

export default function PhotoUploader({
  onPhotosSelected,
  maxFiles = 5,
  maxSizeMB = 10,
}: PhotoUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const files: File[] = [];

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList);
    const validFiles: File[] = [];

    newFiles.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image`);
        return;
      }
      if (file.size / 1024 / 1024 > maxSizeMB) {
        alert(`${file.name} is larger than ${maxSizeMB}MB`);
        return;
      }
      if (previews.length + validFiles.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
      files.push(...validFiles);
      onPhotosSelected?.(validFiles);
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Drag Drop Area */}
      <div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: `2px dashed ${isDragging ? "var(--green)" : "var(--border)"}`,
          borderRadius: "var(--radius)",
          padding: "40px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: isDragging ? "var(--green-light)" : "var(--bg)",
          transition: "all 0.3s ease",
          marginBottom: previews.length > 0 ? "20px" : "0",
        }}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          style={{ display: "none" }}
          id="photo-input"
        />
        <label
          htmlFor="photo-input"
          style={{
            cursor: "pointer",
            display: "block",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "8px" }}>📸</div>
          <p style={{ margin: 0, fontWeight: 600 }}>
            Drag photos here or click to browse
          </p>
          <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Up to {maxFiles} images, max {maxSizeMB}MB each
          </p>
        </label>
      </div>

      {/* Previews */}
      {previews.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ fontFamily: "Poppins", marginBottom: "12px", fontSize: "0.95rem" }}>
            Uploaded ({previews.length}/{maxFiles})
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "12px",
            }}
          >
            {previews.map((preview, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "100%",
                  borderRadius: "var(--radius)",
                  overflow: "hidden",
                  background: "var(--border)",
                }}
              >
                <img
                  src={preview}
                  alt={`Preview ${i + 1}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <button
                  onClick={() => removePreview(i)}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    background: "var(--danger)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
