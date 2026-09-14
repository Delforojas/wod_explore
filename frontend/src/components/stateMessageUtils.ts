import type { StateMessageKind } from "./StateMessage";

export function getErrorStateKind(error: unknown): Extract<StateMessageKind, "error" | "network-error"> {
  if (typeof error === "object" && error !== null && "status" in error && error.status === 0) {
    return "network-error";
  }

  return "error";
}
