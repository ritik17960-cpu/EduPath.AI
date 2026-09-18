import { AppState } from "./types";

const STORAGE_KEY = "edupath.state.v1";

export const emptyState: AppState = {
  profile: null,
  assessment: null,
  roadmap: null,
  interventions: [],
  projects: [],
  chatMessages: [],
};

export function loadState(): AppState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw);
    return { ...emptyState, ...parsed };
  } catch (err) {
    console.error("EduPath: failed to load state from localStorage", err);
    return emptyState;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error("EduPath: failed to save state to localStorage", err);
  }
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
