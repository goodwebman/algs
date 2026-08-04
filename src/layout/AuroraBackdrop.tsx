/**
 * Ambient-фон: северное сияние.
 *
 * Единственное место в интерфейсе, где живёт градиент — гайд Aurora
 * одновременно требует «northern lights gradient animations» и запрещает
 * декоративные градиенты. Компромисс: градиент работает как атмосфера
 * страницы, компоненты и визуализации остаются плоскими. Иначе движущийся
 * градиент за движущимися указателями превращает визуализацию в кашу.
 *
 * Анимируются только transform и opacity — ни одного layout-свойства.
 * Затухание по prefers-reduced-motion делает глобальное правило в tokens.css.
 */
export const AuroraBackdrop = () => (
  <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div
      className="animate-aurora absolute -top-1/3 left-[-10%] h-[70vh] w-[120%] blur-3xl"
      style={{
        background:
          'radial-gradient(60% 60% at 30% 40%, color-mix(in oklch, var(--viz-active) 22%, transparent) 0%, transparent 70%),' +
          'radial-gradient(50% 50% at 70% 30%, color-mix(in oklch, var(--info) 18%, transparent) 0%, transparent 70%),' +
          'radial-gradient(45% 45% at 55% 65%, color-mix(in oklch, var(--viz-window) 20%, transparent) 0%, transparent 70%)',
      }}
    />
    {/* Звёздное поле — статичный SVG-паттерн, без анимации: мерцающие точки
        за движущимися ячейками массива мешают следить за алгоритмом. */}
    <svg className="absolute inset-0 h-full w-full opacity-[0.18]">
      <defs>
        <pattern id="stars" width="140" height="140" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="30" r="0.8" fill="var(--foreground)" />
          <circle cx="95" cy="18" r="0.6" fill="var(--foreground)" />
          <circle cx="60" cy="82" r="0.7" fill="var(--foreground)" />
          <circle cx="128" cy="110" r="0.5" fill="var(--foreground)" />
          <circle cx="35" cy="120" r="0.6" fill="var(--foreground)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stars)" />
    </svg>
  </div>
);
