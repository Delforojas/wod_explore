import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { useFavorites } from './hooks/useFavorites'
import { useWorkoutHistory } from './hooks/useWorkoutHistory'
import { loadWods } from './lib/loadWods'
import { ExercisesPage } from './pages/ExercisesPage'
import { HistoryPage } from './pages/HistoryPage'
import { HomePage } from './pages/HomePage'
import { WodDetailPage } from './pages/WodDetailPage'
import { WodsPage } from './pages/WodsPage'
import type { Wod } from './types/wod'

const EMPTY_WODS: Wod[] = []

export function AppRoutes() {
  const result = loadWods()
  const availableWods = result.success ? result.data : EMPTY_WODS
  const favorites = useFavorites(availableWods)
  const workoutHistory = useWorkoutHistory()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wods" element={<WodsPage favorites={favorites} />} />
      <Route
        path="/wods/:id"
        element={<WodDetailPage favorites={favorites} workoutHistory={workoutHistory} />}
      />
      <Route path="/exercises" element={<ExercisesPage />} />
      <Route
        path="/history"
        element={<HistoryPage workoutHistory={workoutHistory} wods={availableWods} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-10 focus-visible:rounded-control focus-visible:bg-board-text focus-visible:px-4 focus-visible:py-2 focus-visible:text-ink-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-board-accent focus-visible:ring-2 focus-visible:ring-board-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
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
