const VaildParentheses = function (s) {
	const pairs = {
		')': '(',
		']': '[',
		'}': '{',
	}

	const stack = []

	for (let symb of s) {
		if (!pairs[symb]) {
			stack.push(symb)
		} else if (stack.length === 0 || stack.pop() !== pairs[symb]) {
			return false
		}
	}

	return stack.length === 0
}
