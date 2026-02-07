const longesOnes = nums => {
	let left = 0
	let zeroes = 0
	let ans = 0

	for (let right = 0; right < nums.length; right++) {
		if (nums[right] === 0) zeroes += 1

		while (zeroes > 1) {
			if (nums[left] === 0) {
				zeroes -= 1
			}
			left++
		}
		ans = Math.max(ans, right - left)
	}

	return ans
}

console.log(longesOnes([1, 1, 0, 1, 1, 1]))
