"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  X,
  Check,
} from "lucide-react"

/* ========= SIMPLE UI COMPONENTS ========= */
const Button = ({ className = "", ...props }: any) => (
  <button
    {...props}
    className={`rounded-lg px-3 py-2 text-sm font-medium transition
      bg-black text-white hover:bg-gray-800
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}`}
  />
)

const Input = ({ className = "", ...props }: any) => (
  <input
    {...props}
    className={`rounded-lg border px-3 py-2 text-sm outline-none
      focus:ring-2 focus:ring-black
      ${className}`}
  />
)

const Card = ({ className = "", ...props }: any) => (
  <div
    {...props}
    className={`rounded-xl border bg-white ${className}`}
  />
)

/* ========= TYPES ========= */
interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

/* ========= MAIN COMPONENT ========= */
export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [mounted, setMounted] = useState(false)

  /* Load dari localStorage */
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("todos")
    if (saved) setTodos(JSON.parse(saved))
  }, [])

  /* Simpan ke localStorage */
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("todos", JSON.stringify(todos))
    }
  }, [todos, mounted])

  /* CRUD FUNCTIONS */
  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos([
      {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: Date.now(),
      },
      ...todos,
    ])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      setTodos(todos.map(t =>
        t.id === id ? { ...t, text: editText.trim() } : t
      ))
    }
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  /* FILTER & SORT */
  const filteredTodos = todos
    .filter(t =>
      filter === "all"
        ? true
        : filter === "active"
        ? !t.completed
        : t.completed
    )
    .sort((a, b) => b.createdAt - a.createdAt)

  if (!mounted) return null

  /* ========= UI ========= */
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-1">Todo List</h1>
        <p className="text-gray-500">Kelola tugas harian dengan rapi</p>
      </div>

      {/* Input */}
      <Card className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addTodo()
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Tambah tugas..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </Card>

      {/* Filter */}
      <div className="flex gap-2">
        {["all", "active", "completed"].map((f) => (
          <Button
            key={f}
            onClick={() => setFilter(f as any)}
            className={filter === f ? "" : "bg-gray-200 text-black"}
          >
            {f.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <Card className="p-10 text-center text-gray-500">
          <Circle className="mx-auto mb-3 opacity-30" />
          <p>✨ Belum ada tugas</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <Card key={todo.id} className="p-4 hover:shadow transition">
              {editingId === todo.id ? (
                <div className="flex gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button onClick={() => saveEdit(todo.id)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    className="bg-gray-300 text-black"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleTodo(todo.id)}>
                    {todo.completed ? (
                      <CheckCircle2 className="text-green-600" />
                    ) : (
                      <Circle className="text-gray-400" />
                    )}
                  </button>

                  <p
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : ""
                    }`}
                  >
                    {todo.text}
                  </p>

                  <Button
                    onClick={() => startEdit(todo)}
                    className="bg-gray-200 text-black"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => deleteTodo(todo.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
