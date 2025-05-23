import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", params.id);

    if (error) {
      console.error("Error deleting post:", error);
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in post deletion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const supabase = createClient();

    const post: Partial<Post> = {
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string),
      burger_name: formData.get("burger_name") as string,
      restaurant: formData.get("restaurant") as string,
    };

    const { error } = await supabase
      .from("posts")
      .update(post)
      .eq("id", params.id)
      .select()
      .returns<Post[]>();

    if (error) {
      console.error("Error updating post:", error);
      return NextResponse.json(
        { error: "Failed to update post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in post update:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
