export type Route =
  | { page: "home" }
  | { page: "login" }
  | { page: "register" }
  | { page: "wods" }
  | { page: "wod-detail"; id: number }
  | { page: "exercises" }
  | { page: "exercise-detail"; id: number }
  | { page: "history" }
  | { page: "profile" }
  | { page: "statistics" };

export function parseRoute(hash: string): Route {
  const path = hash.replace(/^#/, "").replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);

  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "login") return { page: "login" };
  if (parts[0] === "register") return { page: "register" };
  if (parts[0] === "wods" && parts.length === 1) return { page: "wods" };
  if (parts[0] === "wods" && parts[1] && Number.isInteger(Number(parts[1]))) {
    return { page: "wod-detail", id: Number(parts[1]) };
  }
  if (parts[0] === "exercises" && parts.length === 1) return { page: "exercises" };
  if (parts[0] === "exercises" && parts[1] && Number.isInteger(Number(parts[1]))) {
    return { page: "exercise-detail", id: Number(parts[1]) };
  }
  if (parts[0] === "history") return { page: "history" };
  if (parts[0] === "profile") return { page: "profile" };
  if (parts[0] === "statistics") return { page: "statistics" };
  return { page: "home" };
}

export function navigate(path: string) {
  window.location.hash = path;
}
