class Stack<T> {
	private items: T[]
	constructor() {
		this.items = []
	}

	push(element: T): void {
		this.items.push(element)
	}

	pop(): T | undefined {
		return this.items.pop()
	}

	peek(): T | undefined {
		return this.items[this.items.length - 1]
	}
	size(): number {
		return this.items.length
	}

	isEmpty(): boolean {
		return this.size() === 0
	}
}

const stack = new Stack()
stack.push(10)
stack.push(20)
stack.push(30)

function maxDepth(s: string): number {
	const stack = new Stack<string>()
	let max = 0

	for (let i = 0; i < s.length; i++) {
		if (s[i] === '(') {
			stack.push(s[i])
			max = Math.max(max, stack.size())
		} else {
			if (s[i] === ')') {
				stack.pop()
			}
		}
	}
	return max
}

// '(())

function isValid(s: string): boolean {
	const pairs: Record<string, string> = {
		')': '(',
		'}': '{',
		']': '[',
	} as const

	const stack = new Stack()
	for (let symb of s) {
		if (!pairs[symb]) {
			stack.push(symb)
		} else if (stack.isEmpty() || stack.pop() !== pairs[symb]) {
			return false
		}
	}

	return stack.isEmpty()
}

const flatten = (arr: any[]): any[] => {
  const stack = [...arr]
  const result = []

  while (stack.length) {
    const el = stack.pop()

    if (Array.isArray(el)) {
      stack.push(...el)
    } else {
      result.push(el)
    }
  }

  return result.reverse()
}