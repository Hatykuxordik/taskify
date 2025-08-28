"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Note } from "@/lib/database"

interface NoteCardProps {
  note: Note
  onEdit: (note: Note) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
}

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id)
    }
  }

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${
      note.is_pinned ? 'ring-2 ring-primary/20 bg-primary/5' : ''
    }`}>
      {note.is_pinned && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 capitalize">
            {note.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTogglePin(note.id)}
            className="ml-2 p-1 h-auto"
            title={note.is_pinned ? "Unpin note" : "Pin note"}
          >
            {note.is_pinned ? "📌" : "📍"}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {note.tags && note.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-3">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap capitalize">
            {isExpanded ? note.content : truncateContent(note.content)}
          </p>
          
          {note.content.length > 150 && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-0 h-auto text-xs mt-1"
            >
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDate(note.updated_at)}
          </span>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(note)}
              className="h-7 px-2 text-xs"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="h-7 px-2 text-xs text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

