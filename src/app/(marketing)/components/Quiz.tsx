"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Question, UserData } from "@/lib/types";
import { Trophy } from "lucide-react";
import { saveInterviewSession } from "@/lib/interviewService";

interface QuizProps {
  userData: UserData;
  questions?: Array<Question>;
  resumeText?: string;
  onQuizComplete?: () => void;
}

export const Quiz = ({
  userData,
  questions = [],
  resumeText = "",
  onQuizComplete,
}: QuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(10); // 30 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Default questions for demo
  const defaultQuestions: Question[] = [
    {
      id: 1,
      question:
        "Tell me about yourself and your background in software development.",
      maxMarks: 10,
      time: 300, // 5 minutes per question
    },
    {
      id: 2,
      question:
        "Describe a challenging project you worked on and how you overcame the difficulties.",
      maxMarks: 15,
      time: 300,
    },
    {
      id: 3,
      question: "What are your strengths and how do they apply to this role?",
      maxMarks: 10,
      time: 300,
    },
  ];

  const quizQuestions = questions.length > 0 ? questions : defaultQuestions;
  const currentQuestion = quizQuestions[currentQuestionIndex];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isSubmitted) {
      setIsTimerActive(false);
      // Auto-submit when time runs out
      handleSubmit();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, isSubmitted]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Start timer
  const startQuiz = () => {
    setIsTimerActive(true);
  };

  // Handle answer change
  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  // Navigate to next question
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz
  const handleSubmit = async () => {
    setIsTimerActive(false);
    setIsSubmitted(true);

    const sessionData = {
      userData,
      resumeText,
      questions: quizQuestions,
      answers,
      timeSpent: 10 - timeLeft,
      completedAt: new Date().toISOString(),
    };

    console.log("Quiz submitted:", sessionData);

    // Save to database
    try {
      const sessionId = await saveInterviewSession(sessionData);
      console.log("Session saved with ID:", sessionId);
    } catch (error) {
      console.error("Failed to save session to database:", error);
      // Continue with the flow even if database save fails
    }

    // Show success message for 3 seconds, then redirect
    setTimeout(() => {
      if (onQuizComplete) {
        onQuizComplete();
      }
    }, 3000);
  };

  // Check if it's the last question
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="w-3xl mx-auto p-4">
      <Card className="min-h-[600px] bg-white border-2 border-gray-300 rounded-xl shadow-lg">
        {!isSubmitted && (
          <CardContent className="p-8">
            {/* Header with Q.No, Max Marks, and Timer */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-8">
                <div className="text-lg font-medium text-gray-700">
                  <span className="text-gray-500">Q.No.</span>{" "}
                  <span className="ml-2 text-wrap">{currentQuestion.id}</span>
                </div>
                <div className="text-lg font-medium text-gray-700">
                  <span className="text-gray-500">Max Marks</span>{" "}
                  <span className="ml-2">{currentQuestion.maxMarks}</span>
                </div>
              </div>

              {/* Timer */}
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg border-2 border-gray-600">
                <div className="text-center">
                  <div className="text-sm text-gray-300 mb-1">Timer</div>
                  <div className="text-xl font-mono font-bold">
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            {/* Question Box */}
            <div className="mb-8">
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 min-h-[120px]">
                <div className="text-sm text-gray-500 mb-2">Question</div>
                <div className="text-lg text-gray-800 leading-relaxed">
                  {currentQuestion.question}
                </div>
              </div>
            </div>

            {/* Answer Text Box */}
            <div className="mb-8">
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4 min-h-[200px]">
                <div className="text-sm text-gray-500 mb-3">
                  Text box for answer
                </div>
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  className="w-full h-40 p-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  disabled={!isTimerActive}
                />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex justify-between items-center">
              {/* Start Quiz Button (shown only before quiz starts) */}
              {!isTimerActive && timeLeft === 10 && (
                <Button
                  onClick={startQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
                >
                  Start Quiz
                </Button>
              )}

              {/* Navigation Buttons (shown during quiz) */}
              {isTimerActive && (
                <div className="flex gap-4">
                  <Button
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    variant="outline"
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                </div>
              )}

              {/* Next/Submit Button */}
              {isTimerActive && (
                <div className="bg-gray-900 text-white px-6 py-3 rounded-lg border-2 border-gray-600">
                  <Button
                    onClick={isLastQuestion ? handleSubmit : handleNext}
                    className="bg-transparent hover:bg-gray-800 text-white border-0 font-medium"
                  >
                    {isLastQuestion ? "Submit" : "Next"}
                  </Button>
                </div>
              )}
            </div>

            {/* Quiz Progress */}
            {isTimerActive && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            )}
          </CardContent>
        )}
        {isSubmitted && (
          <CardContent className="p-8 flex flex-col items-center justify-center min-h-[600px] relative">
            <div className="text-center relative z-10">
              {/* Congratulation Text */}
              <h2 className="text-4xl font-bold text-green-600 mb-4">
                🎉 Congratulations! 🎉
              </h2>

              <p className="text-2xl text-gray-700 mb-6 font-medium">
                You've successfully completed the quiz!
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
