import Chat from "./components/Chat"
import TodoList from "./components/TodoList"
import { BrowserRouter , Routes, Route } from "react-router-dom"

const App = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<TodoList />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App