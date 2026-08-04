import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { TracePlayer } from './TracePlayer';
import algo from '@/algorithms/two-pointers/two-sum-sorted.algo';

const setup = () => {
  const user = userEvent.setup();
  render(<TracePlayer algo={algo} />);
  return user;
};

const noteText = () => screen.getByRole('status').textContent ?? '';
const counter = () => screen.getByText(/^\d+ \/ \d+$/).textContent ?? '';

describe('TracePlayer', () => {
  it('рисует первый кадр и листинг', () => {
    setup();

    expect(counter()).toMatch(/^1 \//);
    expect(noteText().length).toBeGreaterThan(0);
    // Листинг — это сам файл алгоритма, в нём обязана быть сигнатура генератора
    expect(screen.getByText(/traceTwoSumSorted/)).toBeInTheDocument();
  });

  it('шаг вперёд меняет кадр, шаг назад возвращает прежний', async () => {
    const user = setup();
    const first = noteText();

    await user.click(screen.getByRole('button', { name: 'Шаг вперёд' }));
    const second = noteText();
    expect(second).not.toBe(first);
    expect(counter()).toMatch(/^2 \//);

    await user.click(screen.getByRole('button', { name: 'Шаг назад' }));
    expect(noteText()).toBe(first);
    expect(counter()).toMatch(/^1 \//);
  });

  it('сброс возвращает в начало', async () => {
    const user = setup();
    const first = noteText();

    await user.click(screen.getByRole('button', { name: 'Шаг вперёд' }));
    await user.click(screen.getByRole('button', { name: 'Шаг вперёд' }));
    await user.click(screen.getByRole('button', { name: 'В начало' }));

    expect(noteText()).toBe(first);
    expect(counter()).toMatch(/^1 \//);
  });

  it('шаг назад заблокирован на первом кадре', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Шаг назад' })).toBeDisabled();
  });

  it('смена пресета сбрасывает плеер на первый кадр', async () => {
    const user = setup();

    await user.click(screen.getByRole('button', { name: 'Шаг вперёд' }));
    expect(counter()).toMatch(/^2 \//);

    await user.click(screen.getByRole('button', { name: '[1,2,3], 100' }));
    expect(counter()).toMatch(/^1 \//);
  });

  it('показывает сложность алгоритма', () => {
    setup();
    expect(screen.getByText(/время O\(n\)/)).toBeInTheDocument();
    expect(screen.getByText(/память O\(1\)/)).toBeInTheDocument();
  });

  it('легенда объясняет указатели, а не только цвета', () => {
    setup();
    const legend = screen.getAllByRole('list').find((list) => within(list).queryByText('left'));
    expect(legend).toBeDefined();
    expect(within(legend!).getByText('right')).toBeInTheDocument();
  });
});
