"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { NoteList } from "@/components/notes/note-list";
import { NoteForm, NoteFormData } from "@/components/notes/note-form";
import { NoteService, LocalNoteService, Note } from "@/lib/database";
import { createClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import type { User } from "@supabase/supabase-js";

export default function NotesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [noteService, setNoteService] = useState<
    NoteService | LocalNoteService | null
  >(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const guestMode = localStorage.getItem("taskify_mode") === "guest";
      setIsGuestMode(guestMode);

      if (guestMode) {
        const localService = new LocalNoteService();
        setNoteService(localService);
        setNotes(localService.getNotes());
        setIsLoading(false);
      } else {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error(error);
          router.push("/login");
          return;
        }

        if (!data.user) {
          router.push("/login");
          return;
        }

        setUser(data.user);
        const service = new NoteService();
        setNoteService(service);

        try {
          const userNotes = await service.getNotes(data.user.id);
          setNotes(userNotes);
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Failed to load notes";
          toast.error(message);
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();
  }, [router, supabase]);

  const handleCreateNote = async (data: NoteFormData) => {
    if (!noteService) return;

    try {
      setIsLoading(true);

      if (isGuestMode) {
        const localService = noteService as LocalNoteService;
        localService.createNote({
          user_id: "guest",
          title: data.title,
          content: data.content,
          tags: data.tags,
          is_pinned: data.is_pinned,
        });
        setNotes(localService.getNotes());
        toast.success("Note created successfully!");
      } else {
        const service = noteService as NoteService;
        const newNote = await service.createNote({
          user_id: user!.id,
          title: data.title,
          content: data.content,
          tags: data.tags,
          is_pinned: data.is_pinned,
        });
        setNotes((prev) => [newNote, ...prev]);
        toast.success("Note created successfully!");
      }

      setShowForm(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create note";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNote = async (data: NoteFormData) => {
    if (!noteService || !editingNote) return;

    try {
      setIsLoading(true);

      if (isGuestMode) {
        const localService = noteService as LocalNoteService;
        const updatedNote = localService.updateNote(editingNote.id, {
          title: data.title,
          content: data.content,
          tags: data.tags,
          is_pinned: data.is_pinned,
        });

        if (updatedNote) {
          setNotes(localService.getNotes());
          toast.success("Note updated successfully!");
        }
      } else {
        const service = noteService as NoteService;
        const updatedNote = await service.updateNote(editingNote.id, {
          title: data.title,
          content: data.content,
          tags: data.tags,
          is_pinned: data.is_pinned,
        });

        setNotes((prev) =>
          prev.map((note) => (note.id === editingNote.id ? updatedNote : note))
        );
        toast.success("Note updated successfully!");
      }

      setShowForm(false);
      setEditingNote(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update note";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!noteService) return;
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      if (isGuestMode) {
        const localService = noteService as LocalNoteService;
        const success = localService.deleteNote(id);

        if (success) {
          setNotes(localService.getNotes());
          toast.success("Note deleted successfully!");
        }
      } else {
        const service = noteService as NoteService;
        await service.deleteNote(id);
        setNotes((prev) => prev.filter((note) => note.id !== id));
        toast.success("Note deleted successfully!");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete note";
      toast.error(message);
    }
  };

  const handleTogglePin = async (id: string) => {
    if (!noteService) return;

    try {
      if (isGuestMode) {
        const localService = noteService as LocalNoteService;
        const updatedNote = localService.togglePin(id);

        if (updatedNote) {
          setNotes(localService.getNotes());
          toast.success(
            updatedNote.is_pinned ? "Note pinned!" : "Note unpinned!"
          );
        }
      } else {
        const service = noteService as NoteService;
        const updatedNote = await service.togglePin(id);

        setNotes((prev) =>
          prev.map((note) => (note.id === id ? updatedNote : note))
        );
        toast.success(
          updatedNote.is_pinned ? "Note pinned!" : "Note unpinned!"
        );
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update note";
      toast.error(message);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading your notes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />

      <main className="container mx-auto px-4 py-8">
        {showForm ? (
          <div className="mb-8">
            <NoteForm
              note={editingNote}
              onSubmit={editingNote ? handleUpdateNote : handleCreateNote}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <NoteList
            notes={notes}
            onEdit={handleEdit}
            onDelete={handleDeleteNote}
            onTogglePin={handleTogglePin}
            onCreateNew={() => setShowForm(true)}
          />
        )}
      </main>
    </div>
  );
}
