const isPalindrom = str => {
	const clean = str.toLowerCase().replace(/[^a-z0-9а-я]/g, '')

	let left = 0
	let right = clean.length - 1

	while (left < right) {
		if (clean[left] !== clean[right]) return false
		left++
		right--
	}

	return true
}
