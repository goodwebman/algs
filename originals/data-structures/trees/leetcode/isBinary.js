const isValidBST = root => {
    const stack = []
    let prev = -Infinity
    let current = root

    while (stack.length || current) {
        while (current) {
            stack.push(current)
            current = current.left
        }

        current = stack.pop()

        if (current.val <= prev) return false
        prev = current.val

        current = current.right
    }

    return true
}

console.log(isValidBST([4,2,6,1,3,5,7]))

//       4
//      / \
//     2   6
//    / \ / \
//   1  3 5  7