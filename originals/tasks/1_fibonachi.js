// 1, 1, 2, 3, 5, 8, 13
const fibonachi = n => {
	if (n <= 0) {
		return 0
	}

	if (n <= 2) {
		return 1
	}

	return fibonachi(n - 1) + fibonachi(n - 2)
}

console.log(fibonachi(7))

const iterFib = n => {
	if (n <= 0) {
		return 0
	}

	if (n <= 2) {
		return 1
	}
	let prev = 1
	let result = 1
	for (let i = 0; i < n - 2; i++) {
		let tmp = result
		result += prev
		prev = tmp
	}

	return result
}

console.log(iterFib(7))