import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { Database } from "@/lib/supabase";

// Define the shape of updateData using Supabase's Database type
type NoteUpdateData = Database["public"]["Tables"]["notes"]["Update"];

// Define the context type to match Next.js expectations
interface RouteContext {
  params: { id: string } | Promise<{ id: string }>;
}

// GET handler: Fetch a single note by ID
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const supabase = createClient();

    // Resolve params if it's a Promise
    const params = await (context.params instanceof Promise
      ? context.params
      : Promise.resolve(context.params));

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: note, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      console.error("Error fetching note:", error);
      return NextResponse.json(
        { error: "Failed to fetch note" },
        { status: 500 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT handler: Update a note by ID
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const supabase = createClient();

    // Resolve params if it's a Promise
    const params = await (context.params instanceof Promise
      ? context.params
      : Promise.resolve(context.params));

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, tags, is_pinned } = body;

    // Construct updateData with type annotation
    const updateData: NoteUpdateData = {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(tags !== undefined && { tags }),
      ...(is_pinned !== undefined && { is_pinned }),
    };

    const { data: note, error } = await supabase
      .from("notes")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Note not found" }, { status: 404 });
      }
      console.error("Error updating note:", error);
      return NextResponse.json(
        { error: "Failed to update note" },
        { status: 500 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE handler: Delete a note by ID
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const supabase = createClient();

    // Resolve params if it's a Promise
    const params = await (context.params instanceof Promise
      ? context.params
      : Promise.resolve(context.params));

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting note:", error);
      return NextResponse.json(
        { error: "Failed to delete note" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
