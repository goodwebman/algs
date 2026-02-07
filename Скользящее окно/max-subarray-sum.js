const maxSubarraySum = (nums, k) => {
    if (k > nums.length) return 0;
    
    let maxSum = -Infinity
    let windowSum = 0
    let left = 0
    for (let right = 0; right < nums.length; right++) {

        windowSum += nums[right]

        if (right - left + 1 === k) {
            maxSum = Math.max(maxSum, windowSum)

            windowSum -= nums[left]
            left++
        }
    }

    return maxSum
}

nums = [2, 1, 5, 1, 3, 2]

console.log(maxSubarraySum(nums, 3))