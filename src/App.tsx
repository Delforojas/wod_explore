import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { useFavorites } from './hooks/useFavorites'
import { loadWods } from './lib/loadWods'
import { ExercisesPage } from './pages/ExercisesPage'
import { WodDetailPage } from './pages/WodDetailPage'
import { WodsPage } from './pages/WodsPage'
import type { Wod } from './types/wod'

const EMPTY_WODS: Wod[] = []

export function AppRoutes() {
  const result = loadWods()
  const availableWods = result.success ? result.data : EMPTY_WODS
  const favorites = useFavorites(availableWods)

  return (
    <Routes>
      <Route path="/" element={<WodsPage favorites={favorites} />} />
      <Route path="/wods" element={<WodsPage favorites={favorites} />} />
      <Route path="/wods/:id" element={<WodDetailPage favorites={favorites} />} />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-10 focus-visible:rounded-md focus-visible:bg-white focus-visible:px-4 focus-visible:py-2 focus-visible:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Saltar al contenido principal
        </a>

        <Header />

        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
