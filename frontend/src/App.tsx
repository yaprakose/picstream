import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Index from './pages/Index'

function App() {
  return (
    <div className="overflow-x-hidden w-full max-w-full">
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
