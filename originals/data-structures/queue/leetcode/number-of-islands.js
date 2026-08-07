// Input: grid = [
//   ["1","1","1","1","0"],
//   ["1","1","0","1","0"],
//   ["1","1","0","0","0"],
//   ["0","0","0","0","0"]
// ]
// Output: 1


var numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;

    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    // Четыре направления движения
    const directions = [
        [1, 0],   // вниз
        [-1, 0],  // вверх
        [0, 1],   // вправо
        [0, -1]   // влево
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === "1") {
                count++;
                // Начинаем BFS
                const queue = [[r, c]];
                grid[r][c] = "0"; // помечаем посещённым

                while (queue.length > 0) {
                    const [x, y] = queue.shift();

                    for (const [dx, dy] of directions) {
                        const nx = x + dx;
                        const ny = y + dy;

                        if (
                            nx >= 0 && nx < rows &&
                            ny >= 0 && ny < cols &&
                            grid[nx][ny] === "1"
                        ) {
                            grid[nx][ny] = "0"; // помечаем посещённым
                            queue.push([nx, ny]);
                        }
                    }
                }
            }
        }
    }

    return count;
};
