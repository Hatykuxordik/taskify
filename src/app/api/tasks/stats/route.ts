import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { TaskService } from "@/lib/database";
import { Database } from "@/lib/supabase";

// Define Task type for clarity
type Task = Database["public"]["Tables"]["tasks"]["Row"];

// Shape of stats returned by TaskService (adjust based on actual implementation)
interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskService = new TaskService();
    const stats = (await taskService.getTaskStats(user.id)) as TaskStats;

    return NextResponse.json(stats);
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
