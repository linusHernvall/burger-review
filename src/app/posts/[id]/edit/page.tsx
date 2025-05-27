import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { notFound } from "next/navigation";
import EditPostForm from "@/app/posts/[id]/edit/EditPostForm";

export default async function EditPostPage(props: { params: { id: string } }) {
  const id = props.params.id;
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
        <h1 className="text-4xl font-bold">Edit Review</h1>
        <EditPostForm post={post as Post} />
      </div>
    </main>
  );
}
