import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const id = await Promise.resolve(params.id);
  const supabase = createClient();

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
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">{post.burger_name}</h1>
          <Link
            href={`/posts/${post.id}/edit`}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
          >
            Edit Review
          </Link>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">{post.restaurant}</div>
            <div className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
              Rating: {post.rating}/10
            </div>
          </div>

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
