var MinStack = function() {
    this.stack = []
    this.minStack = []
};

MinStack.prototype.push = function(val) {
    this.stack.push(val)

    // если minStack пуст или новый элемент меньше текущего минимума
    if (
        this.minStack.length === 0 || 
        val <= this.minStack[this.minStack.length - 1]
    ) {
        this.minStack.push(val)
    }
};

MinStack.prototype.pop = function() {
    const removed = this.stack.pop()

    // если удаляем минимальный элемент — убираем и из minStack
    if (removed === this.minStack[this.minStack.length - 1]) {
        this.minStack.pop()
    }
};

MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1]
};

MinStack.prototype.getMin = function() {
    return this.minStack[this.minStack.length - 1]
};
