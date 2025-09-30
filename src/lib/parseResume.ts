export const extractFromDocFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/parseResume", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log(result);
    if (result.text) {
      return result.text;
    } else {
      throw new Error(result.error || "Failed to extract text");
    }
  } catch (error) {
    console.error("Error parsing DOC file:", error);
    return "";
  }
};
