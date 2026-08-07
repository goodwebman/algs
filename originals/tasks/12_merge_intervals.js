const merge = intervals => {
	if (!intervals.length) return []

	intervals.sort((a, b) => a[0] - b[0])

	const res = []
	let prevIntervals = intervals[0]

	for (let i = 1; i < intervals.length; i++) {
		const curInterval = intervals[i]

		if (curInterval[0] <= prevIntervals[1]) {
			prevIntervals[1] = Math.max(prevIntervals[1], curInterval[1])
		} else {
			res.push(prevIntervals)
			prevIntervals = curInterval
		}
	}

	res.push(prevIntervals)

	return res
}
