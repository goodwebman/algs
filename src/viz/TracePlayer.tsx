import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';

import { CodeListing } from './CodeListing';
import { Legend } from './Legend';
import { MetricsBar } from './MetricsBar';
import { VizRenderer } from './VizRenderer';
import type { AlgoDefinition } from '@/core/algo';
import { parseSource } from '@/core/source';
import { lineOfAnchor } from '@/core/source';
import { useTracePlayer, SPEED_STEPS } from '@/core/useTracePlayer';
import { UIBadge, UIButton, UIKbd, UISlider, cn } from '@/ui';

interface PlayerBodyProps {
  algo: AlgoDefinition<readonly any[], any>;
  presetIndex: number;
}

const PlayerBody = ({ algo, presetIndex }: PlayerBodyProps) => {
  const preset = algo.presets[presetIndex];
  const source = useMemo(() => parseSource(algo.raw), [algo.raw]);

  const makeTrace = useCallback(
    () => algo.trace(...preset.args),
    // preset.args стабильны (литералы в определении алгоритма)
    [algo, preset],
  );

  const player = useTracePlayer(makeTrace);
  const states = useMemo(() => player.frames.map((f) => f.state), [player.frames]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    // Не перехватываем ввод, если фокус внутри поля или ссылки.
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, select, a, [contenteditable]')) return;

    const actions: Record<string, () => void> = {
      ' ': player.toggle,
      ArrowRight: player.next,
      ArrowLeft: player.prev,
      Home: () => player.seek(0),
      End: () => player.seek(player.total - 1),
      r: player.reset,
      к: player.reset,
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };

  if (player.error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
        <p className="font-semibold text-destructive-emphasis">Алгоритм упал при трассировке</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{player.error.message}</p>
      </div>
    );
  }

  const last = player.frames[player.total - 1];
  const atEnd = player.index === player.total - 1;

  return (
    // Обычная секция, а не role="application": всё управление доступно
    // кнопками ниже. Горячие клавиши — дополнение поверх них, обработчик
    // висит на группе кнопок (там фокус и находится), а не на контейнере.
    <section
      aria-label={`Визуализация: ${algo.meta.title}`}
      className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-h-44">{player.frame && <VizRenderer state={player.frame.state} />}</div>
          <Legend states={states} />
        </div>

        <div className="min-w-0">
          <CodeListing source={source} activeLine={lineOfAnchor(source, player.frame?.at)} />
        </div>
      </div>

      {/* Комментарий к шагу — он же текстовая альтернатива картинки для скринридера */}
      <p
        role="status"
        aria-live="polite"
        className="min-h-10 rounded-lg bg-muted/40 px-3 py-2 text-center text-sm text-foreground"
      >
        {player.frame?.note ?? '—'}
      </p>

      {/* onKeyDown на группе управления: фокус после Tab попадает именно
          сюда, а событие с кнопок всплывает в этот же контейнер. */}
      <div
        role="toolbar"
        aria-label="Управление воспроизведением"
        className="flex flex-wrap items-center justify-center gap-3"
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-1">
          <UIButton
            size="icon"
            variant="ghost"
            onClick={player.reset}
            aria-label="В начало"
            title="В начало (R)"
          >
            <RotateCcw size={18} aria-hidden="true" />
          </UIButton>
          <UIButton
            size="icon"
            variant="ghost"
            onClick={player.prev}
            disabled={player.index === 0}
            aria-label="Шаг назад"
            title="Шаг назад (←)"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </UIButton>
          <UIButton
            size="icon"
            onClick={player.toggle}
            aria-label={player.playing ? 'Пауза' : 'Играть'}
            title={player.playing ? 'Пауза (Space)' : 'Играть (Space)'}
          >
            {player.playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
          </UIButton>
          <UIButton
            size="icon"
            variant="ghost"
            onClick={player.next}
            disabled={atEnd}
            aria-label="Шаг вперёд"
            title="Шаг вперёд (→)"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </UIButton>
        </div>

        <div className="flex min-w-52 flex-1 items-center gap-2">
          <UISlider
            min={0}
            max={Math.max(player.total - 1, 0)}
            value={player.index}
            onValueChange={player.seek}
            ariaLabel="Перемотка по шагам"
            className="flex-1"
          />
          <span className="tnum shrink-0 font-mono text-xs text-muted-foreground">
            {player.total ? player.index + 1 : 0} / {player.total}
          </span>
        </div>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          скорость
          <select
            value={player.speed}
            onChange={(event) => player.setSpeed(Number(event.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 font-mono text-xs text-foreground"
          >
            {SPEED_STEPS.map((speed) => (
              <option key={speed} value={speed}>
                {speed}×
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <MetricsBar metrics={player.frame?.totals ?? last?.totals ?? { comparisons: 0, swaps: 0, reads: 0, writes: 0, extraMemory: 0 }} />

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <UIKbd>Space</UIKbd> пуск <UIKbd>←</UIKbd> <UIKbd>→</UIKbd> шаг <UIKbd>R</UIKbd> сброс
        </p>
      </div>

      {player.truncated && (
        <p className="rounded-md bg-warning/10 px-3 py-2 text-xs text-warning-emphasis">
          Трассировка оборвана по лимиту шагов — вход слишком большой для пошагового показа.
        </p>
      )}
    </section>
  );
};

/**
 * Интерактивная визуализация алгоритма: пресеты входных данных, плеер шагов,
 * листинг с подсветкой строки и счётчики операций.
 *
 * Смена пресета делает полный ремоунт плеера через `key` — состояние
 * (индекс шага, play/pause) должно сброситься целиком, и это ровно тот
 * случай, где `key` заменяет эффект-синхронизацию state с props.
 */
export const TracePlayer = ({ algo }: { algo: AlgoDefinition<readonly any[], any> }) => {
  const [presetIndex, setPresetIndex] = useState(0);
  const preset = algo.presets[presetIndex];

  return (
    <section className="flex flex-col gap-3">
      {algo.presets.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">вход:</span>
          {algo.presets.map((item, index) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setPresetIndex(index)}
              aria-pressed={index === presetIndex}
              className={cn(
                'cursor-pointer rounded-md border px-2.5 py-1 font-mono text-xs transition-colors',
                index === presetIndex
                  ? 'border-primary bg-primary/15 text-foreground'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {preset?.hint && <p className="text-xs text-muted-foreground">{preset.hint}</p>}

      <PlayerBody key={`${algo.meta.slug}:${presetIndex}`} algo={algo} presetIndex={presetIndex} />

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <UIBadge variant="outline">время {algo.meta.complexity.time}</UIBadge>
        <UIBadge variant="outline">память {algo.meta.complexity.space}</UIBadge>
        {algo.meta.leetcode && (
          <a
            href={`https://leetcode.com/problems/${algo.meta.leetcode.title}/`}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            LeetCode {algo.meta.leetcode.id}
          </a>
        )}
      </div>
    </section>
  );
};
