// O(n * sum)
// где:
// • n — количество типов монет
// • sum — сумма, которую разменяем

const coins = [25, 10, 5, 2, 1]

function coinChangeGreedy(sum) {
    const result = []
    for(let coin of coins) {
        while(sum >= coin) {
            sum -= coin
            result.push(coin)
        }
    }
    return result
}

console.log(coinChangeGreedy(63))