import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/supabase-storage";

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

    // Log all form data keys and values
    for (const [key, value] of formData.entries()) {
      console.log(`[PUT] formData: ${key} =`, value);
    }

    // Handle image upload if present
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadImage(imageFile);
        console.log("[PUT] Uploaded new image:", imageUrl);
      } catch (uploadError) {
        console.error("[PUT] Error uploading image:", uploadError);
        return NextResponse.json(
          {
            error: `Failed to upload image: ${
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown error"
            }`,
          },
          { status: 500 }
        );
      }
    }

    // Build the update object
    const post: Partial<Post> = {
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string),
      burger_name: formData.get("burger_name") as string,
      restaurant: formData.get("restaurant") as string,
    };
    if (imageUrl) {
      post.image_url = imageUrl;
    }

    console.log("[PUT] Update post object:", post);

    const { error } = await supabase
      .from("posts")
      .update(post)
      .eq("id", params.id)
      .select()
      .returns<Post[]>();

    if (error) {
      console.error("[PUT] Error updating post:", error);
      return NextResponse.json(
        { error: `Failed to update post: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT] Error in post update:", error);
    return NextResponse.json(
      {
        error: `Internal server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
