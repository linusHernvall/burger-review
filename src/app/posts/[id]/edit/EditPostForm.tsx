"use client";

import { Post } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditPostFormProps {
  post: Post;
}

export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updatePost(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update post");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={updatePost} className="space-y-6">
      {error && (
        <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="burger_name"
          className="block capitalize text-sm font-medium"
        >
          Burger name
        </label>
        <input
          type="text"
          id="burger_name"
          name="burger_name"
          required
          maxLength={100}
          defaultValue={post.burger_name}
          className="w-full p-2 border rounded-md bg-background"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="restaurant"
          className="block capitalize text-sm font-medium"
        >
          Restaurant
        </label>
        <input
          type="text"
          id="restaurant"
          name="restaurant"
          required
          maxLength={100}
          defaultValue={post.restaurant}
          className="w-full p-2 border rounded-md bg-background"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="rating" className="block text-sm font-medium">
          Rating (1-10)
        </label>
        <input
          type="number"
          id="rating"
          name="rating"
          min="1"
          max="10"
          required
          defaultValue={post.rating}
          className="w-full p-2 border rounded-md bg-background"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block capitalize text-sm font-medium"
        >
          Thoughts about the burger
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={4}
          maxLength={1000}
          defaultValue={post.content}
          className="w-full p-2 border rounded-md bg-background"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
