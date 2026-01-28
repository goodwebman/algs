function boolTargetNumber(array, target) {
	let left = 0
	let right = array.length - 1

	while (left <= right) {
		const sum = array[left] + array[right]
		if (sum === target) {
			return true
		} else if (sum < target) {
			left++
		} else {
			right--
		}
	}
	return false
}

console.log(
	boolTargetNumber(
		[
			1, 2, 3, 4, 5, 6, 7, 8, 100, 500, 621, 1000
		],
		625,
	),
)
