import { useEffect, useState } from "react";

import { getExercises } from "./api/exercisesApi";

import type { Exercise } from "./types/exercise";

function App() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    getExercises().then(setExercises);
  }, []);

  return (
    <main>
      <h1>Ejercicios</h1>

      {exercises.map((exercise) => (
        <div key={exercise.id}>
          <h2>{exercise.name}</h2>

          <p>{exercise.category}</p>

          <p>{exercise.measurementType}</p>
        </div>
      ))}
    </main>
  );
}

export default App;
