"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Task } from "@/lib/database"
import { format } from "date-fns"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, status: string) => void
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const getPriorityColor = (priority: string | null) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'warning'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in-progress':
        return 'warning'
      case 'pending':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const handleToggleStatus = async () => {
    setIsLoading(true)
    const newStatus = task.status === 'completed' ? 'pending' : 
                     task.status === 'pending' ? 'in-progress' : 'completed'
    await onToggleStatus(task.id, newStatus)
    setIsLoading(false)
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'

  return (
    <Card className={`transition-all hover:shadow-md ${task.status === 'completed' ? 'opacity-75' : ''} ${isOverdue ? 'border-red-200 dark:border-red-800' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          <div className="flex items-center space-x-1">
            {task.priority && (
              <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                {task.priority}
              </Badge>
            )}
            <Badge variant={getStatusColor(task.status)} className="text-xs">
              {task.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {task.category && (
              <span className="bg-muted px-2 py-1 rounded">
                {task.category}
              </span>
            )}
            {task.due_date && (
              <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                Due: {format(new Date(task.due_date), 'MMM dd, yyyy')}
              </span>
            )}
          </div>
          <span>
            {format(new Date(task.created_at), 'MMM dd')}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleStatus}
            disabled={isLoading}
          >
            {task.status === 'completed' ? '↶ Reopen' : 
             task.status === 'pending' ? '▶ Start' : '✓ Complete'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-destructive hover:text-destructive"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}

