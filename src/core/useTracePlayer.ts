import { useCallback, useEffect, useMemo, useState } from 'react';

import { collectFrames, type AlgoTrace, type Frame } from './trace';
import type { VizState } from '@/viz/types';

export interface TracePlayerOptions {
  /** Шагов в секунду на старте. */
  initialSpeed?: number;
  /** Автозапуск при монтировании. */
  autoPlay?: boolean;
}

export interface TracePlayer {
  frames: Frame<VizState>[];
  frame: Frame<VizState> | undefined;
  index: number;
  total: number;
  playing: boolean;
  speed: number;
  truncated: boolean;
  /** Ошибка выполнения самого алгоритма — показываем, а не роняем страницу. */
  error: Error | null;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  seek: (index: number) => void;
  setSpeed: (speed: number) => void;
}

export const SPEED_STEPS = [0.5, 1, 2, 4, 8, 16, 32] as const;

/**
 * Плеер трассировки.
 *
 * Кадры считаются один раз при смене генератора и хранятся целиком, поэтому
 * перемотка и шаг назад стоят O(1). Продвижение времени — на requestAnimationFrame
 * с аккумулятором: setInterval на 30 шагах/сек копит дрейф и рассинхронится
 * с анимацией ячеек, rAF — нет.
 *
 * Плеер НЕ сбрасывает индекс при смене входных данных: за это отвечает `key`
 * на компоненте выше (полный ремоунт), иначе пришлось бы синхронизировать
 * state с props эффектом — ровно тот случай, где эффект не нужен.
 */
export const useTracePlayer = (
  makeTrace: () => AlgoTrace<VizState, unknown>,
  options: TracePlayerOptions = {},
): TracePlayer => {
  const { initialSpeed = 4, autoPlay = false } = options;

  const run = useMemo(() => {
    try {
      return { ...collectFrames(makeTrace()), error: null as Error | null };
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      return { frames: [] as Frame<VizState>[], result: undefined, truncated: false, error };
    }
    // makeTrace приходит из useCallback вызывающего — пересчёт только при смене входа
  }, [makeTrace]);

  const total = run.frames.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay && total > 0);
  const [speed, setSpeed] = useState(initialSpeed);

  const seek = useCallback(
    (value: number) => setIndex(Math.min(Math.max(value, 0), Math.max(total - 1, 0))),
    [total],
  );

  const next = useCallback(() => seek(index + 1), [index, seek]);
  const prev = useCallback(() => seek(index - 1), [index, seek]);

  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);

  const play = useCallback(() => {
    if (total === 0) return;
    // Нажали play на последнем кадре — начинаем сначала, а не «ничего не произошло».
    setIndex((current) => (current >= total - 1 ? 0 : current));
    setPlaying(true);
  }, [total]);

  const pause = useCallback(() => setPlaying(false), []);
  const toggle = useCallback(() => (playing ? pause() : play()), [playing, pause, play]);

  // Внешняя система — таймер кадров. Настоящий случай для useEffect.
  useEffect(() => {
    if (!playing || total === 0) return;

    let raf = 0;
    let last = performance.now();
    let accumulated = 0;
    const interval = 1000 / speed;

    const tick = (now: number) => {
      accumulated += now - last;
      last = now;

      if (accumulated >= interval) {
        const jump = Math.floor(accumulated / interval);
        accumulated -= jump * interval;

        setIndex((current) => {
          const target = current + jump;
          if (target >= total - 1) {
            setPlaying(false);
            return total - 1;
          }
          return target;
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, speed, total]);

  return {
    frames: run.frames,
    frame: run.frames[index],
    index,
    total,
    playing,
    speed,
    truncated: run.truncated,
    error: run.error,
    play,
    pause,
    toggle,
    next,
    prev,
    reset,
    seek,
    setSpeed,
  };
};
