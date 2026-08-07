const martrix = ['XOOXO', 'XOOXO', 'OOOXO', 'XXOXO', 'OXOOO']

function perimiter(martrix) {
	let p = 0
	for (let i = 0; i < martrix.length; i++) {
		for (let j = 0; j < martrix[i].length; j++) {
			if (martrix[i][j] === 'X') {
				p += j === 0 || martrix[i][j - 1] === 'O'
				p += i === 0 || martrix[i - 1][j] === 'O'
				p += i === martrix.length - 1 || martrix[i + 1][j] === 'O'
				p += j === martrix[i].length - 1 || martrix[i][j + 1] === 'O'
			}
		}
	}
	return p
}

console.log(perimiter(martrix))
