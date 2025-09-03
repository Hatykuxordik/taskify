import { createClient } from "./supabase-client";
import { Database } from "./supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type NoteInsert = Database["public"]["Tables"]["notes"]["Insert"];
export type NoteUpdate = Database["public"]["Tables"]["notes"]["Update"];

export class TaskService {
  private supabase = createClient();

  async getTasks(userId?: string) {
    const query = this.supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Task[] | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async getTaskById(id: string) {
    const { data, error } = await this.supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async createTask(task: TaskInsert) {
    const { data, error } = await this.supabase
      .from("tasks")
      // @ts-expect-error: Supabase type inference issue
      .insert(task)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateTask(id: string, updates: TaskUpdate) {
    const { data, error } = await this.supabase
      .from("tasks")
      // @ts-expect-error: Supabase type inference issue
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteTask(id: string) {
    const { error } = await this.supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;
  }

  async getTasksByStatus(status: string, userId?: string) {
    const query = this.supabase
      .from("tasks")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Task[] | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async getTasksByCategory(category: string, userId?: string) {
    const query = this.supabase
      .from("tasks")
      .select("*")
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Task[] | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async searchTasks(searchTerm: string, userId?: string) {
    const query = this.supabase
      .from("tasks")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order("created_at", { ascending: false });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Task[] | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async getTaskStats(userId?: string) {
    const query = this.supabase.from("tasks").select("status");

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Task[] | null, error: Error | null };

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter((task) => task.status === "pending").length,
      inProgress: data.filter((task) => task.status === "in-progress").length,
      completed: data.filter((task) => task.status === "completed").length,
    };

    return stats;
  }

  // Real-time subscription
  subscribeToTasks(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<Task>) => void
  ) {
    return this.supabase
      .channel("tasks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }
}

export class NoteService {
  private supabase = createClient();

  async getNotes(userId?: string) {
    const query = this.supabase
      .from("notes")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("updated_at", { ascending: false });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Note[] | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async getNoteById(id: string) {
    const { data, error } = await this.supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single() as { data: Note | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async createNote(note: NoteInsert) {
    const { data, error } = await this.supabase
      .from("notes")
      // @ts-expect-error: Supabase type inference issue
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateNote(id: string, updates: NoteUpdate) {
    const { data, error } = await this.supabase
      .from("notes")
      // @ts-expect-error: Supabase type inference issue
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteNote(id: string) {
    const { error } = await this.supabase.from("notes").delete().eq("id", id);

    if (error) throw error;
  }

  async searchNotes(searchTerm: string, userId?: string) {
    const query = this.supabase
      .from("notes")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order("updated_at", { ascending: false });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Note[] | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async getNotesByTag(tag: string, userId?: string) {
    const query = this.supabase
      .from("notes")
      .select("*")
      .contains("tags", [tag])
      .order("updated_at", { ascending: false });

    if (userId) {
      query.eq("user_id", userId);
    }

    const { data, error } = await query as { data: Note[] | null, error: Error | null };

    if (error) throw error;
    return data;
  }

  async togglePin(id: string) {
    const note = await this.getNoteById(id);
    if (!note) return;
    return this.updateNote(id, { is_pinned: !note.is_pinned });
  }

  // Real-time subscription
  subscribeToNotes(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<Note>) => void
  ) {
    return this.supabase
      .channel("notes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes",
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();
  }
}

// Local storage operations for guest mode
export class LocalTaskService {
  private storageKey = "taskify_tasks";

  getTasks(): Task[] {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveTasks(tasks: Task[]) {
    if (typeof window === "undefined") return ;

    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  createTask(task: Omit<Task, "id" | "created_at" | "updated_at" | "user_id">): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      user_id: "",
      status: "pending",
      category: null,
      priority: null,
      due_date: null,
      description: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((task) => task.id === id);

    if (index === -1) return null;

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.saveTasks(tasks);
    return tasks[index];
  }

  deleteTask(id: string): boolean {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (filteredTasks.length === tasks.length) return false;

    this.saveTasks(filteredTasks);
    return true;
  }

  getTaskStats() {
    const tasks = this.getTasks();

    return {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "pending").length,
      inProgress: tasks.filter((task) => task.status === "in-progress").length,
      completed: tasks.filter((task) => task.status === "completed").length,
    };
  }

  searchTasks(searchTerm: string): Task[] {
    const tasks = this.getTasks();
    const term = searchTerm.toLowerCase();

    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
    );
  }
}

export class LocalNoteService {
  private storageKey = "taskify_notes";

  getNotes(): Note[] {
    if (typeof window === "undefined") return [];

    const stored = localStorage.getItem(this.storageKey);
    const notes = stored ? JSON.parse(stored) : [];

    // Sort by pinned first, then by updated_at
    return notes.sort((a: Note, b: Note) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    });
  }

  saveNotes(notes: Note[]) {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.storageKey, JSON.stringify(notes));
  }

  createNote(note: Omit<Note, "id" | "created_at" | "updated_at" | "user_id">): Note {
    const notes = this.getNotes();
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      user_id: "",
      is_pinned: false,
      tags: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    notes.unshift(newNote);
    this.saveNotes(notes);
    return newNote;
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const notes = this.getNotes();
    const index = notes.findIndex((note) => note.id === id);

    if (index === -1) return null;

    notes[index] = {
      ...notes[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    this.saveNotes(notes);
    return notes[index];
  }

  deleteNote(id: string): boolean {
    const notes = this.getNotes();
    const filteredNotes = notes.filter((note) => note.id !== id);

    if (filteredNotes.length === notes.length) return false;

    this.saveNotes(filteredNotes);
    return true;
  }

  searchNotes(searchTerm: string): Note[] {
    const notes = this.getNotes();
    const term = searchTerm.toLowerCase();

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(term) ||
        note.content.toLowerCase().includes(term) ||
        (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(term)))
    );
  }

  getNotesByTag(tag: string): Note[] {
    const notes = this.getNotes();
    return notes.filter((note) => note.tags && note.tags.includes(tag));
  }

  togglePin(id: string): Note | null {
    const notes = this.getNotes();
    const index = notes.findIndex((note) => note.id === id);

    if (index === -1) return null;

    notes[index] = {
      ...notes[index],
      is_pinned: !notes[index].is_pinned,
      updated_at: new Date().toISOString(),
    };

    this.saveNotes(notes);
    return notes[index];
  }
}


