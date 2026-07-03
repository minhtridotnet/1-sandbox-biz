import type { AppState, AnswerValue, UserPath } from '@/types';

const STATE_KEY = 'sb_state_v1';
const DRAFT_PREFIX = 'sb_draft_v1_';
const PATHS = ['discover', 'feasibility', 'grow'] as const;

// --- Multi-session layer (v1) ---
const SESSIONS_KEY = 'sb_sessions_v1';
const SESSION_PREFIX = 'sb_session_v1_';
const ACTIVE_KEY = 'sb_active_v1';
const SESSION_DRAFT_PREFIX = 'sb_draft_v1_';

export interface SessionMeta {
  id: string;
  name: string;
  createdAt: string;
  path: UserPath;
  fitScore: number;
  preview: string;
}

export function loadState(): Partial<AppState> | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AppState>;
  } catch {
    return null;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STATE_KEY);
    PATHS.forEach((p) => localStorage.removeItem(`${DRAFT_PREFIX}${p}`));
  } catch {
    /* ignore */
  }
}

export interface DraftAnswers {
  stepIndex: number;
  answers: Record<string, AnswerValue>;
}

export function loadDraftAnswers(path: string): DraftAnswers | null {
  try {
    const raw = localStorage.getItem(`${DRAFT_PREFIX}${path}`);
    if (!raw) return null;
    return JSON.parse(raw) as DraftAnswers;
  } catch {
    return null;
  }
}

export function saveDraftAnswers(path: string, data: DraftAnswers): void {
  try {
    localStorage.setItem(`${DRAFT_PREFIX}${path}`, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function clearDraftAnswers(path: string): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${path}`);
  } catch {
    /* ignore */
  }
}

// --- Session draft (per-session-per-path) ---
export function loadSessionDraftAnswers(sessionId: string, path: string): DraftAnswers | null {
  try {
    const raw = localStorage.getItem(`${SESSION_DRAFT_PREFIX}${sessionId}_${path}`);
    if (!raw) return null;
    return JSON.parse(raw) as DraftAnswers;
  } catch {
    return null;
  }
}

export function saveSessionDraftAnswers(sessionId: string, path: string, data: DraftAnswers): void {
  try {
    localStorage.setItem(`${SESSION_DRAFT_PREFIX}${sessionId}_${path}`, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function clearSessionDraftAnswers(sessionId: string, path: string): void {
  try {
    localStorage.removeItem(`${SESSION_DRAFT_PREFIX}${sessionId}_${path}`);
  } catch {
    /* ignore */
  }
}

// --- Session registry + per-session state ---
function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function listSessions(): SessionMeta[] {
  const arr = safeParse<SessionMeta[]>(localStorage.getItem(SESSIONS_KEY));
  return arr ?? [];
}

function writeSessions(list: SessionMeta[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function loadSession(id: string): AppState | null {
  return safeParse<AppState>(localStorage.getItem(`${SESSION_PREFIX}${id}`));
}

export function saveSession(state: AppState, name: string, id: string, createdAt: string): SessionMeta {
  try {
    localStorage.setItem(`${SESSION_PREFIX}${id}`, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  const meta: SessionMeta = {
    id,
    name,
    createdAt,
    path: state.path ?? 'discover',
    fitScore: state.result?.fitScore ?? 0,
    preview: state.profile?.displayName || state.profile?.targetCustomers || state.profile?.occupation || 'Kế hoạch kinh doanh',
  };
  const list = listSessions().filter((s) => s.id !== id);
  list.unshift(meta);
  writeSessions(list);
  setActiveSessionId(id);
  return meta;
}

export function deleteSession(id: string): void {
  try {
    localStorage.removeItem(`${SESSION_PREFIX}${id}`);
    PATHS.forEach((p) => localStorage.removeItem(`${SESSION_DRAFT_PREFIX}${id}_${p}`));
  } catch {
    /* ignore */
  }
  const list = listSessions().filter((s) => s.id !== id);
  writeSessions(list);
  if (getActiveSessionId() === id) {
    setActiveSessionId(list[0]?.id ?? '');
  }
}

export function renameSession(id: string, name: string): void {
  const list = listSessions().map((s) => (s.id === id ? { ...s, name } : s));
  writeSessions(list);
}

export function getActiveSessionId(): string {
  return localStorage.getItem(ACTIVE_KEY) ?? '';
}

export function setActiveSessionId(id: string): void {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
}

// One-time orphan cleanup for the old single-slot key (prototype migration).
export function purgeLegacyState(): void {
  try {
    localStorage.removeItem(STATE_KEY);
  } catch {
    /* ignore */
  }
}
