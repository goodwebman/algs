/**
 * Справочник по встроенным API JavaScript — данные.
 *
 * Примеры хранятся строками и **реально исполняются в тесте**
 * (`reference.test.ts`): каждая строка вида `expr; // → значение` проверяется
 * на равенство. Справочник, который врёт, хуже отсутствующего, поэтому
 * ошибиться в примере физически нельзя — тест упадёт.
 */

export interface ApiEntry {
  /** Сигнатура для заголовка: `str.slice(start?, end?)`. */
  readonly sig: string;
  /**
   * Имя свойства на хосте секции — тест проверяет, что оно существует.
   * `null` — если это синтаксис или приём, а не метод.
   */
  readonly key: string | null;
  /** Одна строка: что делает. */
  readonly summary: string;
  /** Возвращаемое значение. */
  readonly returns?: string;
  /** Мутирует исходную структуру. */
  readonly mutates?: boolean;
  /** Асимптотика, если она не очевидна или является ловушкой. */
  readonly complexity?: string;
  /** Версия стандарта для свежих методов — маркер «может не быть в старых средах». */
  readonly since?: string;
  /** Блоки кода: от простого к сложному. */
  readonly examples: readonly string[];
  /** Грабли, на которые наступают все. */
  readonly gotcha?: string;
}

export interface ApiSection {
  readonly title: string;
  /**
   * Объект, на котором живут методы секции: `Array.prototype`, `Object` и т.д.
   * `null` — секция про синтаксис, проверять нечего.
   */
  readonly host: string | null;
  readonly entries: readonly ApiEntry[];
}

export interface ApiGroup {
  readonly id: string;
  readonly title: string;
  readonly intro: string;
  readonly sections: readonly ApiSection[];
}
