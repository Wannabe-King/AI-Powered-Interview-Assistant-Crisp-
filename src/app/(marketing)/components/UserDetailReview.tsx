"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { UserData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface UserDetailsReviewProps {
  userData: UserData;
  onConfirm: (updatedUserData: UserData) => void;
  onBack: () => void;
}

export const UserDetailsReview = ({
  userData,
  onConfirm,
  onBack,
}: UserDetailsReviewProps) => {
  const [editedData, setEditedData] = useState<UserData>(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<UserData>>({});

  // Validation function
  const validateData = (
    data: UserData
  ): { isValid: boolean; errors: Partial<UserData> } => {
    const newErrors: Partial<UserData> = {};

    // Check if name is provided and not just whitespace
    if (!data.name || data.name.trim().length === 0) {
      newErrors.name = "Name is required";
    } else if (data.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Check if email is provided and valid
    if (!data.email || data.email.trim().length === 0) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Check if mobile is provided
    if (!data.mobile || data.mobile.trim().length === 0) {
      newErrors.mobile = "Mobile number is required";
    } else {
      // Basic mobile validation (adjust regex based on your requirements)
      const mobileRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!mobileRegex.test(data.mobile.trim())) {
        newErrors.mobile = "Please enter a valid mobile number";
      }
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  // Check if current data is valid
  const { isValid: isCurrentDataValid, errors: currentErrors } =
    validateData(editedData);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSave = () => {
    const validation = validateData(editedData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsEditing(false);
    onConfirm(editedData);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrors({}); // Clear any existing errors when starting to edit
  };

  const handleCancel = () => {
    setEditedData(userData); // Reset to original data
    setErrors({}); // Clear errors
    setIsEditing(false);
  };

  const handleStartQuiz = () => {
    const validation = validateData(editedData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsEditing(true); // Automatically enter edit mode if validation fails
      return;
    }

    onConfirm(editedData);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="bg-white border-2 border-gray-300 rounded-xl shadow-lg">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Review Your Details
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Please review the extracted information from your resume. All fields
            are required before starting the quiz.
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-lg font-medium text-gray-700 flex items-center gap-2"
              >
                Full Name
                <span className="text-red-500">*</span>
              </Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    id="name"
                    value={editedData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`text-lg p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.name}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`text-lg p-4 border rounded-lg ${
                    !editedData.name || editedData.name.trim().length === 0
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  {editedData.name || "Not provided"}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-lg font-medium text-gray-700 flex items-center gap-2"
              >
                Email Address
                <span className="text-red-500">*</span>
              </Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    id="email"
                    type="email"
                    value={editedData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`text-lg p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.email}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`text-lg p-4 border rounded-lg ${
                    !editedData.email || editedData.email.trim().length === 0
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  {editedData.email || "Not provided"}
                </div>
              )}
            </div>

            {/* Mobile Field */}
            <div className="space-y-2">
              <Label
                htmlFor="mobile"
                className="text-lg font-medium text-gray-700 flex items-center gap-2"
              >
                Mobile Number
                <span className="text-red-500">*</span>
              </Label>
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    id="mobile"
                    value={editedData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    className={`text-lg p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-200 ${
                      errors.mobile
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter your mobile number"
                  />
                  {errors.mobile && (
                    <p className="text-red-600 text-sm flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {errors.mobile}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  className={`text-lg p-4 border rounded-lg ${
                    !editedData.mobile || editedData.mobile.trim().length === 0
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  {editedData.mobile || "Not provided"}
                </div>
              )}
            </div>
          </div>

          {/* Validation Warning */}
          {!isCurrentDataValid && !isEditing && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-red-800">
                  <p className="font-medium">
                    Please complete all required fields
                  </p>
                  <p className="mt-1">
                    All fields marked with * are required before you can start
                    the quiz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            {/* Back Button */}
            <Button
              onClick={onBack}
              variant="outline"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              ← Back to Upload
            </Button>

            {/* Edit/Save Controls */}
            <div className="flex gap-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium"
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="px-6 py-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    Edit Details
                  </Button>
                  <Button
                    onClick={handleStartQuiz}
                    disabled={!isCurrentDataValid}
                    className={`px-8 py-3 font-medium text-lg ${
                      isCurrentDataValid
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Start Quiz →
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium">Why do we need this information?</p>
                <p className="mt-1">
                  These details help us personalize your interview questions and
                  provide relevant feedback based on your background and
                  experience.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
