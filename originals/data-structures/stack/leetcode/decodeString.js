// Example 1:

// Input: s = "3[a]2[bc]"
// Output: "aaabcbc"
// Example 2:

// Input: s = "3[a2[c]]"
// Output: "accaccacc"
// Example 3:

// Input: s = "2[abc]3[cd]ef"
// Output: "abcabccdcdcdef"


var decodeString = function (s) {
    const stack = []

    let currentStr = ""
    let currentNum = 0

    for (let char of s) {
        if (char >= '0' && char <= '9') {
            currentNum = currentNum * 10 + Number(char)
        }

        else if (char === '[') {
            stack.push(currentStr)
            stack.push(currentNum)

            currentStr = ''
            currentNum = 0
        } else if (char === ']') {
            const num = stack.pop()
            const prevStr = stack.pop()

            currentStr = prevStr + currentStr.repeat(num)
        } else {
            currentStr += char
        }
    }

    return currentStr
};