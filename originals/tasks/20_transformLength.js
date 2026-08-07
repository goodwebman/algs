const transformLength = (start, finish, words) => {
  const queue = [[start, 1]]
  const visited = new Set([start])

  while (queue.length) {
    const [word, dist] = queue.shift()

    if (word === finish) return dist

    for (const next of words) {
      if (visited.has(next)) continue

      let diff = 0
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== next[i]) diff++
      }

      if (diff === 1) {
        visited.add(next)
        queue.push([next, dist + 1])
      }
    }
  }

  return 0
}


// пример
console.log(
  transformLength(
    "пир",
    "сок",
    ["пик", "кот", "сок", "тик", "тир", "ток", "ком"]
  )
) // 5
