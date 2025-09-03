import { supabaseClient } from "./superbase";

export const fetchPdfs = async (level) => {
  const { data, error } = await supabaseClient
    .from("document")
    .select("*")
    .eq("level", level);
  return { data, error };
};

export const getUser = async () => {
  const {
    data: { user },
    error: fetchError,
  } = await supabaseClient.auth.getUser();

  const { data: profile } = await supabaseClient
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  return { profile, fetchError };
};

export async function downloadFile(filePath) {
    const { data, error } = await supabaseClient.storage
      .from("pdfs") // bucket name
      .download(filePath);

    if (error) {
      handleOpenSnack(error.message, "error");
      return;
    }
    // Convert blob into a downloadable link
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop(); // keep only filename
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
