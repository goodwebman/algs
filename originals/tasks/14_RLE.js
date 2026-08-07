const rle = str => {
	if (!str.length) return ""

	let result = ""
	let count = 1

	for (let i = 1; i <= str.length; i++) {
		if (str[i] === str[i - 1]) {
			count++
		} else {
			result += str[i - 1]
			if (count > 1) {
				result += count
			}
			count = 1
		}
	}

	return result
}
