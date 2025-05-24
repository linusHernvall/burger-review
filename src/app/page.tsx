import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import Link from "next/link";
import PostsList from "./components/PostsList";

export default async function Home() {
  const supabase = createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<Post[]>();

  if (error) {
    console.error("Error fetching posts:", error.message);
    return <div className="text-destructive">Error loading posts</div>;
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between px-4 py-8 lg:p-20">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Burger Reviews</h1>
          <Link
            href="/reviews/new"
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md flex items-center gap-2"
          >
            <span>+</span> Add Burger
          </Link>
        </div>
        <PostsList posts={posts || []} />
      </div>
    </main>
  );
}
