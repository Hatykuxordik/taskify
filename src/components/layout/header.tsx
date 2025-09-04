"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import toast from "react-hot-toast";
import { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition-colors ${
      isActive
        ? "text-primary border-b-2 !border-primary"
        : "hover:text-primary"
    }`;
  };

  return (
    <>
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

            <div className="hidden md:flex items-center space-x-2">
              {user || isGuestMode ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {isGuestMode
                      ? "Guest User"
                      : user?.user_metadata?.full_name || user?.email}
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

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden h-9 w-9"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/dashboard"
                className={`${getLinkClass("/dashboard")} block py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/notes"
                className={`${getLinkClass("/notes")} block py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Notes
              </Link>
              <Link
                href="/search"
                className={`${getLinkClass("/search")} block py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Search
              </Link>
              <Link
                href="/analytics"
                className={`${getLinkClass("/analytics")} block py-2`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Analytics
              </Link>
            </nav>

            <div className="pt-4 border-t">
              {user || isGuestMode ? (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    {isGuestMode
                      ? "Guest User"
                      : user?.user_metadata?.full_name || user?.email}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
