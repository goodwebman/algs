const timeLimited = function(fn, t) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            const timerPromise = new Promise((reject) => {
                setTimeout(() => reject("Time limit exceeded"), t)
            })
            const resultPromise = fn(...args)
            Promise.race([timerPromise, resultPromise])
            .then(resolve)
            .catch(reject)
            .finally(() => clearTimeout(timerPromise))
        })
    }
}