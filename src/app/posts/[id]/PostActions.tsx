"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface PostActionsProps {
  postId: number;
}

export default function PostActions({ postId }: PostActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleDelete() {
    setOpen(false);
    setShowModal(false);
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to delete post");
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="p-2 rounded-full cursor-pointer hover:bg-muted transition-colors"
        aria-label="Show actions"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
      >
        <span className="text-2xl">⋮</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-popover border border-border rounded-md shadow-lg z-10">
          <Link
            href={`/posts/${postId}/edit`}
            className="block px-4 py-2 text-sm hover:bg-muted rounded-t-md"
            onClick={() => setOpen(false)}
          >
            Edit
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              setShowModal(true);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-b-md"
          >
            Delete
          </button>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-4">Delete Burger?</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-md text-sm bg-muted hover:bg-muted/80"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
