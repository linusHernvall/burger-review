"use client";

import { Post } from "@/types/database";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(postId: number, e: React.MouseEvent) {
    e.preventDefault(); // Prevent navigation when clicking delete
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    setIsDeleting(postId);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete post");
      }

      // Refresh the page to show updated list
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group block space-y-4 rounded-lg border p-4 hover:border-primary/50 transition-colors"
        >
          <Link href={`/posts/${post.id}`} className="block space-y-2">
            {post.image_url && (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={post.image_url}
                  alt={`${post.burger_name} at ${post.restaurant}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {post.burger_name}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.restaurant}</span>
                <span>•</span>
                <span className="text-primary font-medium">
                  {post.rating}/10
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
