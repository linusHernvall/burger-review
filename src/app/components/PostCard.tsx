"use client";

import { Post } from "@/types/database";
import Link from "next/link";
import { useState } from "react";

interface PostCardProps {
  post: Post;
  onDelete: () => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigation when clicking delete
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete post");
      }

      onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  // Format date in ISO format (YYYY-MM-DD) to ensure consistency
  const formattedDate = new Date(post.created_at).toISOString().split("T")[0];

  return (
    <div className="relative">
      <Link
        href={`/posts/${post.id}`}
        className="block p-4 border rounded-lg shadow-sm hover:border-primary/50 transition-colors"
      >
        {error && (
          <div className="p-2 mb-2 text-sm text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{post.burger_name}</h2>
            <p className="text-sm text-muted-foreground">{post.restaurant}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Rating: {post.rating}/10
          </div>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </div>
      </Link>
      <div className="absolute top-4 right-4 flex gap-2">
        <Link
          href={`/posts/${post.id}/edit`}
          className="p-2 text-primary hover:bg-primary/10 rounded-md"
          title="Edit review"
          onClick={(e) => e.stopPropagation()}
        >
          ✏️
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 cursor-pointer text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete review"
        >
          {isDeleting ? (
            <span className="animate-pulse">Deleting...</span>
          ) : (
            "🗑️"
          )}
        </button>
      </div>
    </div>
  );
}
