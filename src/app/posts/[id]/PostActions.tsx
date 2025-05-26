"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostActionsProps {
  postId: number;
}

export default function PostActions({ postId }: PostActionsProps) {
  const router = useRouter();

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/");
    } else {
      alert("Failed to delete post");
    }
  }

  return (
    <div className="flex gap-2">
      <Link
        href={`/posts/${postId}/edit`}
        className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
      >
        Edit Review
      </Link>
      <form onSubmit={handleDelete}>
        <button
          type="submit"
          className="px-4 py-2 cursor-pointer text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md"
        >
          Delete
        </button>
      </form>
    </div>
  );
}
