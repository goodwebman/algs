//twoSum([2, 7, 11, 15], 9) // [0, 1]

// 9 - 2 = 7

// Map (key, value)
// key = diff, value = idx
// {7 => 0}
const twoSum = (nums, target) => {
	const map = new Map()

	for (let i = 0; i < nums.length; i++) {
		const diff = target - nums[i]

		if (map.has(diff)) {
			return [map.get(diff), i]
		}

		map.set(nums[i], i)
	}
}
console.log(twoSum([3, 2, 4], 6))
