"use client";

import { Post } from "@/types/database";
import PostCard from "./PostCard";

interface PostsListProps {
  posts: Post[];
}

export default function PostsList({ posts }: PostsListProps) {
  return (
    <div className="grid gap-4">
      {posts?.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onDelete={() => {
            // The page will be revalidated automatically
          }}
        />
      ))}
    </div>
  );
}
