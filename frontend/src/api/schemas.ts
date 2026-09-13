import { z } from "zod";

export const wodTypeSchema = z.enum(["FOR_TIME", "AMRAP", "EMOM"]);
export const wodLevelSchema = z.enum(["BEGINNER", "INTERMEDIATE", "RX"]);
export const measurementTypeSchema = z.enum([
  "WEIGHT",
  "REPS",
  "TIME",
  "DISTANCE",
  "WEIGHT_DISTANCE",
  "OTHER",
]);
export const exerciseCategorySchema = z.enum([
  "WEIGHTLIFTING",
  "GYMNASTICS",
  "STRONGMAN",
  "CARDIO",
  "OTHER",
]);
export const exerciseResultUnitSchema = z.enum(["KG", "REPS", "SECONDS", "METERS"]);
export const exerciseRecordTypeSchema = z.enum([
  "1RM",
  "3RM",
  "5RM",
  "10RM",
  "MAX_REPS",
  "BEST_TIME",
]);

const dateTimeSchema = z.string().min(1);

export const loginResponseSchema = z.object({
  token: z.string().min(1),
});

export const userSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  createdAt: dateTimeSchema,
});

export const exerciseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: exerciseCategorySchema,
  measurementType: measurementTypeSchema,
});

export const wodSummarySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  type: wodTypeSchema,
  timeLimit: z.number().int().nullable(),
  rounds: z.number().int().nullable(),
  level: wodLevelSchema.nullable(),
});

export const wodExerciseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  category: exerciseCategorySchema,
  measurementType: measurementTypeSchema,
  reps: z.number().int().nullable(),
  position: z.number().int().nullable(),
});

export const wodDetailSchema = wodSummarySchema.extend({
  createdAt: dateTimeSchema,
  exercises: z.array(wodExerciseSchema),
});

export const wodResultSchema = z.object({
  id: z.number().int(),
  wodId: z.number().int(),
  timeSeconds: z.number().int().nullable(),
  rounds: z.number().int().nullable(),
  reps: z.number().int().nullable(),
  level: wodLevelSchema,
  completedAt: dateTimeSchema,
});

export const exerciseResultSchema = z.object({
  id: z.number().int(),
  exerciseId: z.number().int(),
  value: z.number(),
  unit: exerciseResultUnitSchema,
  recordType: exerciseRecordTypeSchema,
  performedAt: dateTimeSchema,
});

export const historySchema = z.object({
  wodResults: z.array(wodResultSchema),
  exerciseResults: z.array(exerciseResultSchema),
});

export const wodPersonalRecordSchema = z.object({
  resultId: z.number().int(),
  wodId: z.number().int(),
  wodName: z.string(),
  wodType: wodTypeSchema,
  level: wodLevelSchema,
  timeSeconds: z.number().int().nullable(),
  rounds: z.number().int().nullable(),
  reps: z.number().int().nullable(),
  completedAt: dateTimeSchema,
});

export const exercisePersonalRecordSchema = z.object({
  resultId: z.number().int(),
  exerciseId: z.number().int(),
  exerciseName: z.string(),
  measurementType: measurementTypeSchema,
  recordType: exerciseRecordTypeSchema,
  value: z.number(),
  unit: exerciseResultUnitSchema,
  performedAt: dateTimeSchema,
});

export const statisticsSchema = z.object({
  wodResultsCount: z.number().int().nonnegative(),
  exerciseResultsCount: z.number().int().nonnegative(),
  wodPersonalRecords: z.array(wodPersonalRecordSchema),
  exercisePersonalRecords: z.array(exercisePersonalRecordSchema),
});

export const wodEvolutionPointSchema = wodPersonalRecordSchema;
export const exerciseEvolutionPointSchema = exercisePersonalRecordSchema;

export const evolutionSchema = z.object({
  wodResults: z.array(wodEvolutionPointSchema),
  exerciseResults: z.array(exerciseEvolutionPointSchema),
});

export const apiErrorSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
  status: z.number().optional(),
  details: z.record(z.string(), z.string()).optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type WodType = z.infer<typeof wodTypeSchema>;
export type WodLevel = z.infer<typeof wodLevelSchema>;
export type MeasurementType = z.infer<typeof measurementTypeSchema>;
export type ExerciseCategory = z.infer<typeof exerciseCategorySchema>;
export type ExerciseResultUnit = z.infer<typeof exerciseResultUnitSchema>;
export type ExerciseRecordType = z.infer<typeof exerciseRecordTypeSchema>;
export type User = z.infer<typeof userSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type WodSummary = z.infer<typeof wodSummarySchema>;
export type WodExercise = z.infer<typeof wodExerciseSchema>;
export type WodDetail = z.infer<typeof wodDetailSchema>;
export type WodResult = z.infer<typeof wodResultSchema>;
export type ExerciseResult = z.infer<typeof exerciseResultSchema>;
export type UserHistory = z.infer<typeof historySchema>;
export type WodPersonalRecord = z.infer<typeof wodPersonalRecordSchema>;
export type ExercisePersonalRecord = z.infer<typeof exercisePersonalRecordSchema>;
export type UserStatistics = z.infer<typeof statisticsSchema>;
export type UserEvolution = z.infer<typeof evolutionSchema>;

export interface RegisterRequest {
  name: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface WodResultRequest {
  timeSeconds?: number;
  rounds?: number;
  reps?: number;
  level: z.infer<typeof wodLevelSchema>;
  completedAt?: string;
}

export interface ExerciseResultRequest {
  value: number;
  unit: z.infer<typeof exerciseResultUnitSchema>;
  recordType: z.infer<typeof exerciseRecordTypeSchema>;
  performedAt?: string;
}
