# Алгоритмы и структуры данных --- расширенный конспект

## Стек (LIFO)

``` ts
class Stack<T> {
  private items: T[] = []

  push(el: T) { this.items.push(el) }
  pop() { return this.items.pop() }
  peek() { return this.items[this.items.length - 1] }
  size() { return this.items.length }
  isEmpty() { return this.items.length === 0 }
}
```

### Использование:

-   Проверка скобок
-   Глубина вложенности
-   Flatten массива

------------------------------------------------------------------------

## Очередь (FIFO)

``` ts
class Queue<T> {
  private items: Record<number, T> = {}
  private head = 0
  private tail = 0

  enqueue(el: T) { this.items[this.tail++] = el }

  dequeue() {
    if (this.head === this.tail) return undefined
    const el = this.items[this.head]
    delete this.items[this.head++]
    return el
  }
}
```

------------------------------------------------------------------------

## Деревья --- DFS (итеративно)

``` ts
const treeSum = (tree) => {
  let sum = 0
  const stack = [...tree]

  while (stack.length) {
    const node = stack.pop()
    sum += node.v
    if (node.c) stack.push(...node.c)
  }

  return sum
}
```

------------------------------------------------------------------------

## Поиск узлов по типу

``` ts
const getNodes = (tree, type) => {
  const stack = [tree]
  const res = []

  while (stack.length) {
    const node = stack.pop()
    if (node.type === type) res.push(node)
    if (node.children) stack.push(...node.children)
  }

  return res
}
```

------------------------------------------------------------------------

# Графы

Граф представлен списком смежности:

``` ts
const graph = {
  a: ['b', 'c'],
  b: ['e'],
  c: ['d', 'f'],
  d: ['e'],
  e: ['g'],
  f: ['e'],
  g: [],
}
```

------------------------------------------------------------------------

## DFS (итеративно через стек)

``` ts
const dfsIterative = (graph, start) => {
  const visited = new Set()
  const stack = [start]

  while (stack.length) {
    const node = stack.pop()

    if (!visited.has(node)) {
      visited.add(node)

      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor)
        }
      }
    }
  }

  return visited
}
```

### Сложность:

O(V + E)

------------------------------------------------------------------------

## BFS (поиск достижимости)

``` ts
const bfs = (graph, start, end) => {
  const visited = new Set([start])
  const queue = [start]

  while (queue.length) {
    const node = queue.shift()

    for (const neighbor of graph[node]) {
      if (neighbor === end) return true

      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  return false
}
```

------------------------------------------------------------------------

## BFS с восстановлением пути

``` ts
const bfsPath = (graph, start, end) => {
  const visited = new Set([start])
  const queue = [start]
  const parent = { [start]: null }

  while (queue.length) {
    const node = queue.shift()

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        parent[neighbor] = node
        queue.push(neighbor)

        if (neighbor === end) {
          return buildPath(parent, end)
        }
      }
    }
  }

  return null
}

const buildPath = (parent, end) => {
  const path = []
  let cur = end

  while (cur !== null) {
    path.push(cur)
    cur = parent[cur]
  }

  return path.reverse()
}
```

------------------------------------------------------------------------

## Бинарное дерево поиска (BST)

``` ts
class Node {
  constructor(value) {
    this.value = value
    this.left = null
    this.right = null
  }
}

class BinarySearchTree {
  root = null

  insert(value) {
    const node = new Node(value)

    if (!this.root) {
      this.root = node
      return
    }

    let cur = this.root

    while (true) {
      if (value < cur.value) {
        if (!cur.left) return cur.left = node
        cur = cur.left
      } else {
        if (!cur.right) return cur.right = node
        cur = cur.right
      }
    }
  }

  search(value) {
    let cur = this.root

    while (cur) {
      if (cur.value === value) return true
      cur = value < cur.value ? cur.left : cur.right
    }

    return false
  }
}
```

### Сложности BST:

  Операция   Best       Avg        Worst
  ---------- ---------- ---------- -------
  Search     O(log n)   O(log n)   O(n)
  Insert     O(log n)   O(log n)   O(n)
  Delete     O(log n)   O(log n)   O(n)

------------------------------------------------------------------------

## Ключевые идеи для собесов

-   DFS → глубина, рекурсия, стек
-   BFS → кратчайший путь в невзвешенном графе
-   visited обязательно!
-   parent map для восстановления маршрута
-   графы почти всегда O(V + E)
