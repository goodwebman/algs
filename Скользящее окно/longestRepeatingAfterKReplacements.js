const longestRepeatingAfterKReplacements = (s, k) => {
	const freq = new Map()

	let left = 0
	let maxCount = 0
	let maxLen = 0

	for (let right = 0; right < s.length; right++) {
		const char = s[right]

		freq.set(char, (freq.get(char) || 0) + 1)
		maxCount = Math.max(maxCount, freq.get(char))

		while (right - left + 1 - maxCount > k) {
			const leftChar = s[left]
			freq.set(left, freq.get(leftChar) - 1)
			left++
		}

		maxLen = Math.max(maxLen, right - left + 1)
	}
	return maxLen
}
