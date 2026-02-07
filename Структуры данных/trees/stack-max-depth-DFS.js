 const tree = {
      value: 1,
      children: [
        {
          value: 2,
          children: [
            { value: 5, children: [] },
            { value: 6, children: [] }
          ]
        },
        {
          value: 3,
          children: []
        },
        {
          value: 4,
          children: [
            { value: 7, children: [] }
          ]
        }
      ]
    };

function maxDepth(root) {
  if (!root) return 0;

  let max = 0;
  const stack = [{ node: root, depth: 1 }];

  while (stack.length) {
    const { node, depth } = stack.pop();

    max = Math.max(max, depth);

    if (node.children) {
      for (const child of node.children) {
        stack.push({
          node: child,
          depth: depth + 1
        });
      }
    }
  }

  return max;
}

console.log(maxDepth(tree))