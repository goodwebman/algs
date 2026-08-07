const tree = {
  id: 'root',
  name: 'Products',
  children: [
    {
      id: 'electronics',
      name: 'Electronics',
      children: [
        {
          id: 'phones',
          name: 'Phones',
          children: [
            { id: 'iphone', name: 'iPhone' },
            { id: 'pixel', name: 'Google Pixel' }
          ]
        },
        {
          id: 'laptops',
          name: 'Laptops',
          children: [
            { id: 'macbook', name: 'MacBook Pro' }
          ]
        }
      ]
    },
    {
      id: 'clothing',
      name: 'Clothing',
      children: [
        { id: 'tshirts', name: 'T-Shirts' },
        { id: 'hoodies', name: 'Hoodies' }
      ]
    }
  ]
}

const collectLeafNamesDFS = root => {
    const stack = [root]
    const result = []

    while(stack.length) {
        const node = stack.pop()
        if(node.children) {
            stack.push(...node.children)
        }

        if(!node.children) {
            result.push(node.name)
        }
    }

    return result.reverse()
}

console.log(collectLeafNamesDFS(tree))


