function factorial(n) {
  if (n === 0 || n === 1) {
    return 1; // базовый случай
  }

  return n * factorial(n - 1); // рекурсивный вызов
}
