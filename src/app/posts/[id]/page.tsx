import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PostActions from "./PostActions";

export default async function PostPage(props: { params: { id: string } }) {
  const supabase = createClient();

  // Use params.id directly (no await)
  const id = props.params.id;

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <main className="flex min-h-dvh flex-col items-center px-4 py-8 lg:p-20">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-4xl font-bold">{post.burger_name}</h1>
          <PostActions postId={post.id} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">{post.restaurant}</div>
            <div className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
              Rating: {post.rating}/10
            </div>
          </div>

          {post.image_url && (
            <div className="relative w-full aspect-square rounded-lg overflow-hidden">
              <Image
                src={post.image_url}
                alt={`${post.burger_name} at ${post.restaurant}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Back to all reviews
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
