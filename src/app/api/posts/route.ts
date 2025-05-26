import { createClient } from "@/lib/supabase";
import { Post } from "@/types/database";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/supabase-storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const supabase = createClient();

    // Handle image upload if present
    let imageUrl = "";
    const imageFile = formData.get("image") as File | null;

    if (imageFile) {
      try {
        console.log("Attempting to upload image:", {
          name: imageFile.name,
          type: imageFile.type,
          size: imageFile.size,
        });
        imageUrl = await uploadImage(imageFile);
        console.log("Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
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

    const post: Omit<Post, "id" | "created_at" | "updated_at"> = {
      content: formData.get("content") as string,
      rating: parseInt(formData.get("rating") as string),
      burger_name: formData.get("burger_name") as string,
      restaurant: formData.get("restaurant") as string,
      image_url: imageUrl,
    };

    console.log("Creating post with data:", post);

    const { error } = await supabase
      .from("posts")
      .insert([post])
      .select()
      .returns<Post[]>();

    if (error) {
      console.error("Error creating post:", error);
      return NextResponse.json(
        { error: `Failed to create post: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in post creation:", error);
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
