"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Upload } from "./Upload";
import { Quiz } from "./Quiz";
import { useState } from "react";
import { Question, UserData } from "@/lib/types";
import { gemini_call, generateQuestions } from "@/server/gemini";

export const Interviewee = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeProcessed = async (text: string) => {
    setIsLoading(true);
    setExtractedText(text);

    try {
      // Extract user data from resume
      const extractedUserData = await gemini_call(text);

      if (extractedUserData) {
        console.log(extractedUserData);
        setUserData(extractedUserData);

        // Generate personalized questions
        // const generatedQuestions = await generateQuestions(
        //   text,
        //   extractedUserData
        // );
        // setQuestions(generatedQuestions);

        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Error processing resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
      return (
        <TabsContent value="interviewee">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your resume...</p>
            </div>
          </div>
        </TabsContent>
      );
    }

  return (
    <TabsContent value="interviewee">
      {!showQuiz ? (
        <Upload onResumeProcessed={handleResumeProcessed} />
      ) : (
        <Quiz />
      )}
    </TabsContent>
  );
};
