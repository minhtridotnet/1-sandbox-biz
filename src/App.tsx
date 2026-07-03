import { useCallback, useState } from 'react';
import type { AiPlanResult, UserProfile, UserPath, View } from '@/types';
import {
  loadState,
  saveState,
  clearState,
  listSessions,
  saveSession,
  loadSession,
  deleteSession,
  renameSession,
  getActiveSessionId,
  setActiveSessionId,
  purgeLegacyState,
  type SessionMeta,
} from '@/lib/storage';
import { generatePlan } from '@/lib/mockAi';
import { PERSONAS } from '@/data/personas';
import AppShell from '@/components/AppShell';
import Hero from '@/components/Hero';
import PathSelector from '@/components/PathSelector';
import InterviewWizard from '@/components/InterviewWizard';
import Dashboard from '@/components/Dashboard';
import PersonaDemo from '@/components/PersonaDemo';
import SessionList from '@/components/SessionList';
import CompetitorComparison from '@/components/CompetitorComparison';
import Pricing from '@/components/Pricing';
import AiTransparency from '@/components/AiTransparency';

interface HistoryEntry {
  view: View;
  path: UserPath | null;
}

function useHistory(initial: HistoryEntry) {
  const [stack, setStack] = useState<HistoryEntry[]>([initial]);
  const current = stack[stack.length - 1];

  const push = useCallback((entry: HistoryEntry) => {
    setStack((prev) => [...prev, entry]);
  }, []);

  const replace = useCallback((entry: HistoryEntry) => {
    setStack((prev) => [...prev.slice(0, -1), entry]);
  }, []);

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const reset = useCallback((entry: HistoryEntry) => {
    setStack([entry]);
  }, []);

  return { current, push, replace, back, reset };
}

const PATH_LABEL: Record<UserPath, string> = {
  discover: 'Tìm ý tưởng',
  feasibility: 'Kiểm tra khả thi',
  grow: 'Tăng trưởng',
};

function makeSessionName(profile: UserProfile): string {
  const base = profile.displayName?.trim();
  if (base) return `${base} — ${PATH_LABEL[profile.path]}`;
  return PATH_LABEL[profile.path];
}

function makeId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const persisted = loadState();
  const [profile, setProfile] = useState<UserProfile | null>(persisted?.profile ?? null);
  const [result, setResult] = useState<AiPlanResult | null>(persisted?.result ?? null);
  const [chosenModelId, setChosenModelId] = useState<string | undefined>(persisted?.chosenModelId);
  const [activeSessionId, setActiveId] = useState<string>(getActiveSessionId());
  const [sessions, setSessions] = useState<SessionMeta[]>(() => listSessions());

  const { current, push, replace, back, reset } = useHistory({
    view: persisted?.view ?? 'landing',
    path: persisted?.path ?? null,
  });

  const persist = useCallback(
    (next: { view: View; path: UserPath | null; profile: UserProfile | null; result: AiPlanResult | null; chosenModelId?: string }) => {
      saveState({
        view: next.view,
        path: next.path,
        profile: next.profile,
        result: next.result,
        chosenModelId: next.chosenModelId,
      });
    },
    [],
  );

  const refreshSessions = useCallback(() => setSessions(listSessions()), []);

  const navigate = useCallback(
    (view: View) => {
      push({ view, path: current.path });
      persist({ view, path: current.path, profile, result });
    },
    [push, persist, current.path, profile, result],
  );

  const startFlow = useCallback(() => {
    push({ view: 'path', path: null });
    persist({ view: 'path', path: null, profile, result });
  }, [push, persist, profile, result]);

  const openPersonas = useCallback(() => {
    push({ view: 'personas', path: null });
    persist({ view: 'personas', path: null, profile, result });
  }, [push, persist, profile, result]);

  const openSessions = useCallback(() => {
    refreshSessions();
    push({ view: 'sessions', path: null });
    persist({ view: 'sessions', path: null, profile, result });
  }, [push, persist, profile, result, refreshSessions]);

  const choosePath = useCallback(
    (path: UserPath) => {
      replace({ view: 'interview', path });
      persist({ view: 'interview', path, profile, result });
    },
    [replace, persist, profile, result],
  );

  const completeInterview = useCallback(
    (nextProfile: UserProfile) => {
      const plan = generatePlan(nextProfile);
      const stamped: AiPlanResult = { ...plan, generatedAt: new Date().toISOString() };
      const id = makeId();
      const createdAt = new Date().toISOString();
      const state = {
        view: 'dashboard' as View,
        path: nextProfile.path,
        profile: nextProfile,
        result: stamped,
      };
      saveSession(state, makeSessionName(nextProfile), id, createdAt);
      setActiveSessionId(id);
      setActiveId(id);
      setProfile(nextProfile);
      setResult(stamped);
      setChosenModelId(undefined);
      refreshSessions();
      push({ view: 'dashboard', path: nextProfile.path });
      persist({ view: 'dashboard', path: nextProfile.path, profile: nextProfile, result: stamped });
    },
    [push, persist, refreshSessions],
  );

  const runPersona = useCallback(
    (personaProfile: UserProfile) => {
      const plan = generatePlan(personaProfile);
      const stamped: AiPlanResult = { ...plan, generatedAt: new Date().toISOString() };
      const id = makeId();
      const createdAt = new Date().toISOString();
      const state = {
        view: 'dashboard' as View,
        path: personaProfile.path,
        profile: personaProfile,
        result: stamped,
      };
      saveSession(state, makeSessionName(personaProfile), id, createdAt);
      setActiveSessionId(id);
      setActiveId(id);
      setProfile(personaProfile);
      setResult(stamped);
      setChosenModelId(undefined);
      refreshSessions();
      push({ view: 'dashboard', path: personaProfile.path });
      persist({ view: 'dashboard', path: personaProfile.path, profile: personaProfile, result: stamped });
    },
    [push, persist, refreshSessions],
  );

  const chooseModel = useCallback(
    (modelId: string) => {
      if (!profile) return;
      const plan = generatePlan(profile, modelId);
      const stamped: AiPlanResult = { ...plan, generatedAt: new Date().toISOString() };
      setChosenModelId(modelId);
      setResult(stamped);
      persist({ view: 'dashboard', path: profile.path, profile, result: stamped, chosenModelId: modelId });
      if (activeSessionId) {
        saveSession(
          { view: 'dashboard', path: profile.path, profile, result: stamped, chosenModelId: modelId },
          makeSessionName(profile),
          activeSessionId,
          stamped.generatedAt,
        );
        refreshSessions();
      }
    },
    [profile, persist, activeSessionId, refreshSessions],
  );

  const openSession = useCallback(
    (id: string) => {
      const state = loadSession(id);
      if (!state) return;
      setActiveSessionId(id);
      setActiveId(id);
      setProfile(state.profile ?? null);
      setResult(state.result ?? null);
      setChosenModelId(state.chosenModelId);
      push({ view: state.view === 'sessions' ? 'dashboard' : state.view, path: state.path ?? null });
      persist({
        view: 'dashboard',
        path: state.path ?? null,
        profile: state.profile ?? null,
        result: state.result ?? null,
        chosenModelId: state.chosenModelId,
      });
    },
    [push, persist],
  );

  const renameSessionHandler = useCallback(
    (id: string, name: string) => {
      renameSession(id, name);
      refreshSessions();
    },
    [refreshSessions],
  );

  const deleteSessionHandler = useCallback(
    (id: string) => {
      deleteSession(id);
      refreshSessions();
      if (id === activeSessionId) {
        setActiveId(getActiveSessionId());
      }
    },
    [refreshSessions, activeSessionId],
  );

  const restart = useCallback(() => {
    setProfile(null);
    setResult(null);
    setChosenModelId(undefined);
    clearState();
    purgeLegacyState();
    reset({ view: 'landing', path: null });
  }, [reset]);

  const renderView = () => {
    switch (current.view) {
      case 'landing':
        return (
          <>
            <Hero onStart={startFlow} onDemo={openPersonas} />
            <section id="khac-biet" className="scroll-mt-20">
              <CompetitorComparison />
            </section>
            <section id="bang-gia" className="scroll-mt-20">
              <Pricing />
            </section>
            <section id="ai-minh-bach" className="scroll-mt-20">
              <AiTransparency />
            </section>
          </>
        );
      case 'path':
        return <PathSelector onSelect={choosePath} />;
      case 'interview':
        return current.path ? (
          <InterviewWizard path={current.path} onComplete={completeInterview} onBack={back} />
        ) : (
          <PathSelector onSelect={choosePath} />
        );
      case 'dashboard':
        return result ? (
          <Dashboard result={result} onRestart={restart} onChooseModel={chooseModel} chosenModelId={chosenModelId} />
        ) : (
          <PathSelector onSelect={choosePath} />
        );
      case 'personas':
        return <PersonaDemo personas={PERSONAS} onSelect={runPersona} />;
      case 'sessions':
        return (
          <SessionList
            sessions={sessions}
            activeId={activeSessionId}
            onOpen={openSession}
            onRename={renameSessionHandler}
            onDelete={deleteSessionHandler}
            onStart={startFlow}
          />
        );
      default:
        return (
          <>
            <Hero onStart={startFlow} onDemo={openPersonas} />
            <section id="khac-biet" className="scroll-mt-20">
              <CompetitorComparison />
            </section>
            <section id="bang-gia" className="scroll-mt-20">
              <Pricing />
            </section>
            <section id="ai-minh-bach" className="scroll-mt-20">
              <AiTransparency />
            </section>
          </>
        );
    }
  };

  return (
    <AppShell view={current.view} onNavigate={navigate} onRestart={restart} onOpenSessions={openSessions}>
      {renderView()}
    </AppShell>
  );
}
