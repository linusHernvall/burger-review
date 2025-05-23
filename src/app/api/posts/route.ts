import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = createClient();

    const post: Omit<Post, "id" | "created_at" | "updated_at"> = {
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string),
      burger_name: formData.get("burger_name") as string,
      restaurant: formData.get("restaurant") as string,
    };

    const { error } = await supabase
      .from("posts")
      .insert([post])
      .select()
      .returns<Post[]>();

    if (error) {
      console.error("Error creating post:", error);
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in post creation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
