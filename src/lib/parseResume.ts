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

export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import("pdfjs-dist");

    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();

    // Use pdf.js to get the text
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const textItems = textContent.items.filter((item) => "str" in item);
      fullText += textItems.map((item) => item.str).join(" ");
    }

    console.log(fullText);

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return "";
  }
};
