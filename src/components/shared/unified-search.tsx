"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Task,
  Note,
  TaskService,
  NoteService,
  LocalTaskService,
  LocalNoteService,
} from "@/lib/database";
import type { User } from "@supabase/supabase-js";

interface UnifiedSearchProps {
  user?: User | null;
  onTaskSelect?: (task: Task) => void;
  onNoteSelect?: (note: Note) => void;
}

type SearchResult =
  | { type: "task"; item: Task; relevance: number }
  | { type: "note"; item: Note; relevance: number };

export function UnifiedSearch({
  user,
  onTaskSelect,
  onNoteSelect,
}: UnifiedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Detect guest mode from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsGuestMode(localStorage.getItem("taskify_mode") === "guest");
    }
  }, []);

  // Simple relevance scoring algorithm
  const calculateRelevance = (
    searchTerm: string,
    title: string,
    content: string
  ): number => {
    const term = searchTerm.toLowerCase();
    const titleLower = title.toLowerCase();
    const contentLower = content.toLowerCase();

    let score = 0;

    if (titleLower === term) score += 100;
    else if (titleLower.startsWith(term)) score += 80;
    else if (titleLower.includes(term)) score += 60;

    if (contentLower.includes(term)) score += 30;

    const wordBoundaryRegex = new RegExp(`\\b${term}\\b`, "i");
    if (wordBoundaryRegex.test(title)) score += 20;
    if (wordBoundaryRegex.test(content)) score += 10;

    return score;
  };

  // Perform search across tasks and notes (memoized)
  const performSearch = useCallback(
    async (term: string) => {
      if (!term.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults: SearchResult[] = [];

        if (isGuestMode) {
          // Local-only search for guest users
          const localTaskService = new LocalTaskService();
          const localNoteService = new LocalNoteService();

          const tasks = localTaskService.searchTasks(term);
          const notes = localNoteService.searchNotes(term);

          tasks.forEach((task) => {
            const relevance = calculateRelevance(
              term,
              task.title,
              task.description ?? ""
            );
            searchResults.push({ type: "task", item: task, relevance });
          });

          notes.forEach((note) => {
            const relevance = calculateRelevance(
              term,
              note.title,
              note.content
            );
            searchResults.push({ type: "note", item: note, relevance });
          });
        } else if (user) {
          // Authenticated user search
          const taskService = new TaskService();
          const noteService = new NoteService();

          const [tasks, notes] = await Promise.all([
            taskService.searchTasks(term, user.id),
            noteService.searchNotes(term, user.id),
          ]);

          tasks.forEach((task) => {
            const relevance = calculateRelevance(
              term,
              task.title,
              task.description ?? ""
            );
            searchResults.push({ type: "task", item: task, relevance });
          });

          notes.forEach((note) => {
            const relevance = calculateRelevance(
              term,
              note.title,
              note.content
            );
            searchResults.push({ type: "note", item: note, relevance });
          });
        }

        // Sort and trim results
        searchResults.sort((a, b) => b.relevance - a.relevance);
        setResults(searchResults.slice(0, 10));
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isGuestMode, user]
  );

  // Format timestamps relative to "now"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Handle user selecting a result
  const handleItemClick = (result: SearchResult) => {
    if (result.type === "task" && onTaskSelect) {
      onTaskSelect(result.item);
    } else if (result.type === "note" && onNoteSelect) {
      onNoteSelect(result.item);
    }
  };

  // Debounced search on input change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, performSearch]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <Input
          placeholder="Search tasks and notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />

        {searchTerm && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {`No results found for "${searchTerm}"`}
              </div>
            ) : (
              <div className="p-2">
                <div className="text-xs text-muted-foreground mb-2 px-2">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </div>

                {results.map((result) => (
                  <div
                    key={`${result.type}-${result.item.id}`}
                    className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                    onClick={() => handleItemClick(result)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={
                              result.type === "task" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {result.type === "task" ? "📋 Task" : "📝 Note"}
                          </Badge>

                          {result.type === "task" && (
                            <Badge variant="outline" className="text-xs">
                              {(result.item as Task).status}
                            </Badge>
                          )}

                          {result.type === "note" &&
                            (result.item as Note).is_pinned && (
                              <Badge variant="outline" className="text-xs">
                                📌 Pinned
                              </Badge>
                            )}
                        </div>

                        <h4 className="font-medium text-sm truncate capitalize">
                          {result.item.title}
                        </h4>

                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 capitalize">
                          {result.type === "task"
                            ? (result.item as Task).description ??
                              "No description"
                            : (result.item as Note).content}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(result.item.updated_at)}
                          </span>

                          {result.type === "task" &&
                            (result.item as Task).category && (
                              <Badge variant="outline" className="text-xs">
                                {(result.item as Task).category}
                              </Badge>
                            )}

                          {result.type === "note" &&
                            (result.item as Note).tags?.length > 0 && (
                              <div className="flex gap-1">
                                {(result.item as Note).tags
                                  ?.slice(0, 2)
                                  .map((tag, tagIndex) => (
                                    <Badge
                                      key={tagIndex}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      #{tag}
                                    </Badge>
                                  ))}
                                {(result.item as Note).tags!.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{(result.item as Note).tags!.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
