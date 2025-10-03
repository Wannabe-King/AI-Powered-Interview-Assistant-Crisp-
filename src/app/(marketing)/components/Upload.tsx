"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState } from "react";

import * as mammoth from "mammoth";
import { extractFromDocFile, extractTextFromPDF } from "@/lib/parseResume";

interface UploadProps {
  onResumeProcessed?: (text: string) => void;
}

export const Upload = ({ onResumeProcessed }: UploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      let fullText = "";
      if (file.type == "application/pdf") {
        fullText = await extractTextFromPDF(file);
      } else if (
        file.type ==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        fullText = result.value;
      } else if (file.type == "application/msword") {
        fullText = await extractFromDocFile(file);
      }
      console.log("array buffer: ", fullText);
      console.log("Resume uploaded:", file.type);

      // Call the callback if text was extracted
      if (fullText.trim() && onResumeProcessed) {
        onResumeProcessed(fullText);
      }
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx"))
    ) {
      setUploadedFile(file);
      // const buffer = Buffer.from(await file.arrayBuffer());
      // const data = await pdfParse(buffer);
      // console.log("Buffer: ", data);
      console.log("Resume dropped:", file.type);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume to get personalized interview questions and
          feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex items-center justify-center w-full"
          >
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploadedFile ? (
                  <>
                    <svg
                      className="w-10 h-10 mb-3 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-700 font-semibold">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX (MAX. 10MB)
                    </p>
                  </>
                )}
              </div>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {uploadedFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-400 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Resume uploaded successfully!
                  </p>
                  <p className="text-sm text-green-600">
                    File: {uploadedFile.name} (
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Your resume will be analyzed to provide tailored interview
              questions and practice scenarios
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
