import { neon } from "@neondatabase/serverless";
import {
  UserData,
  Question,
  InterviewSession,
  InterviewStats,
} from "@/lib/types";

const sql = neon(process.env.DATABASE_URL as string);

// Initialize database tables
export async function initializeTables() {
  try {
    // Create interview_sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS interview_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_name VARCHAR(255) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        user_mobile VARCHAR(50) NOT NULL,
        resume_text TEXT,
        questions JSONB,
        answers JSONB,
        time_spent INTEGER,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create index for faster queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_interview_sessions_email 
      ON interview_sessions(user_email)
    `;

    console.log("Database tables initialized successfully");
  } catch (error) {
    console.error("Error initializing database tables:", error);
    throw error;
  }
}

// Get database version (for testing connection)
export async function getData() {
  const response = await sql`SELECT version()`;
  return response[0].version;
}

// Save interview session data
export async function saveInterviewSession(data: {
  userData: UserData;
  resumeText: string;
  questions: Question[];
  answers: Record<number, string>;
  timeSpent: number;
  completedAt: string;
}): Promise<string> {
  try {
    const result = await sql`
      INSERT INTO interview_sessions (
        user_name, 
        user_email, 
        user_mobile, 
        resume_text, 
        questions, 
        answers, 
        time_spent, 
        completed_at
      ) VALUES (
        ${data.userData.name},
        ${data.userData.email},
        ${data.userData.mobile},
        ${data.resumeText},
        ${JSON.stringify(data.questions)},
        ${JSON.stringify(data.answers)},
        ${data.timeSpent},
        ${data.completedAt}
      )
      RETURNING id
    `;

    const sessionId = result[0].id;
    console.log("Interview session saved with ID:", sessionId);
    return sessionId;
  } catch (error) {
    console.error("Error saving interview session:", error);
    throw error;
  }
}

// Get interview session by ID
export async function getInterviewSession(
  sessionId: string
): Promise<InterviewSession | null> {
  try {
    const result = await sql`
      SELECT * FROM interview_sessions 
      WHERE id = ${sessionId}
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0] as InterviewSession;
  } catch (error) {
    console.error("Error getting interview session:", error);
    throw error;
  }
}

// Get all interview sessions for a user by email
export async function getUserInterviewSessions(
  email: string
): Promise<InterviewSession[]> {
  try {
    const result = await sql`
      SELECT * FROM interview_sessions 
      WHERE user_email = ${email}
      ORDER BY created_at DESC
    `;

    return result as InterviewSession[];
  } catch (error) {
    console.error("Error getting user interview sessions:", error);
    throw error;
  }
}

// Get interview statistics
export async function getInterviewStats(): Promise<InterviewStats> {
  try {
    const [
      totalSessionsResult,
      totalUsersResult,
      avgTimeResult,
      recentSessionsResult,
    ] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM interview_sessions`,
      sql`SELECT COUNT(DISTINCT user_email) as count FROM interview_sessions`,
      sql`SELECT AVG(time_spent) as avg_time FROM interview_sessions WHERE time_spent IS NOT NULL`,
      sql`
        SELECT * FROM interview_sessions 
        ORDER BY created_at DESC 
        LIMIT 10
      `,
    ]);

    return {
      totalSessions: parseInt(totalSessionsResult[0].count),
      totalUsers: parseInt(totalUsersResult[0].count),
      averageTimeSpent: parseFloat(avgTimeResult[0].avg_time) || 0,
      recentSessions: recentSessionsResult as InterviewSession[],
    };
  } catch (error) {
    console.error("Error getting interview stats:", error);
    throw error;
  }
}

// Update interview session with answers
export async function updateInterviewAnswers(
  sessionId: string,
  answers: Record<number, string>,
  timeSpent: number,
  completedAt: string
): Promise<void> {
  try {
    await sql`
      UPDATE interview_sessions 
      SET 
        answers = ${JSON.stringify(answers)},
        time_spent = ${timeSpent},
        completed_at = ${completedAt}
      WHERE id = ${sessionId}
    `;

    console.log("Interview answers updated for session:", sessionId);
  } catch (error) {
    console.error("Error updating interview answers:", error);
    throw error;
  }
}

// Delete interview session
export async function deleteInterviewSession(sessionId: string): Promise<void> {
  try {
    await sql`
      DELETE FROM interview_sessions 
      WHERE id = ${sessionId}
    `;

    console.log("Interview session deleted:", sessionId);
  } catch (error) {
    console.error("Error deleting interview session:", error);
    throw error;
  }
}

// Search interview sessions by name or email
export async function searchInterviewSessions(
  searchTerm: string
): Promise<InterviewSession[]> {
  try {
    const result = await sql`
      SELECT * FROM interview_sessions 
      WHERE 
        user_name ILIKE ${"%" + searchTerm + "%"} OR 
        user_email ILIKE ${"%" + searchTerm + "%"}
      ORDER BY created_at DESC
      LIMIT 50
    `;

    return result as InterviewSession[];
  } catch (error) {
    console.error("Error searching interview sessions:", error);
    throw error;
  }
}

// Get sessions within date range
export async function getSessionsByDateRange(
  startDate: string,
  endDate: string
): Promise<InterviewSession[]> {
  try {
    const result = await sql`
      SELECT * FROM interview_sessions 
      WHERE created_at BETWEEN ${startDate} AND ${endDate}
      ORDER BY created_at DESC
    `;

    return result as InterviewSession[];
  } catch (error) {
    console.error("Error getting sessions by date range:", error);
    throw error;
  }
}
