export type ExerciseCategory =
  | "WEIGHTLIFTING"
  | "GYMNASTICS"
  | "STRONGMAN"
  | "CARDIO"
  | "OTHER";

export type MeasurementType =
  | "WEIGHT"
  | "REPS"
  | "TIME"
  | "DISTANCE"
  | "WEIGHT_DISTANCE"
  | "OTHER";

export interface Exercise {
  id: number;

  name: string;

  category: ExerciseCategory;

  measurementType: MeasurementType;
}
