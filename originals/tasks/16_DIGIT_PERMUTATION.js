/// O(n · k log k)
const digitPermutation = arr => {
	const map = {}

	arr.forEach(digit => {
		const arrDigit = digit
			.toString()
			.split('')
			.filter(el => el !== '0')
			.sort()
		if (map[arrDigit]) {
			map[arrDigit].push(digit)
		} else {
			map[arrDigit] = [digit]
		}
	})

    return Object.values(map)
}

console.log(digitPermutation([1230, 99, 23001, 123, 111, 300021, 101010, 90000000009, 9]))