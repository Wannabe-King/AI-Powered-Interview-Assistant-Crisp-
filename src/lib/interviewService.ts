import {
  UserData,
  Question,
  InterviewSession,
  InterviewStats,
} from "@/lib/types";

// Interface for interview session data
export interface InterviewSessionData {
  userData: UserData;
  resumeText: string;
  questions: Question[];
  answers: Record<number, string>;
  timeSpent: number;
  completedAt: string;
}

// Save interview session to database
export async function saveInterviewSession(
  data: InterviewSessionData
): Promise<string> {
  try {
    const response = await fetch("/api/interviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "save",
        ...data,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to save interview session");
    }

    return result.sessionId;
  } catch (error) {
    console.error("Error saving interview session:", error);
    throw error;
  }
}

// Update interview answers
export async function updateInterviewAnswers(
  sessionId: string,
  answers: Record<number, string>,
  timeSpent: number,
  completedAt: string
): Promise<void> {
  try {
    const response = await fetch("/api/interviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "update",
        sessionId,
        answers,
        timeSpent,
        completedAt,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to update interview answers");
    }
  } catch (error) {
    console.error("Error updating interview answers:", error);
    throw error;
  }
}

// Get interview session by ID
export async function getInterviewSession(
  sessionId: string
): Promise<InterviewSession | null> {
  try {
    const response = await fetch(
      `/api/interviews?action=get&sessionId=${sessionId}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get interview session");
    }

    return result.session;
  } catch (error) {
    console.error("Error getting interview session:", error);
    throw error;
  }
}

// Get user's interview sessions
export async function getUserInterviewSessions(
  email: string
): Promise<InterviewSession[]> {
  try {
    const response = await fetch(
      `/api/interviews?action=getUserSessions&email=${encodeURIComponent(
        email
      )}`
    );
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get user interview sessions");
    }

    return result.sessions;
  } catch (error) {
    console.error("Error getting user interview sessions:", error);
    throw error;
  }
}

// Get interview statistics
export async function getInterviewStats(): Promise<InterviewStats> {
  try {
    const response = await fetch("/api/interviews?action=stats");
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to get interview stats");
    }

    return result.stats as InterviewStats;
  } catch (error) {
    console.error("Error getting interview stats:", error);
    throw error;
  }
}

// Search interview sessions
export async function searchInterviewSessions(
  searchTerm: string
): Promise<InterviewSession[]> {
  try {
    const response = await fetch("/api/interviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "search",
        searchTerm,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to search interview sessions");
    }

    return result.sessions;
  } catch (error) {
    console.error("Error searching interview sessions:", error);
    throw error;
  }
}

// Delete interview session
export async function deleteInterviewSession(sessionId: string): Promise<void> {
  try {
    const response = await fetch(`/api/interviews?sessionId=${sessionId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to delete interview session");
    }
  } catch (error) {
    console.error("Error deleting interview session:", error);
    throw error;
  }
}
