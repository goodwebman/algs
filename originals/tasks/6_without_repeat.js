// [1, 1, 2, 2, 3, 4, 5, 5]

const withoutRepeat = arr => {
	const map = {}
	const result = []
	for (const item of arr) {
		if (!map[item]) {
			map[item] = 1
		} else {
			map[item] += 1
		}
	}
	for (let i = 0; i < arr.length; i++) {
		const item = arr[i]
		if (map[item] === 1) {
			result.push(item)
		}
	}
	return result
}

console.log(withoutRepeat([1, 1, 2, 2, 3, 4, 5, 5]))
