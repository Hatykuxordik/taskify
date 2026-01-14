"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import toast from "react-hot-toast";

export default function GuestPage() {
  const router = useRouter();

  useEffect(() => {
    // Set guest mode in localStorage and cookie (for middleware)
    localStorage.setItem("taskify_mode", "guest");
    // 1 year, path=/ so middleware can read it on all routes, Lax for safety
    document.cookie = "taskify_mode=guest; path=/; max-age=31536000; samesite=lax";
    toast.success("Welcome! You're using Taskify in guest mode.");
  }, []);

  const continueAsGuest = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl shadow-lg p-8 text-center">
          <Image
            src="/images/taskify.png"
            alt="Taskify Logo"
            width={80}
            height={80}
            className="mx-auto mb-6 rounded-lg"
          />

          <h1 className="text-2xl font-bold mb-4">Guest Mode</h1>

          <div className="space-y-4 text-left mb-6">
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-secondary-foreground mb-2">
                What you can do:
              </h3>
              <ul className="text-sm text-secondary-foreground space-y-1">
                <li>• Create and manage tasks</li>
                <li>• Use all core features</li>
                <li>• Data saved locally</li>
              </ul>
            </div>

            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-secondary-foreground mb-2">
                Limitations:
              </h3>
              <ul className="text-sm text-secondary-foreground space-y-1">
                <li>• No cloud sync</li>
                <li>• No collaboration features</li>
                <li>• Data lost if browser data is cleared</li>
              </ul>
            </div>
          </div>

          <Button onClick={continueAsGuest} className="w-full mb-4">
            Continue to Dashboard
          </Button>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Want full features?{" "}
            <a href="/signup" className="text-primary hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
