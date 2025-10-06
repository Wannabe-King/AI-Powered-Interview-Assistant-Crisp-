import { NextRequest, NextResponse } from "next/server";
import {
  saveInterviewSession,
  getInterviewSession,
  getUserInterviewSessions,
  getInterviewStats,
  updateInterviewAnswers,
  deleteInterviewSession,
  searchInterviewSessions,
  initializeTables,
} from "@/server/db";

// Initialize database tables on first request
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await initializeTables();
    isInitialized = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();

    const { action, ...data } = await request.json();

    switch (action) {
      case "save": {
        const sessionId = await saveInterviewSession(data);
        return NextResponse.json({ success: true, sessionId });
      }

      case "update": {
        const { sessionId, answers, timeSpent, completedAt } = data;
        await updateInterviewAnswers(
          sessionId,
          answers,
          timeSpent,
          completedAt
        );
        return NextResponse.json({ success: true });
      }

      case "search": {
        const { searchTerm } = data;
        const sessions = await searchInterviewSessions(searchTerm);
        return NextResponse.json({ success: true, sessions });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Database operation error:", error);
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const sessionId = searchParams.get("sessionId");
    const email = searchParams.get("email");

    switch (action) {
      case "get": {
        if (!sessionId) {
          return NextResponse.json(
            { error: "Session ID required" },
            { status: 400 }
          );
        }
        const session = await getInterviewSession(sessionId);
        return NextResponse.json({ success: true, session });
      }

      case "getUserSessions": {
        if (!email) {
          return NextResponse.json(
            { error: "Email required" },
            { status: 400 }
          );
        }
        const sessions = await getUserInterviewSessions(email);
        return NextResponse.json({ success: true, sessions });
      }

      case "stats": {
        const stats = await getInterviewStats();
        return NextResponse.json({ success: true, stats });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Database operation error:", error);
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    await deleteInterviewSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database operation error:", error);
    return NextResponse.json(
      { error: "Database operation failed" },
      { status: 500 }
    );
  }
}
