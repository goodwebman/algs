const deepEqual = (a, b) => {
	if (a === b) return true

	if (
		typeof a !== 'object' ||
		typeof b !== 'object' ||
		a === null ||
		b === null
	) {
		return false
	}

	const keysA = Object.keys(a)
	const keysB = Object.keys(b)

	if (keysA.length !== keysB.length) return false

	return keysA.every(key => keysB.includes(key) && deepEqual(a[key], b[key]))
}
