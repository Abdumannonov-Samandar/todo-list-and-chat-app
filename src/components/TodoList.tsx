import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, removeTodo, updateTodo, Todo } from '../redux/reducer'
import { RootState, AppDispatch } from '../redux/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from "@/components/ui/progress"
import { CheckIcon, Trash2Icon } from 'lucide-react'
import {Link} from 'react-router-dom'

// Define the form schema using zod
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
})

interface TodoTableProps {
  todos: Todo[]
  handleToggleTodo: (todo: Todo) => void
  handleRemoveTodo: (id: number) => void
}

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos.todos)
  const dispatch: AppDispatch = useDispatch()

  const [selectedTab, setSelectedTab] = useState<'all' | 'uncompleted' | 'completed'>('all')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })

  // Load the selected tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem('selectedTab')
    if (savedTab) {
      setSelectedTab(savedTab as 'all' | 'uncompleted' | 'completed')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('selectedTab', selectedTab)
  }, [selectedTab])

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const getFilteredTodos = (filter: 'all' | 'uncompleted' | 'completed') => {
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed)
      case 'uncompleted':
        return todos.filter(todo => !todo.completed)
      default:
        return todos
    }
  }

  const handleAddTodo = (data: { username: string }) => {
    const newTodo: Todo = { id: Date.now(), text: data.username, completed: false }
    dispatch(addTodo(newTodo))
    form.reset()
  }

  const handleRemoveTodo = (id: number) => {
    dispatch(removeTodo(id))
  }

  const handleToggleTodo = (todo: Todo) => {
    dispatch(updateTodo({ ...todo, completed: !todo.completed }))
  }

  return (
    <main>
      <section className="pt-10 bg-zinc-400 h-screen">
        <div className='container'>
          <div className="flex flex-col items-center gap-5">
            <Link to="/chat" target="_blank" className="text-zinc-200 hover:text-blue-700 font-bold">Chat App</Link>
            <h2 className='text-3xl font-extrabold text-white'>Todo List</h2>

            {/* Progress bar */}
            <div className="w-1/2">
              <Progress value={progressPercentage} className={`${progressPercentage < 50 ? 'bg-green-200' : 'bg-green-500'} ${progressPercentage === 100 ? 'bg-yellow-500' : ''}`} max={100} />
              <p className="text-center">
                {completedCount} / {totalCount} completed
              </p>
            </div>

            <form onSubmit={form.handleSubmit(handleAddTodo)} className='w-1/2 relative'>
              <Input
                className='border-black h-12'
                {...form.register("username")}
                type="text"
                placeholder="Add new todo"
              />
              {form.formState.errors.username && (
                <p className="text-red-500">{form.formState.errors.username.message}</p>
              )}
              <Button type="submit" className='absolute top-1 right-1'>
                Add
              </Button>
            </form>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="flex justify-center my-4">
                <TabsTrigger value="all" onClick={() => setSelectedTab('all')}>All</TabsTrigger>
                <TabsTrigger value="uncompleted" onClick={() => setSelectedTab('uncompleted')}>Uncompleted</TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setSelectedTab('completed')}>Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <TodoTable todos={getFilteredTodos('all')} handleToggleTodo={handleToggleTodo} handleRemoveTodo={handleRemoveTodo} />
              </TabsContent>
              <TabsContent value="uncompleted">
                <TodoTable todos={getFilteredTodos('uncompleted')} handleToggleTodo={handleToggleTodo} handleRemoveTodo={handleRemoveTodo} />
              </TabsContent>
              <TabsContent value="completed">
                <TodoTable todos={getFilteredTodos('completed')} handleToggleTodo={handleToggleTodo} handleRemoveTodo={handleRemoveTodo} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  )
}



const TodoTable: React.FC<TodoTableProps> = ({ todos, handleToggleTodo, handleRemoveTodo }) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Todo</th>
          <th className="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {todos.map((todo: Todo) => (
          <tr key={todo.id} className="border-t">
            <td className="px-4 py-2 text-center">
              <Checkbox checked={todo.completed} onChange={() => handleToggleTodo(todo)} className='w-4 h-4' />
            </td>
            <td className="px-4 py-2">{todo.text}</td>
            <td className="px-4 py-2 flex gap-2 justify-center">
              <Button variant={'destructive'} onClick={() => handleRemoveTodo(todo.id)}><Trash2Icon className='w-4 h-4 text-white' /></Button>
              <Button className='border-green-700 border bg-green-300' variant={'ghost'} onClick={() => handleToggleTodo(todo)}><CheckIcon className='w-4 h-4 text-green-700' /></Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TodoList
