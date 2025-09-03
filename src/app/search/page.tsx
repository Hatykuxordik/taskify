"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { UnifiedSearch } from "@/components/shared/unified-search";
import { Task, Note } from "@/lib/database";
import { createClient } from "@/lib/supabase-client";
import { User } from "@supabase/supabase-js";

function SearchPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const initializeAuth = async () => {
      const guestMode = localStorage.getItem("taskify_mode") === "guest";

      if (!guestMode) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [router, supabase]);

  const handleTaskSelect = (task: Task) => {
    router.push(`/dashboard?task=${task.id}`);
  };

  const handleNoteSelect = (note: Note) => {
    router.push(`/notes?note=${note.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading search...</p>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Everything</h1>
            <p className="text-muted-foreground">
              Find your tasks and notes quickly with our unified search
            </p>
          </div>

          <div className="mb-8">
            <UnifiedSearch
              user={user}
              onTaskSelect={handleTaskSelect}
              onNoteSelect={handleNoteSelect}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="font-semibold mb-2">Search Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Find tasks by title, description, category, or status
              </p>
            </div>
            
            <div className="text-center p-6 border rounded-lg">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="font-semibold mb-2">Search Notes</h3>
              <p className="text-sm text-muted-foreground">
                Find notes by title, content, or tags
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Search Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use specific keywords for better results</li>
              <li>• Search works across titles, descriptions, and content</li>
              <li>• Results are ranked by relevance</li>
              <li>• Click on any result to navigate directly to it</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}


