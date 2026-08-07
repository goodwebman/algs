var orangesRotting = function(grid) {
    const rows = grid.length
    const cols = grid[0].length

    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ]

    const queue = []
    let fresh = 0
    let minutes = 0

    // init
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 2) queue.push([r, c])
            if (grid[r][c] === 1) fresh++
        }
    }

    while (queue.length && fresh > 0) {
        const levelSize = queue.length

        for (let i = 0; i < levelSize; i++) {
            const [r, c] = queue.shift()

            for (const [dr, dc] of directions) {
                const nr = r + dr
                const nc = c + dc

                if (
                    nr >= 0 && nr < rows &&
                    nc >= 0 && nc < cols &&
                    grid[nr][nc] === 1
                ) {
                    grid[nr][nc] = 2
                    fresh--
                    queue.push([nr, nc])
                }
            }
        }

        minutes++
    }

    return fresh === 0 ? minutes : -1
}
