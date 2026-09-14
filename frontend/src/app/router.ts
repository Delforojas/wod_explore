export type Route =
  | { page: "home" }
  | { page: "login" }
  | { page: "register" }
  | { page: "wods" }
  | { page: "create-wod" }
  | { page: "my-wods"; feedback?: "deleted" }
  | { page: "my-wod-detail"; id: number }
  | { page: "my-wod-edit"; id: number }
  | { page: "wod-detail"; id: number }
  | { page: "exercises" }
  | { page: "exercise-detail"; id: number }
  | { page: "history" }
  | { page: "profile" }
  | { page: "statistics" };

export function parseRoute(hash: string): Route {
  const [rawPath, query = ""] = (hash.replace(/^#/, "") || "/").split("?", 2);
  const path = rawPath.replace(/\/+$/, "") || "/";
  const parts = path.split("/").filter(Boolean);
  const queryParams = new URLSearchParams(query);

  if (parts.length === 0) return { page: "home" };
  if (parts[0] === "login") return { page: "login" };
  if (parts[0] === "register") return { page: "register" };
  if (parts[0] === "wods" && parts.length === 1) return { page: "wods" };
  if (parts[0] === "create-wod") return { page: "create-wod" };
  if (parts[0] === "my-wods" && parts.length === 1) {
    return queryParams.get("deleted") === "1"
      ? { page: "my-wods", feedback: "deleted" }
      : { page: "my-wods" };
  }
  if (parts[0] === "my-wods" && parts[2] === "edit" && Number.isInteger(Number(parts[1]))) {
    return { page: "my-wod-edit", id: Number(parts[1]) };
  }
  if (parts[0] === "my-wods" && parts[1] && Number.isInteger(Number(parts[1]))) {
    return { page: "my-wod-detail", id: Number(parts[1]) };
  }
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
