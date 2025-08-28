"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { User } from "@supabase/supabase-js";

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  const [isGuestMode, setIsGuestMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsGuestMode(localStorage.getItem("taskify_mode") === "guest");
    }
  }, []);

  const handleSignOut = async () => {
    if (isGuestMode) {
      localStorage.removeItem("taskify_mode");
      localStorage.removeItem("taskify_tasks");
      toast.success("Signed out from guest mode");
      router.push("/");
    } else {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
      } else {
        toast.success("Signed out successfully");
        router.push("/");
      }
    }
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");

    if (isDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors ${
      isActive
        ? "text-[#fb649f] border-b-2 !border-[#fb649f]"
        : "hover:text-[#fb649f]"
    }`;
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/images/taskify.png"
              alt="Taskify"
              width={32}
              height={32}
              className="h-8 w-auto md:mr-16"
              loading="eager"
              priority
              placeholder="empty"
              unoptimized={true}
            />
            {/* <span className="font-bold text-xl">Taskify</span> */}
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className={getLinkClass("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/notes" className={getLinkClass("/notes")}>
              Notes
            </Link>
            <Link href="/search" className={getLinkClass("/search")}>
              Search
            </Link>
            <Link href="/analytics" className={getLinkClass("/analytics")}>
              Analytics
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            <span className="sr-only">Toggle theme</span>
            🌙
          </Button>

          <div className="flex items-center space-x-2">
            {user || isGuestMode ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {isGuestMode ? "Guest User" : user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
