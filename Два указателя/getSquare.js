// O(n) - линейная
function getSquary(array) {
	const results = []
	let left = 0
	let right = array.length - 1

	while (left <= right) {
		const leftSquare = array[left] ** 2
		const rightSquare = array[right] ** 2
		if (leftSquare > rightSquare) {
			results.unshift(leftSquare)
			left++
		} else {
			results.unshift(rightSquare)
			right--
		}
	}

    return results
}

const case1 = [-3, 2, 4]
const case2 = [-2, -1, 3, 5]

console.log(getSquary(case2))