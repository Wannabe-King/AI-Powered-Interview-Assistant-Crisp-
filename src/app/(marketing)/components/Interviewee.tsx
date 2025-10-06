"use client";

import { TabsContent } from "@/components/ui/tabs";
import { Upload } from "./Upload";
import { Quiz } from "./Quiz";
import { useState } from "react";
import { Question, UserData } from "@/lib/types";
import { gemini_call, generateQuestions } from "@/server/gemini";
import { UserDetailsReview } from "./UserDetailReview";

type ViewState = "upload" | "review" | "quiz";

export const Interviewee = () => {
  const [currentView, setCurrentView] = useState<ViewState>("upload");
  const [extractedText, setExtractedText] = useState("");
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    mobile: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleResumeProcessed = async (text: string) => {
    setIsLoading(true);
    setExtractedText(text);

    try {
      // Extract user data from resume
      const extractedUserData = await gemini_call(text);

      if (extractedUserData) {
        setUserData(extractedUserData);
        setCurrentView("review"); // Move to review step
      }
    } catch (error) {
      console.error("Error processing resume:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserDataConfirmed = async (confirmedUserData: UserData) => {
    setIsLoading(true);
    setUserData(confirmedUserData);

    try {
      // Generate personalized questions with confirmed user data
      // const generatedQuestions = await generateQuestions(
      //   extractedText,
      //   confirmedUserData
      // );
      // setQuestions(generatedQuestions);
      setCurrentView("quiz");
    } catch (error) {
      console.error("Error generating questions:", error);
      // Still proceed to quiz even if question generation fails
      setCurrentView("quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setCurrentView("upload");
    setUserData({
      name: "",
      email: "",
      mobile: "",
    });
    setExtractedText("");
  };

  if (isLoading) {
    return (
      <TabsContent value="interviewee">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-200 mx-auto mb-4"></div>
            <p className="text-white">Processing your resume...</p>
          </div>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="quiz">
      {currentView === "upload" && (
        <Upload onResumeProcessed={handleResumeProcessed} />
      )}

      {currentView === "review" && userData && (
        <UserDetailsReview
          userData={userData}
          onConfirm={handleUserDataConfirmed}
          onBack={handleBackToUpload}
        />
      )}

      {currentView === "quiz" && userData && (
        <Quiz
          userData={userData}
          questions={questions}
          resumeText={extractedText}
          onQuizComplete={handleBackToUpload}
        />
      )}
    </TabsContent>
  );
};
