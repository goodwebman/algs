import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ApiReference } from './ApiReference';

describe('справочник по API', () => {
  it('открывается на массивах и раскрывает пример по клику', async () => {
    const user = userEvent.setup();
    render(<ApiReference />);

    const trigger = screen.getByRole('button', { name: /arr\.map\(fn\)/ });
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    // пример из карточки map — тот самый, что проверяется в reference.test.ts
    expect(screen.getByText(/map\(parseInt\)/)).toBeInTheDocument();
  });

  it('поиск ищет по всем группам, а не только по активной вкладке', async () => {
    const user = userEvent.setup();
    render(<ApiReference />);

    // вкладка «Массивы», а ищем метод строк
    await user.type(screen.getByLabelText('Поиск по справочнику'), 'padStart');

    expect(await screen.findByRole('button', { name: /str\.padStart/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /arr\.map\(fn\)/ })).not.toBeInTheDocument();
  });
});
