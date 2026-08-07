const lengthOfLongestSubstringKDistinct = (str, k) => {
    const freq = new Map()
    let left = 0
    let ans = 0

    for (let right = 0; right < str.length; right++) {
        freq.set(str[right], (freq.get(str[right]) || 0) + 1)

        while (freq.size > k) {
            freq.set(str[left], freq.get(str[left]) - 1)
            if (freq.get(str[left]) === 0) {
                freq.delete(str[left])
            }
            left++
        }

        ans = Math.max(ans, right - left + 1)
    }

    return ans
}
