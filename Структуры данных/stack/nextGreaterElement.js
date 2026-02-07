const nextGreaterElement = nums => {
    const res = new Array(nums.length).fill(-1)
    const stack = []
    for (let i = 0; i < nums.length; i++) {
        const current = nums[i]
        while (stack.length && nums[stack[stack.length - 1]] < current) {
            const idx = stack.pop()
            res[idx] = current
        }
        stack.push(i)
    }
    return res
}

console.log(nextGreaterElement([2, 5, 3, 7, 1]))