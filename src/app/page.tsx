import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/taskify.png"
              alt="Taskify Logo"
              width={120}
              height={120}
              className="rounded-lg shadow-lg"
            />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Welcome to Taskify
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            An advanced todo list manager with real-time sync, analytics, and
            modern features to boost your productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="bg-card p-8 rounded-xl shadow-lg card-hover">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Get Started
              </h2>
              <div className="space-y-4">
                <Link href="/signup" className="block">
                  <Button className="w-full h-12 text-lg cursor-pointer hover:shadow-lg transition-all duration-200">
                    Sign Up
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full h-12 text-lg cursor-pointer hover:shadow-lg transition-all duration-200">
                    Sign In
                  </Button>
                </Link>
                <Link href="/guest" className="block">
                  <Button
                    variant="secondary"
                    className="w-full h-12 text-lg cursor-pointer hover:shadow-lg transition-all duration-200"
                  >
                    Continue as Guest
                  </Button>
                </Link>
              </div>
            </div>

            <div className="text-center animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-card p-4 rounded-lg card-hover">
                  <div className="font-medium">Task Management</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Create, edit, and organize
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg card-hover">
                  <div className="font-medium">Real-time Sync</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Access anywhere
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg card-hover">
                  <div className="font-medium">Analytics</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Track productivity
                  </div>
                </div>
                <div className="bg-card p-4 rounded-lg card-hover">
                  <div className="font-medium">Collaboration</div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Share with team
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/get-started.svg"
              alt="Get Started Illustration"
              width={400}
              height={400}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
