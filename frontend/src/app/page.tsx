"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="container flex items-center justify-between py-6">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            TaskFlow
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="container flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Manage your tasks
          <span className="block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            with ease and style
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          TaskFlow helps teams organize their work in one place. Collaborate, manage projects, and reach new productivity peaks.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">
              Get Started for Free
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#features">
              Learn more
            </Link>
          </Button>
        </div>
      </main>

      <section id="features" className="py-20 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Intuitive Kanban Board",
                description: "Organize tasks with a simple drag-and-drop interface."
              },
              {
                title: "Role-Based Access",
                description: "Control access with admin, manager, and member roles."
              },
              {
                title: "Real-time Updates",
                description: "See changes instantly across all devices."
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-background rounded-lg shadow-sm border">
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-10 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">TaskFlow</span>
            <span className="text-sm text-muted-foreground">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/privacy">Privacy</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/terms">Terms</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}
