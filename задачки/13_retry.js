function retry(promiseFn, config) {
	let retryCount = 0

	return new Promise((resolve, reject) => {
		tryPromiseFn()
		function tryPromiseFn() {
			try {
				promiseFn()
					.then(res => resolve(res))
					.catch(() => {
						retryCount += 1
						if (retryCount > config.count) {
							return reject(new Error('Количество попыток исчерпано'))
						}
						const delayMs = config.delay(retryCount)
						setTimeout(() => {
							tryPromiseFn()
						}, delayMs)
					})
			} catch (err) {
				console.error(err)
			}
		}
	})
}
