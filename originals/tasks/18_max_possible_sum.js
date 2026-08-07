// tbank

const maxPossibleSum = arr => {
    let absSum = 0
    let minAbs = Infinity
    let negCount = 0

    for (const x of arr) {
        if (x < 0) negCount++

        const ax = Math.abs(x)
        absSum += ax
        minAbs = Math.min(minAbs, ax)
    }

    if (negCount % 2 === 0) {
        return absSum
    }

    return absSum - 2 * minAbs
}

console.log(maxPossibleSum([-2, 1, 3]))