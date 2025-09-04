"use client";

import Analytics from "@/components/analytics/analytics";
import { Header } from "@/components/layout/header";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import type { User } from "@supabase/supabase-js";
import { TaskService, LocalTaskService, Task } from "@/lib/database";

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p>Loading analytics...</p>
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
        <Analytics tasks={tasks} />
      </main>
    </div>
  );
}

