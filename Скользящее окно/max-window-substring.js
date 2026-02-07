const longestSubstringLength = s => {
    let left = 0
    let ans = ''

    const chars = new Set()

    for (let right = 0; right < s.length; right++) {
        const char = s[right]

        while (chars.has(char)) {
            chars.delete(s[left])
            left++
        }

        chars.add(char)

        if (right - left + 1 > ans.length) {
            ans = s.slice(left, right + 1)
        }
    }

    return ans
}

console.log(longestSubstringLength('pwwkew')) // "wke"
