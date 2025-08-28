"use client"

import { useState, useMemo } from "react"
import { NoteCard } from "./note-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Note } from "@/lib/database"

interface NoteListProps {
  notes: Note[]
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onCreateNew: () => void
}

export function NoteList({ notes, onEdit, onDelete, onTogglePin, onCreateNew }: NoteListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState("all")

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [notes])

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      
      const matchesTag = selectedTag === "all" || 
                        (note.tags && note.tags.includes(selectedTag))

      return matchesSearch && matchesTag
    })
  }, [notes, searchTerm, selectedTag])

  const pinnedNotes = filteredNotes.filter(note => note.is_pinned)
  const unpinnedNotes = filteredNotes.filter(note => !note.is_pinned)

  const noteStats = useMemo(() => {
    return {
      total: notes.length,
      pinned: notes.filter(n => n.is_pinned).length,
      tags: allTags.length,
    }
  }, [notes, allTags])

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Notes</h1>
          <p className="text-muted-foreground">
            {noteStats.total} total • {noteStats.pinned} pinned • {noteStats.tags} tags
          </p>
        </div>
        <Button onClick={onCreateNew} className="w-full sm:w-auto">
          + New Note
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Search notes and tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <Select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="all">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>#{tag}</option>
          ))}
        </Select>
      </div>

      {/* Tag Cloud */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Quick filters:</span>
          {allTags.slice(0, 10).map(tag => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedTag(selectedTag === tag ? "all" : tag)}
            >
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">
            {notes.length === 0 ? "No notes yet" : "No notes match your filters"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {notes.length === 0 
              ? "Create your first note to get started!" 
              : "Try adjusting your search or filters"
            }
          </p>
          {notes.length === 0 && (
            <Button onClick={onCreateNew}>
              Create Your First Note
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                📌 Pinned Notes
                <Badge variant="secondary">{pinnedNotes.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {unpinnedNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  📄 Notes
                  <Badge variant="secondary">{unpinnedNotes.length}</Badge>
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unpinnedNotes.map(note => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

