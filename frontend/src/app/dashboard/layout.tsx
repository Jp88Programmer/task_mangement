import { Metadata } from "next"
import { Inter } from "next/font/google"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { ProtectedRoute } from "@/components/protected-route"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Dashboard - TaskFlow",
  description: "Manage your tasks and projects",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <ProtectedRoute>
      <div className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </div>
    </ProtectedRoute>
  )
}
