import { Menu, Terminal, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';

import { TOPICS } from '@/content/topics';
import { useProgress } from '@/store/progress';
import { UIButton, cn } from '@/ui';

const NAV = [
  { to: '/', label: 'Обзор', end: true },
  { to: '/cheatsheet', label: 'Шпаргалка', end: false },
  { to: '/playground', label: 'Песочница', end: false },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-1.5 text-sm transition-colors',
    isActive ? 'bg-primary/15 font-medium text-foreground' : 'text-muted-foreground hover:bg-muted',
  );

export const Header = () => {
  const [open, setOpen] = useState(false);
  const solved = useProgress((state) => state.solved.length);

  return (
    <header className="sticky top-0 z-[100] border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-6 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Terminal size={18} className="text-primary" aria-hidden="true" />
          <span>Алгоритмы на JS</span>
        </Link>

        <nav aria-label="Основная навигация" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <span className="tnum ml-auto font-mono text-xs text-muted-foreground md:ml-0">
          решено {solved}
        </span>

        <UIButton
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        >
          {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </UIButton>
      </div>

      {open && (
        <nav
          aria-label="Мобильная навигация"
          className="max-h-[70vh] overflow-y-auto border-t border-border px-6 py-3 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <p className="mt-3 mb-1 text-xs font-semibold text-muted-foreground">Темы</p>
          <div className="flex flex-col gap-1">
            {TOPICS.map((topic) => (
              <NavLink
                key={topic.id}
                to={`/t/${topic.id}`}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {topic.order}. {topic.title}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};
