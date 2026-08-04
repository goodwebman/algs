import { describe, expect, it } from 'vitest';

import { lineOfAnchor, parseSource } from './source';

describe('parseSource', () => {
  it('вырезает регион между маркерами', () => {
    const raw = ['import x from "y";', '// #region show', 'const a = 1;', '// #endregion', 'export {};'].join(
      '\n',
    );
    expect(parseSource(raw).lines).toEqual(['const a = 1;']);
  });

  it('без маркеров берёт файл целиком', () => {
    expect(parseSource('const a = 1;\nconst b = 2;').lines).toHaveLength(2);
  });

  it('снимает общий отступ', () => {
    const raw = ['// #region show', '    const a = 1;', '      const b = 2;', '// #endregion'].join('\n');
    expect(parseSource(raw).lines).toEqual(['const a = 1;', '  const b = 2;']);
  });

  it('вырезает якорь из текста и запоминает его строку', () => {
    const parsed = parseSource(['const a = 1;', 'const b = 2; // @here', 'const c = 3;'].join('\n'));

    expect(parsed.lines[1]).toBe('const b = 2;');
    expect(parsed.anchors.get('here')).toBe(2);
    expect(lineOfAnchor(parsed, 'here')).toBe(2);
  });

  it('неизвестный якорь не подсвечивает ничего', () => {
    expect(lineOfAnchor(parseSource('const a = 1;'), 'missing')).toBe(0);
    expect(lineOfAnchor(parseSource('const a = 1;'), undefined)).toBe(0);
  });

  // Дубль имени — почти всегда copy-paste при добавлении шага. Молча взять
  // последнее совпадение значит получить подсветку не той строки.
  it('падает на дубликате якоря', () => {
    expect(() => parseSource('a; // @x\nb; // @x')).toThrow(/дважды/);
  });

  it('обрезает хвостовые пустые строки', () => {
    expect(parseSource('const a = 1;\n\n\n').lines).toEqual(['const a = 1;']);
  });
});
