import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { TaskService } from "@/lib/database";

// ✅ Helper to safely extract error messages
function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred";
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskService = new TaskService();
    const tasks = await taskService.getTasks(user.id);

    return NextResponse.json(tasks);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, status, category, due_date, priority } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const taskService = new TaskService();
    const task = await taskService.createTask({
      user_id: user.id,
      title,
      description,
      status: status || "pending",
      category,
      due_date,
      priority,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
