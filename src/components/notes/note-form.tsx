"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Note } from "@/lib/database"

interface NoteFormProps {
  note?: Note | null
  onSubmit: (data: NoteFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export interface NoteFormData {
  title: string
  content: string
  tags: string[]
  is_pinned: boolean
}

export function NoteForm({ note, onSubmit, onCancel, isLoading = false }: NoteFormProps) {
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(note?.tags || [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<NoteFormData, 'tags'>>({
    defaultValues: {
      title: note?.title || '',
      content: note?.content || '',
      is_pinned: note?.is_pinned || false,
    }
  })

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        content: note.content,
        is_pinned: note.is_pinned,
      })
      setTags(note.tags || [])
    }
  }, [note, reset])

  const handleFormSubmit = (data: Omit<NoteFormData, 'tags'>) => {
    onSubmit({
      ...data,
      tags,
    })
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{note ? 'Edit Note' : 'Create New Note'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
              className="mt-1 capitalize"
              placeholder="Enter note title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              {...register("content", { required: "Content is required" })}
              className="mt-1 min-h-[200px] capitalize"
              placeholder="Write your note content here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Add tags (press Enter)"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_pinned"
              {...register("is_pinned")}
              className="rounded"
            />
            <Label htmlFor="is_pinned" className="text-sm">
              Pin this note
            </Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : note ? "Update Note" : "Create Note"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

