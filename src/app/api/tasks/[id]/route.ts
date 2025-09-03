import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { TaskService } from "@/lib/database";
import { Database } from "@/lib/supabase";

// Define Task row type
type Task = Database["public"]["Tables"]["tasks"]["Row"];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskService = new TaskService();
    const task = (await taskService.getTaskById(id)) as Task | null;

    if (!task || task.user_id !== user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Task>;
    const { title, description, status, category, due_date, priority } = body;

    const taskService = new TaskService();
    const existingTask = (await taskService.getTaskById(id)) as Task | null;

    if (!existingTask || existingTask.user_id !== user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const updatedTask = (await taskService.updateTask(id, {
      title,
      description,
      status,
      category,
      due_date,
      priority,
    })) as Task;

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskService = new TaskService();
    const existingTask = (await taskService.getTaskById(id)) as Task | null;

    if (!existingTask || existingTask.user_id !== user.id) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await taskService.deleteTask(id);

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
