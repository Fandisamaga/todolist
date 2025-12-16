"use client"

import { TodoList } from "@/components/todo-list"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <TodoList />
    </main>
  )
}
