"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { TaskList } from "@/components/tasks/task-list";
import { TaskForm, TaskFormData } from "@/components/tasks/task-form";
import { TaskService, LocalTaskService, Task } from "@/lib/database";
import { createClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import type { User } from "@supabase/supabase-js";

// Allow string literal types for task status if you have enums in DB
type TaskStatus = "todo" | "in_progress" | "done" | string;

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [taskService, setTaskService] = useState<
    TaskService | LocalTaskService | null
  >(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check guest mode
        const guestMode = localStorage.getItem("taskify_mode") === "guest";
        setIsGuestMode(guestMode);

        if (guestMode) {
          const localService = new LocalTaskService();
          setTaskService(localService);
          setTasks(localService.getTasks());
          setIsLoading(false);
          return;
        }

        // Authenticated mode
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          router.push("/login");
          return;
        }

        setUser(user);
        const service = new TaskService();
        setTaskService(service);

        const userTasks = await service.getTasks(user.id);
        setTasks(userTasks);
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        toast.error("Failed to load tasks");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [router, supabase]);

  const handleCreateTask = async (data: TaskFormData) => {
    if (!taskService) return;

    try {
      setIsLoading(true);

      if (isGuestMode) {
        const localService = taskService as LocalTaskService;
        localService.createTask({
          user_id: "guest",
          title: data.title,
          description: data.description,
          status: data.status,
          category: data.category ?? null,
          due_date: data.due_date ?? null,
          priority: data.priority,
        });
        setTasks(localService.getTasks());
      } else {
        const service = taskService as TaskService;
        const newTask = await service.createTask({
          user_id: user!.id,
          title: data.title,
          description: data.description,
          status: data.status,
          category: data.category ?? null,
          due_date: data.due_date ?? null,
          priority: data.priority,
        });
        setTasks((prev) => [newTask, ...prev]);
      }

      toast.success("Task created successfully!");
      setShowForm(false);
    } catch (err) {
      console.error("Create task error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!taskService || !editingTask) return;

    try {
      setIsLoading(true);

      if (isGuestMode) {
        const localService = taskService as LocalTaskService;
        const updatedTask = localService.updateTask(editingTask.id, {
          title: data.title,
          description: data.description,
          status: data.status,
          category: data.category ?? null,
          due_date: data.due_date ?? null,
          priority: data.priority,
        });

        if (updatedTask) {
          setTasks(localService.getTasks());
        }
      } else {
        const service = taskService as TaskService;
        const updatedTask = await service.updateTask(editingTask.id, {
          title: data.title,
          description: data.description,
          status: data.status,
          category: data.category ?? null,
          due_date: data.due_date ?? null,
          priority: data.priority,
        });

        setTasks((prev) =>
          prev.map((task) => (task.id === editingTask.id ? updatedTask : task))
        );
      }

      toast.success("Task updated successfully!");
      setShowForm(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Update task error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!taskService) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      if (isGuestMode) {
        const localService = taskService as LocalTaskService;
        const success = localService.deleteTask(id);
        if (success) {
          setTasks(localService.getTasks());
        }
      } else {
        const service = taskService as TaskService;
        await service.deleteTask(id);
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }

      toast.success("Task deleted successfully!");
    } catch (err) {
      console.error("Delete task error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleToggleStatus = async (id: string, status: TaskStatus) => {
    if (!taskService) return;

    try {
      if (isGuestMode) {
        const localService = taskService as LocalTaskService;
        const updatedTask = localService.updateTask(id, { status });
        if (updatedTask) {
          setTasks(localService.getTasks());
        }
      } else {
        const service = taskService as TaskService;
        const updatedTask = await service.updateTask(id, { status });
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
      }

      toast.success("Task status updated!");
    } catch (err) {
      console.error("Toggle status error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p>Loading your tasks...</p>
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
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={handleEdit}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            onCreateNew={() => setShowForm(true)}
          />
        )}
      </main>
    </div>
  );
}
