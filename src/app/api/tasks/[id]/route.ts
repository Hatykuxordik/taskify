import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { TaskService } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const taskService = new TaskService()
    const task = await taskService.getTaskById(params.id)

    if (!task || task.user_id !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status, category, due_date, priority } = body

    const taskService = new TaskService()
    
    // Verify task ownership
    const existingTask = await taskService.getTaskById(params.id)
    if (!existingTask || existingTask.user_id !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const task = await taskService.updateTask(params.id, {
      title,
      description,
      status,
      category,
      due_date,
      priority,
    })

    return NextResponse.json(task)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const taskService = new TaskService()
    
    // Verify task ownership
    const existingTask = await taskService.getTaskById(params.id)
    if (!existingTask || existingTask.user_id !== user.id) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    await taskService.deleteTask(params.id)

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

