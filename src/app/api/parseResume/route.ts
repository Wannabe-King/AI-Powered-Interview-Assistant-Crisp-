import { NextRequest, NextResponse } from "next/server";
import { tmpdir } from "os";
import { join } from "path";
import { unlink, writeFile } from "fs/promises";
import WordExtractor from "word-extractor";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const tempDir = tmpdir();
    const tempFilePath = join(tempDir, `temp_${Date.now()}_${file.name}`);

    try {
      // Write the file data to a temporary file
      const bytes = await file.arrayBuffer();
      await writeFile(tempFilePath, Buffer.from(bytes));

      // Extract text using WordExtractor
      const extractor = new WordExtractor();
      const document = await extractor.extract(tempFilePath);
      const text = document.getBody();

      // Clean up the temporary file
      await unlink(tempFilePath);

      return NextResponse.json({ text });
    } catch (error) {
      // Make sure to clean up even if there's an error
      try {
        await unlink(tempFilePath);
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      throw error;
    }
  } catch (error) {
    console.error("Error parsing DOC file:", error);
    return NextResponse.json(
      { error: "Failed to parse DOC file" },
      { status: 500 }
    );
  }
}
