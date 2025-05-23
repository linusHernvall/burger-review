import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";

export default async function Home() {
  const supabase = createClient();

  // Example query - replace with your actual table name
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .limit(10)
    .returns<Post[]>();

  if (error) {
    console.error("Error fetching posts:", error.message);
    return <div className="text-destructive">Error loading posts</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between">
        <h1 className="text-4xl font-bold mb-8">Posts</h1>
        <div className="grid gap-4">
          {posts?.map((post) => (
            <div key={post.id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-muted-foreground">{post.content}</p>
              <div className="mt-2 text-sm text-muted-foreground">
                Created: {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
