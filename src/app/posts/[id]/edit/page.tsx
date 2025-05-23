import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { notFound } from "next/navigation";
import EditPostForm from "@/app/posts/[id]/edit/EditPostForm";

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        <h1 className="text-4xl font-bold">Edit Review</h1>
        <EditPostForm post={post as Post} />
      </div>
    </main>
  );
}
