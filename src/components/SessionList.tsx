import { useState } from 'react';
import { FolderOpen, Pencil, Trash2, Check, X, Compass, Calculator, TrendingUp, Award } from 'lucide-react';
import type { UserPath } from '@/types';
import type { SessionMeta } from '@/lib/storage';
import Card from './ui/Card';
import Button from './ui/Button';

interface SessionListProps {
  sessions: SessionMeta[];
  activeId: string;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onStart: () => void;
}

const PATH_META: Record<UserPath, { label: string; icon: typeof Compass }> = {
  discover: { label: 'Tìm ý tưởng', icon: Compass },
  feasibility: { label: 'Kiểm tra khả thi', icon: Calculator },
  grow: { label: 'Tăng trưởng', icon: TrendingUp },
};

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function SessionList({ sessions, activeId, onOpen, onRename, onDelete, onStart }: SessionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const startEdit = (s: SessionMeta) => {
    setEditingId(s.id);
    setDraftName(s.name);
  };
  const commitEdit = () => {
    if (editingId && draftName.trim()) onRename(editingId, draftName.trim());
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow mb-2">Kế hoạch của tôi</p>
          <h1 className="text-2xl font-extrabold text-sandbox-text sm:text-3xl">Các kế hoạch đã lưu</h1>
          <p className="mt-2 text-sm text-sandbox-muted">
            Mỗi lần hoàn thành phỏng vấn, 1 SANDBOX BIZ tự lưu một kế hoạch. Bạn có thể mở lại, đổi tên hoặc xoá.
          </p>
        </div>
        <Button variant="gold" icon={<FolderOpen size={16} />} onClick={onStart}>
          Tạo kế hoạch mới
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card variant="elevated" glow="cyan" className="text-center">
          <p className="text-base font-semibold text-sandbox-text">Chưa có kế hoạch nào</p>
          <p className="mt-2 text-sm text-sandbox-muted">
            Bắt đầu phỏng vấn để AI tạo kế hoạch đầu tiên cho bạn.
          </p>
          <div className="mt-5">
            <Button variant="gold" icon={<FolderOpen size={16} />} onClick={onStart}>
              Bắt đầu ngay
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => {
            const pm = PATH_META[s.path] ?? PATH_META.discover;
            const PathIcon = pm.icon;
            const active = s.id === activeId;
            const editing = editingId === s.id;
            return (
              <Card key={s.id} variant="elevated" glow={active ? 'gold' : 'none'} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={() => onOpen(s.id)} className="flex items-start gap-3 text-left">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyanish bg-sandbox-elevated text-sandbox-cyan">
                    <PathIcon size={18} />
                  </span>
                  <span>
                    {editing ? (
                      <span className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          className="input-field w-56 px-2 py-1 text-sm"
                        />
                        <button type="button" onClick={commitEdit} className="text-sandbox-cyan hover:text-sandbox-cyan/80" aria-label="Lưu tên">
                          <Check size={16} />
                        </button>
                        <button type="button" onClick={() => setEditingId(null)} className="text-sandbox-muted hover:text-sandbox-softText" aria-label="Huỷ">
                          <X size={16} />
                        </button>
                      </span>
                    ) : (
                      <>
                        <span className="block text-base font-bold text-sandbox-text">
                          {s.name}
                          {active && <span className="ml-2 align-middle text-xs font-semibold text-sandbox-gold">• Đang mở</span>}
                        </span>
                        <span className="mt-0.5 block text-xs text-sandbox-muted">
                          {pm.label} · {formatDate(s.createdAt)} · {s.preview}
                        </span>
                      </>
                    )}
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-sandbox-gold/30 bg-sandbox-gold/10 px-2.5 py-1 text-xs font-semibold text-sandbox-gold">
                    <Award size={13} />
                    {s.fitScore}/100
                  </span>
                  {!editing && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(s)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-divider text-sandbox-muted transition hover:border-sandbox-cyan/40 hover:text-sandbox-cyan"
                        aria-label="Đổi tên"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(s.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-divider text-sandbox-muted transition hover:border-red-400/50 hover:text-red-300"
                        aria-label="Xoá"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
