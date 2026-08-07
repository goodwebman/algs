// 1 с рекурсией и двумя подмасивами

const quickSort = arr => {
	if (arr.length <= 1) return arr // остановка
	const pivotIndex = Math.floor(arr.length / 2)
	const pivot = arr[pivotIndex]
	const left = []
	const right = []

	for (let i = 0; i < arr.length; i++) {
		if (i === Math.floor(arr.length / 2)) {
			continue
		}

		if (arr[i] < pivot) {
			left.push(arr[i])
		} else {
			right.push(arr[i])
		}
	}

	return quickSort(left).concat(pivot, quickSort(right))
}

// двумя указателями

const partition = (arr, left, right) => {
	const pivot = arr[Math.floor(left + right / 2)]
	let i = left - 1
	let j = right + 1

	while (true) {
		do {
			i++
		} while (arr[i] < pivot)
		do {
			j--
		} while (arr[j] > pivot)
		if (i >= j) return j
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}
}

const quickSort2 = (arr, left = 0, right = arr.length - 1) => {
	if (left >= right) return
	const pivodIndex = partition(arr, left, right)
	quickSort2(arr, left, pivodIndex)
	quickSort2(arr, pivodIndex + 1, right)
}
