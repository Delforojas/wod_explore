import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { WodDetailPage } from './pages/WodDetailPage'
import { WodsPage } from './pages/WodsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WodsPage />} />
      <Route path="/wods" element={<WodsPage />} />
      <Route path="/wods/:id" element={<WodDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-slate-950"
        >
          Saltar al contenido principal
        </a>

        <header className="border-b border-slate-800">
          <div className="mx-auto max-w-6xl px-6 py-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-400">
              WOD Explorer
            </p>
          </div>
        </header>

        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
