// tbank
const maxHappiness = friends => {
    friends.sort((a, b) => a[0] - b[0])

    let maxHappiness = 0
    let windowSize = 0
    let left = 0

    for (let right = 0; right < friends.length; right++) {
        windowSize += friends[right][1]

        while (friends[right][0] >= 2 * friends[left][0]) {
            windowSize -= friends[left][1]
            left++
        }

        maxHappiness = Math.max(maxHappiness, windowSize)
    }

    return maxHappiness
}