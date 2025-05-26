import { createClient } from "./supabase";

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();

  // Validate file
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB limit
    throw new Error("File size must be less than 5MB");
  }

  // Create a unique file name
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()
    .toString(36)
    .substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `burger-images/${fileName}`;

  console.log("Uploading image to Supabase:", {
    fileName,
    filePath,
    fileType: file.type,
    fileSize: file.size,
  });

  try {
    // Upload the file to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(filePath);

    console.log("Image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error in uploadImage:", error);
    throw error;
  }
}
