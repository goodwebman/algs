const dailyTemperatures = temps => {
    const res = new Array(temps.length).fill(0)
    const stack = []
    for (let i = 0; i < temps.length ; i++) {
        while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
            const prevIndex = stack.pop()
            res[prevIndex] = i - prevIndex
        }

        stack.push(i)
    }

    return res
}