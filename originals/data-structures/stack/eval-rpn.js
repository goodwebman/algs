const evalRPN = tokens => {
  const stack = []

  for (const token of tokens) {

    if (token === "+" || token === "-" || token === "*" || token === "/") {
      const b = stack.pop()
      const a = stack.pop()

      if (token === "+") stack.push(a + b)
      else if (token === "-") stack.push(a - b)
      else if (token === "*") stack.push(a * b)
      else if (token === "/") stack.push(Math.trunc(a / b))

    } else {
      stack.push(Number(token))
    }
  }

  return stack[0]
}


// Примеры
console.log(evalRPN(["2","1","+","3","*"])) // 9
console.log(evalRPN(["4","13","5","/","+"])) // 6
console.log(evalRPN(["10","6","9","3","+","-11","*","/","*","17","+","5","+"])) // 22
