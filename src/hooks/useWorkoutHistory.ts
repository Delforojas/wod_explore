import { useEffect, useRef, useState } from 'react'
import {
  createWorkoutHistoryEntry,
  deleteWorkoutEntry,
  sortWorkoutHistory,
} from '../lib/workoutHistory'
import {
  loadWorkoutHistory,
  saveWorkoutHistory,
} from '../lib/workoutHistoryStorage'
import type {
  CreateWorkoutHistoryEntryInput,
  WorkoutHistory,
  WorkoutHistoryEntry,
} from '../types/workoutHistory'

export interface UseWorkoutHistoryResult {
  entries: readonly WorkoutHistoryEntry[]
  addWorkout: (input: CreateWorkoutHistoryEntryInput) => WorkoutHistoryEntry
  deleteWorkout: (entryId: string) => void
}

export function useWorkoutHistory(): UseWorkoutHistoryResult {
  const [entries, setEntries] = useState<WorkoutHistory>(() =>
    loadWorkoutHistory(),
  )
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    saveWorkoutHistory(entries)
  }, [entries])

  function addWorkout(
    input: CreateWorkoutHistoryEntryInput,
  ): WorkoutHistoryEntry {
    const entry = createWorkoutHistoryEntry(input)
    setEntries((currentEntries) => [...currentEntries, entry])

    return entry
  }

  function deleteWorkout(entryId: string): void {
    setEntries((currentEntries) =>
      deleteWorkoutEntry(currentEntries, entryId),
    )
  }

  return {
    entries: sortWorkoutHistory(entries),
    addWorkout,
    deleteWorkout,
  }
}
