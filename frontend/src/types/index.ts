export type UserRole = 'admin' | 'manager' | 'member'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
  updatedAt?: string
}

export interface Project {
  id: string
  name: string
  description?: string
  ownerId: string
  members: string[]
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  projectId: string
  assigneeId?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: string
  action: string
  taskId: string
  userId: string
  oldValues: Record<string, any>
  newValues: Record<string, any>
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}
