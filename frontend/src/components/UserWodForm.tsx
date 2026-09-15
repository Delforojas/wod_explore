import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { createUserWod, getExercises, updateUserWod } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { LoadingMessage, StateMessage } from "../components/StateMessage";
import { PaginationControls } from "../components/PaginationControls";
import type {
  Exercise,
  ExerciseCategory,
  ExercisePage,
  MeasurementType,
  UserWodCreateRequest,
  UserWodDetail,
  WodExercisePrescriptionUnit,
  WodLevel,
  WodType,
} from "../api/schemas";

const PICKER_PAGE_SIZE = 12;
const WOD_TYPE_LABELS: Record<WodType, string> = {
  FOR_TIME: "Por tiempo",
  AMRAP: "AMRAP",
  EMOM: "EMOM",
};
const WOD_LEVEL_LABELS: Record<WodLevel, string> = {
  BEGINNER: "Principiante",
  INTERMEDIATE: "Intermedio",
  RX: "RX",
};
const EXERCISE_CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  WEIGHTLIFTING: "Halterofilia",
  GYMNASTICS: "Gimnasia",
  STRONGMAN: "Strongman",
  CARDIO: "Cardio",
  OTHER: "Otros",
};
const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  WEIGHT: "Peso",
  REPS: "Repeticiones",
  TIME: "Tiempo",
  DISTANCE: "Distancia",
  WEIGHT_DISTANCE: "Peso y distancia",
  OTHER: "Otra medida",
};
const UNIT_LABELS: Record<WodExercisePrescriptionUnit, string> = {
  REPS: "repeticiones",
  METERS: "metros",
  KG: "kg",
  SECONDS: "segundos",
  OTHER: "unidad propia",
};

interface DraftPrescription {
  unit: WodExercisePrescriptionUnit;
  value: string;
  unitLabel: string;
}

interface DraftExercise {
  key: string;
  exercise: Exercise;
  prescriptions: DraftPrescription[];
}

interface UserWodFormProps {
  mode: "create" | "edit";
  initialWod?: UserWodDetail;
}

type FormErrors = Record<string, string>;

let nextDraftKey = 1;

function unitsForMeasurement(measurementType: MeasurementType): WodExercisePrescriptionUnit[] {
  switch (measurementType) {
    case "REPS": return ["REPS"];
    case "DISTANCE": return ["METERS"];
    case "WEIGHT": return ["REPS", "KG"];
    case "TIME": return ["SECONDS"];
    case "WEIGHT_DISTANCE": return ["KG", "METERS"];
    case "OTHER": return ["OTHER"];
  }
}

function createDraftExercise(exercise: Exercise): DraftExercise {
  return {
    key: `exercise-${nextDraftKey++}`,
    exercise,
    prescriptions: unitsForMeasurement(exercise.measurementType).map((unit) => ({
      unit,
      value: "",
      unitLabel: "",
    })),
  };
}

function createDraftFromDetail(exercise: UserWodDetail["exercises"][number]): DraftExercise {
  const prescriptionsByUnit = new Map(
    exercise.prescriptions.map((prescription) => [prescription.unit, prescription]),
  );

  return {
    key: `exercise-${nextDraftKey++}`,
    exercise: {
      id: exercise.exerciseId,
      name: exercise.name,
      category: exercise.category,
      measurementType: exercise.measurementType,
    },
    prescriptions: unitsForMeasurement(exercise.measurementType).map((unit) => {
      const prescription = prescriptionsByUnit.get(unit);
      return {
        unit,
        value: prescription ? String(prescription.value) : "",
        unitLabel: prescription?.unitLabel ?? "",
      };
    }),
  };
}

function isPositiveInteger(value: string) {
  const number = Number(value);
  return value.trim() !== "" && Number.isInteger(number) && number > 0;
}

function isPositiveDecimal(value: string, integerOnly: boolean) {
  if (value.trim() === "") return false;
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return false;
  if (integerOnly && !Number.isInteger(number)) return false;
  const decimals = value.split(".")[1]?.length ?? 0;
  return decimals <= 2;
}

function validateDraft(
  name: string,
  type: WodType,
  level: WodLevel,
  timeLimit: string,
  rounds: string,
  exercises: DraftExercise[],
): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim()) errors.name = "Escribe un nombre para tu WOD.";
  if (!type) errors.type = "Selecciona una estructura.";
  if (!level) errors.level = "Selecciona un nivel.";

  if ((type === "AMRAP" || type === "EMOM") && !isPositiveInteger(timeLimit)) {
    errors.timeLimit = "Indica una duración entera mayor que cero.";
  } else if (timeLimit && !isPositiveInteger(timeLimit)) {
    errors.timeLimit = "La duración debe ser un entero mayor que cero.";
  }

  if (type !== "AMRAP" && rounds && !isPositiveInteger(rounds)) {
    errors.rounds = "Las rondas deben ser un entero mayor que cero.";
  }

  if (exercises.length === 0) {
    errors.exercisePickerTrigger = "Añade al menos un ejercicio.";
  }

  exercises.forEach((draft) => {
    draft.prescriptions.forEach((prescription, index) => {
      const fieldId = `prescription-${draft.key}-${index}`;
      const integerOnly = prescription.unit === "REPS" || prescription.unit === "SECONDS";
      if (!isPositiveDecimal(prescription.value, integerOnly)) {
        errors[fieldId] = integerOnly
          ? "Usa un número entero mayor que cero."
          : "Usa un número positivo con un máximo de dos decimales.";
      }
      if (prescription.unit === "OTHER" && !prescription.unitLabel.trim()) {
        errors[`${fieldId}-unit-label`] = "Describe la unidad de esta medida.";
      }
    });
  });

  return errors;
}

function firstErrorId(errors: FormErrors) {
  return Object.keys(errors)[0];
}

function focusError(errors: FormErrors) {
  const id = firstErrorId(errors);
  if (!id) return;
  window.setTimeout(() => document.getElementById(id)?.focus(), 0);
}

function formatApiError(caughtError: unknown) {
  if (caughtError instanceof Error && "details" in caughtError) {
    const details = caughtError.details;
    if (details && typeof details === "object") {
      const detail = Object.values(details).find((value): value is string => typeof value === "string");
      if (detail) return `${caughtError.message} ${detail}`;
    }
  }
  return caughtError instanceof Error
    ? caughtError.message
    : "No se pudo guardar el WOD. Inténtalo de nuevo.";
}

export function UserWodForm({ mode, initialWod }: UserWodFormProps) {
  const { token } = useAuth();
  const pickerRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState(initialWod?.name ?? "");
  const [type, setType] = useState<WodType>(initialWod?.type ?? "FOR_TIME");
  const [level, setLevel] = useState<WodLevel>(initialWod?.level ?? "RX");
  const [timeLimit, setTimeLimit] = useState(initialWod?.timeLimit === null || initialWod?.timeLimit === undefined ? "" : String(initialWod.timeLimit));
  const [rounds, setRounds] = useState(initialWod?.rounds === null || initialWod?.rounds === undefined ? "" : String(initialWod.rounds));
  const [selectedExercises, setSelectedExercises] = useState<DraftExercise[]>(() => initialWod?.exercises.map(createDraftFromDetail) ?? []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedWod, setSavedWod] = useState<UserWodDetail | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [appliedPickerQuery, setAppliedPickerQuery] = useState("");
  const [pickerPage, setPickerPage] = useState(0);
  const [pickerResults, setPickerResults] = useState<ExercisePage | null>(null);
  const [pickerSelection, setPickerSelection] = useState<Exercise[]>([]);
  const [isPickerLoading, setIsPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [pickerReload, setPickerReload] = useState(0);

  useEffect(() => {
    const dialog = pickerRef.current;
    if (!dialog) return;
    if (isPickerOpen && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    if (!isPickerOpen && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [isPickerOpen]);

  useEffect(() => {
    if (!token || !isPickerOpen) return;
    let active = true;
    getExercises(token, { name: appliedPickerQuery }, { page: pickerPage, size: PICKER_PAGE_SIZE })
      .then((data) => { if (active) setPickerResults(data); })
      .catch((caughtError: unknown) => {
        if (active) setPickerError(caughtError instanceof Error ? caughtError.message : "No se pudieron cargar los ejercicios.");
      })
      .finally(() => { if (active) setIsPickerLoading(false); });
    return () => { active = false; };
  }, [token, isPickerOpen, appliedPickerQuery, pickerPage, pickerReload]);

  function openPicker() {
    setPickerError(null);
    setIsPickerLoading(true);
    setPickerSelection([]);
    setIsPickerOpen(true);
  }

  function closePicker() {
    const dialog = pickerRef.current;
    if (dialog?.open && typeof dialog.close === "function") dialog.close();
    else dialog?.removeAttribute("open");
    setIsPickerOpen(false);
    setPickerSelection([]);
  }

  function handlePickerSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPickerPage(0);
    setPickerError(null);
    setIsPickerLoading(true);
    setAppliedPickerQuery(pickerQuery.trim());
  }

  function changePickerPage(nextPage: number) {
    setPickerError(null);
    setIsPickerLoading(true);
    setPickerPage(nextPage);
  }

  function reloadPicker() {
    setPickerError(null);
    setIsPickerLoading(true);
    setPickerReload((current) => current + 1);
  }

  function togglePickerSelection(exercise: Exercise) {
    setPickerSelection((current) => current.some((selected) => selected.id === exercise.id)
      ? current.filter((selected) => selected.id !== exercise.id)
      : [...current, exercise]);
  }

  function addSelectedExercises() {
    if (pickerSelection.length === 0) return;
    setSelectedExercises((current) => [...current, ...pickerSelection.map(createDraftExercise)]);
    setErrors((current) => {
      const next = { ...current };
      delete next.exercisePickerTrigger;
      return next;
    });
    closePicker();
  }

  function removeExercise(key: string) {
    setSelectedExercises((current) => current.filter((draft) => draft.key !== key));
  }

  function moveExercise(index: number, offset: -1 | 1) {
    setSelectedExercises((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function updatePrescription(key: string, index: number, field: "value" | "unitLabel", value: string) {
    setSelectedExercises((current) => current.map((draft) => draft.key !== key ? draft : {
      ...draft,
      prescriptions: draft.prescriptions.map((prescription, prescriptionIndex) => (
        prescriptionIndex === index ? { ...prescription, [field]: value } : prescription
      )),
    }));
    const errorId = field === "value" ? `prescription-${key}-${index}` : `prescription-${key}-${index}-unit-label`;
    setErrors((current) => {
      const next = { ...current };
      delete next[errorId];
      return next;
    });
  }

  function resetForm() {
    setName("");
    setType("FOR_TIME");
    setLevel("RX");
    setTimeLimit("");
    setRounds("");
    setSelectedExercises([]);
    setErrors({});
    setSaveError(null);
    setSavedWod(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || isSaving) return;

    setSaveError(null);
    setSavedWod(null);
    const nextErrors = validateDraft(name, type, level, timeLimit, rounds, selectedExercises);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusError(nextErrors);
      return;
    }

    const body: UserWodCreateRequest = {
      name: name.trim(),
      type,
      level,
      timeLimit: timeLimit ? Number(timeLimit) : null,
      rounds: type === "AMRAP" || !rounds ? null : Number(rounds),
      exercises: selectedExercises.map((draft, index) => ({
        exerciseId: draft.exercise.id,
        position: index + 1,
        prescriptions: draft.prescriptions.map((prescription) => ({
          value: Number(prescription.value),
          unit: prescription.unit,
          unitLabel: prescription.unit === "OTHER" ? prescription.unitLabel.trim() : null,
        })),
      })),
    };

    setIsSaving(true);
    try {
      const saved = mode === "edit" && initialWod
        ? await updateUserWod(initialWod.id, body, token)
        : await createUserWod(body, token);
      setSavedWod(saved);
    } catch (caughtError: unknown) {
      setSaveError(formatApiError(caughtError));
    } finally {
      setIsSaving(false);
    }
  }

  if (!token) {
    return <StateMessage kind="private" title="El archivo es privado" message="Inicia sesión para diseñar y guardar tus propios WODs." action={{ label: "Entrar", href: "#/login" }} />;
  }

  return (
    <section className="create-wod-page">
      <a className="back-link" href={mode === "edit" && initialWod ? `#/my-wods/${initialWod.id}` : "#/wods"}>
        {mode === "edit" ? "Volver al detalle" : "Volver a WODs"}
      </a>
      <header className="page-heading create-wod-heading">
        <div className="page-heading__body">
          <h1>{mode === "edit" ? "Editar WOD" : "Crear WOD"}</h1>
          <p className="heading-support">{mode === "edit" ? "Ajusta la sesión sin perder el orden de sus movimientos." : "Construye una sesión que tenga sentido para tu entrenamiento."}</p>
        </div>
        <p className="heading-note">El orden y las medidas quedan guardados tal como los ves.</p>
      </header>

      <div className="create-wod-layout">
        <form className="form-panel create-wod-form" onSubmit={handleSubmit} noValidate aria-labelledby="create-wod-form-title" aria-busy={isSaving}>
          <div className="form-heading create-wod-step-heading">
            <span>{mode === "edit" ? "Edición en curso · paso 01" : "Flujo de creación · paso 01"}</span>
            <h2 id="create-wod-form-title">{mode === "edit" ? "Ajusta la sesión" : "Define la sesión"}</h2>
            <p>{mode === "edit" ? "Revisa los datos generales antes de ajustar sus movimientos." : "Empieza por los datos que definen cómo se entrena este WOD."}</p>
          </div>

          <fieldset className="create-wod-config">
            <legend>Datos generales</legend>
            <div className="create-wod-fields">
              <div className="form-field create-wod-field--wide">
                <label htmlFor="wod-name">Nombre del WOD</label>
                <input id="wod-name" name="name" type="text" maxLength={100} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "wod-name-error" : undefined} />
                {errors.name && <p className="field-error" id="wod-name-error">{errors.name}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="wod-type">Estructura</label>
                <select id="wod-type" name="type" autoComplete="off" value={type} onChange={(event) => {
                  const nextType = event.target.value;
                  if (nextType === "FOR_TIME" || nextType === "AMRAP" || nextType === "EMOM") setType(nextType);
                }} aria-invalid={Boolean(errors.type)} aria-describedby={errors.type ? "wod-type-error" : undefined}>
                  <option value="FOR_TIME">Por tiempo</option>
                  <option value="AMRAP">AMRAP</option>
                  <option value="EMOM">EMOM</option>
                </select>
                {errors.type && <p className="field-error" id="wod-type-error">{errors.type}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="wod-level">Nivel</label>
                <select id="wod-level" name="level" autoComplete="off" value={level} onChange={(event) => {
                  const nextLevel = event.target.value;
                  if (nextLevel === "BEGINNER" || nextLevel === "INTERMEDIATE" || nextLevel === "RX") setLevel(nextLevel);
                }} aria-invalid={Boolean(errors.level)} aria-describedby={errors.level ? "wod-level-error" : undefined}>
                  <option value="BEGINNER">Principiante</option>
                  <option value="INTERMEDIATE">Intermedio</option>
                  <option value="RX">RX</option>
                </select>
                {errors.level && <p className="field-error" id="wod-level-error">{errors.level}</p>}
              </div>
              {(type === "AMRAP" || type === "EMOM" || type === "FOR_TIME") && (
                <div className="form-field">
                  <label htmlFor="wod-time-limit">Time cap <span className="field-unit">segundos{type === "FOR_TIME" ? " · opcional" : " · obligatorio"}</span></label>
                  <input id="wod-time-limit" name="timeLimit" type="number" min="1" step="1" inputMode="numeric" value={timeLimit} onChange={(event) => setTimeLimit(event.target.value)} aria-invalid={Boolean(errors.timeLimit)} aria-describedby={errors.timeLimit ? "wod-time-limit-error" : undefined} required={type !== "FOR_TIME"} />
                  {errors.timeLimit && <p className="field-error" id="wod-time-limit-error">{errors.timeLimit}</p>}
                </div>
              )}
              {(type === "FOR_TIME" || type === "EMOM") && (
                <div className="form-field">
                  <label htmlFor="wod-rounds">Rondas <span className="field-unit">{type === "FOR_TIME" ? "opcional" : "opcional · intervalos"}</span></label>
                  <input id="wod-rounds" name="rounds" type="number" min="1" step="1" inputMode="numeric" value={rounds} onChange={(event) => setRounds(event.target.value)} aria-invalid={Boolean(errors.rounds)} aria-describedby={errors.rounds ? "wod-rounds-error" : undefined} />
                  {errors.rounds && <p className="field-error" id="wod-rounds-error">{errors.rounds}</p>}
                </div>
              )}
            </div>
          </fieldset>

          <section className="create-wod-exercises" aria-labelledby="selected-exercises-title">
            <div className="section-heading create-wod-section-heading">
              <div>
                <span className="create-wod-step-label">02 · Secuencia</span>
                <h2 id="selected-exercises-title">Añade los movimientos</h2>
                <p className="section-description">Construye el orden de trabajo y completa las medidas de cada ejercicio.</p>
              </div>
              <span aria-label={`${selectedExercises.length} movimientos seleccionados`}>{String(selectedExercises.length).padStart(2, "0")}</span>
            </div>
            <div className="create-wod-exercise-toolbar">
              <p>{selectedExercises.length === 0 ? "Empieza con un movimiento y añade los demás desde el mismo selector." : "Puedes sumar otro movimiento sin perder las medidas ya introducidas."}</p>
              <button className="button button--secondary add-exercise-button" id="exercisePickerTrigger" type="button" onClick={openPicker} aria-describedby={errors.exercisePickerTrigger ? "exercise-picker-error" : undefined}>
                Añadir movimientos
              </button>
            </div>
            {errors.exercisePickerTrigger && <p className="field-error" id="exercise-picker-error" tabIndex={-1}>{errors.exercisePickerTrigger}</p>}
            {selectedExercises.length === 0 ? (
              <div className="create-wod-empty">
                <strong>Aún no hay movimientos.</strong>
                <p>Abre el catálogo para elegir el primero.</p>
              </div>
            ) : (
              <ol className="selected-exercise-list" aria-label="Ejercicios añadidos">
                {selectedExercises.map((draft, index) => (
                  <li className="selected-exercise" key={draft.key}>
                    <div className="selected-exercise__header">
                      <span className="selected-exercise__position" aria-label={`Posición ${index + 1}`}>{String(index + 1).padStart(2, "0")}</span>
                      <div className="selected-exercise__identity">
                        <strong>{draft.exercise.name}</strong>
                        <span>{EXERCISE_CATEGORY_LABELS[draft.exercise.category]} · {MEASUREMENT_LABELS[draft.exercise.measurementType]}</span>
                      </div>
                      <div className="selected-exercise__actions" aria-label={`Acciones para ${draft.exercise.name}`}>
                        <button className="action-button" type="button" onClick={() => moveExercise(index, -1)} disabled={index === 0} aria-label={`Subir ${draft.exercise.name}`}>Subir</button>
                        <button className="action-button" type="button" onClick={() => moveExercise(index, 1)} disabled={index === selectedExercises.length - 1} aria-label={`Bajar ${draft.exercise.name}`}>Bajar</button>
                        <button className="remove-button" type="button" onClick={() => removeExercise(draft.key)} aria-label={`Eliminar ${draft.exercise.name}`}>Eliminar</button>
                      </div>
                    </div>
                    <div className="prescription-fields">
                      {draft.prescriptions.map((prescription, prescriptionIndex) => {
                        const fieldId = `prescription-${draft.key}-${prescriptionIndex}`;
                        const errorId = `${fieldId}-error`;
                        const unitLabelErrorId = `${fieldId}-unit-label-error`;
                        const fieldError = errors[fieldId];
                        const unitLabelError = errors[`${fieldId}-unit-label`];
                        const integerOnly = prescription.unit === "REPS" || prescription.unit === "SECONDS";
                        return (
                          <div className="prescription-field" key={prescription.unit}>
                            <label htmlFor={fieldId}>{UNIT_LABELS[prescription.unit]}</label>
                            <div className="prescription-input-wrap">
                              <input id={fieldId} name={`prescription-${draft.key}-${prescription.unit}`} autoComplete="off" type="number" min="0.01" step={integerOnly ? "1" : "0.01"} inputMode={integerOnly ? "numeric" : "decimal"} value={prescription.value} onChange={(event) => updatePrescription(draft.key, prescriptionIndex, "value", event.target.value)} aria-invalid={Boolean(fieldError)} aria-describedby={[fieldError ? errorId : "", prescription.unit === "OTHER" && unitLabelError ? unitLabelErrorId : ""].filter(Boolean).join(" ") || undefined} />
                              <span aria-hidden="true">{prescription.unit === "OTHER" ? "otra" : prescription.unit.toLowerCase()}</span>
                            </div>
                            {fieldError && <p className="field-error" id={errorId}>{fieldError}</p>}
                            {prescription.unit === "OTHER" && (
                              <>
                                <label className="visually-related-label" htmlFor={`${fieldId}-unit-label`}>Nombre de la unidad</label>
                                <input id={`${fieldId}-unit-label`} name={`prescription-${draft.key}-${prescription.unit}-label`} autoComplete="off" type="text" maxLength={100} placeholder="Ej. calorías" value={prescription.unitLabel} onChange={(event) => updatePrescription(draft.key, prescriptionIndex, "unitLabel", event.target.value)} aria-invalid={Boolean(unitLabelError)} aria-describedby={unitLabelError ? unitLabelErrorId : undefined} />
                                {unitLabelError && <p className="field-error" id={unitLabelErrorId}>{unitLabelError}</p>}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ol>
            )}
            {selectedExercises.length > 0 && (
              <button className="button button--secondary add-exercise-button add-exercise-button--repeat" type="button" onClick={openPicker}>
                Añadir otro movimiento
              </button>
            )}
          </section>

          {isSaving && <StateMessage kind="loading" title="Guardando WOD" message="Estamos archivando tu diseño." />}
          {saveError && <StateMessage kind="error" title="No se pudo guardar" message={saveError} />}
          {savedWod && <StateMessage
            kind="success"
            title={mode === "edit" ? "WOD actualizado" : "WOD guardado"}
            message={mode === "edit" ? `“${savedWod.name}” ya tiene tu nueva configuración.` : `“${savedWod.name}” ya forma parte de tus WODs. Identificador ${savedWod.id}.`}
            action={mode === "edit"
              ? { label: "Ver WOD actualizado", href: `#/my-wods/${savedWod.id}` }
              : { label: "Crear otro WOD", onClick: resetForm }}
          />}
          <div className="create-wod-save-step">
            <div>
              <span className="create-wod-step-label">03 · Revisión</span>
              <h2>Guarda tu sesión</h2>
              <p>{selectedExercises.length === 0 ? "Añade al menos un movimiento para poder guardar." : "Comprueba la secuencia y guarda cuando la sesión esté lista."}</p>
            </div>
            <button className="button button--accent create-wod-submit" type="submit" disabled={isSaving}>{isSaving ? "Guardando…" : mode === "edit" ? "Guardar cambios" : "Guardar WOD"}</button>
          </div>
        </form>

        <aside className="create-wod-aside" aria-label="Revisión del diseño">
          <div className="create-wod-aside__header">
            <div>
              <p className="create-wod-aside__label">Revisión</p>
              <h2>Tu sesión</h2>
            </div>
            <strong className="create-wod-aside__count metric-value">{String(selectedExercises.length).padStart(2, "0")}</strong>
          </div>
          <p className="create-wod-aside__count-label">{selectedExercises.length === 1 ? "movimiento seleccionado" : "movimientos seleccionados"}</p>
          <div className={`create-wod-review-status ${selectedExercises.length > 0 ? "create-wod-review-status--ready" : ""}`} aria-live="polite">
            <span className="create-wod-review-status__marker" aria-hidden="true" />
            <div>
              <strong>{selectedExercises.length > 0 ? "Secuencia en curso" : "Falta la secuencia"}</strong>
              <p>{selectedExercises.length > 0 ? "Las medidas aparecerán en el orden que guardes." : "Añade un movimiento para empezar a configurar la sesión."}</p>
            </div>
          </div>
          <dl className="create-wod-summary">
            <div><dt>Estructura</dt><dd>{WOD_TYPE_LABELS[type]}</dd></div>
            <div><dt>Nivel</dt><dd>{WOD_LEVEL_LABELS[level]}</dd></div>
            <div><dt>Tiempo</dt><dd>{timeLimit ? `${timeLimit} s` : "Sin límite"}</dd></div>
            <div><dt>Rondas</dt><dd>{type === "AMRAP" ? "No aplica" : rounds || "Variables"}</dd></div>
          </dl>
          <p className="create-wod-aside__note">La secuencia visible se enviará como el orden oficial de tu WOD.</p>
        </aside>
      </div>

      <dialog ref={pickerRef} className="exercise-picker" aria-labelledby="exercise-picker-title" onCancel={(event) => { event.preventDefault(); closePicker(); }} onClose={() => setIsPickerOpen(false)}>
        <div className="exercise-picker__header">
          <div>
            <p className="create-wod-aside__label">Catálogo</p>
            <h2 id="exercise-picker-title">Elige un movimiento</h2>
          </div>
          <button className="action-button exercise-picker__close" type="button" onClick={closePicker}>Cerrar</button>
        </div>
        <form className="exercise-picker__search" onSubmit={handlePickerSearch}>
          <label htmlFor="exercise-picker-search">Buscar ejercicios</label>
          <div>
            <input id="exercise-picker-search" name="exerciseSearch" type="search" value={pickerQuery} onChange={(event) => setPickerQuery(event.target.value)} placeholder="Ej. Back Squat" autoComplete="off" autoFocus />
            <button className="button button--accent" type="submit">Buscar</button>
          </div>
        </form>
        {isPickerLoading && <LoadingMessage message="Estamos consultando el catálogo." />}
        {!isPickerLoading && pickerError && <StateMessage kind="error" title="No se pudo cargar el catálogo" message={pickerError} action={{ label: "Reintentar", onClick: reloadPicker }} />}
        {!isPickerLoading && !pickerError && pickerResults?.items.length === 0 && <StateMessage kind="empty" title="No hay coincidencias" message="Prueba con otro nombre de ejercicio." />}
        {!isPickerLoading && !pickerError && pickerResults && pickerResults.items.length > 0 && (
          <ul className="exercise-picker__results">
            {pickerResults.items.map((exercise) => (
              <li key={exercise.id}>
                <div><strong>{exercise.name}</strong><span>{EXERCISE_CATEGORY_LABELS[exercise.category]} · {MEASUREMENT_LABELS[exercise.measurementType]}</span></div>
                <button
                  className="button button--secondary"
                  type="button"
                  aria-pressed={pickerSelection.some((selected) => selected.id === exercise.id)}
                  aria-label={`${pickerSelection.some((selected) => selected.id === exercise.id) ? "Quitar" : "Seleccionar"} ${exercise.name}`}
                  onClick={() => togglePickerSelection(exercise)}
                >
                  {pickerSelection.some((selected) => selected.id === exercise.id) ? "Seleccionado" : "Seleccionar"}
                </button>
              </li>
            ))}
          </ul>
        )}
        {!isPickerLoading && !pickerError && pickerResults && (
          <PaginationControls page={pickerPage} hasNext={pickerResults.hasNext} totalPages={pickerResults.totalPages} isLoading={isPickerLoading} onPrevious={() => changePickerPage(Math.max(0, pickerPage - 1))} onNext={() => changePickerPage(pickerPage + 1)} />
        )}
        <div className="exercise-picker__footer">
          <span className="exercise-picker__selection-status" aria-live="polite">
            {pickerSelection.length === 0 ? "Ningún movimiento seleccionado" : `${pickerSelection.length} movimiento${pickerSelection.length === 1 ? "" : "s"} seleccionado${pickerSelection.length === 1 ? "" : "s"}`}
          </span>
          <div className="exercise-picker__footer-actions">
            <button className="button button--quiet" type="button" onClick={closePicker}>Cerrar</button>
            <button className="button button--accent" type="button" onClick={addSelectedExercises} disabled={pickerSelection.length === 0}>Añadir seleccionados</button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
