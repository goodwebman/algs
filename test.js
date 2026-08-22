const merge = (intervals) => {
  if (intervals.length < 2) return intervals;

  intervals.sort((a, b) => a[0] - b[0]);

  let result = [intervals[0]];
  for (let interval of intervals) {
    let recent = result[result.length - 1];
    if (recent[1] >= interval[0]) {
      recent[1] = Math.max(interval[1], recent[1]);
    } else {
      result.push(interval);
    }
  }
  return result;
};

// console.log(
//   merge([
//     [1, 3],
//     [2, 6],
//     [8, 10],
//     [15, 18],
//   ]),
// );

const maxProfit = (prices) => {
  let maxProfit = 0;
  for (let i = 0; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      result += prices[i] - prices[i - 1];
    }
  }
  return maxProfit;
};

let trap = (height) => {
  let maxLeft = height[0];
  let maxRight = height[height.length - 1];

  let left = 1; // по краям воды быть не может
  let right = height.length - 2; // по краям воды быть не может
  let total = 0;
  while (left <= right) {
    if (maxLeft <= maxRight) {
      maxLeft = Math.max(maxLeft, height[left]);
      total += maxLeft - height[left];
      left += 1;
    } else {
      maxRight = Math.max(maxRight, height[right]);
      total += maxRight - height[right];
      right -= 1;
    }
  }

  return total;
};

const maxAreaWaterSticks = (height) => {
  let maxArea = 0;
  let left = 0;
  let right = height.length - 1;

  while (left < right) {
    let currentVolume = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(currentVolume, maxArea);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
};

const intersect = (nums1, nums2) => {
  let result = [];

  let map = nums1.reduce((acc, cur) => {
    acc[cur] = acc[cur] ? acc[cur] + 1 : 1;

    return acc;
  }, {});

  for (let i = 0; i < nums2.length; i++) {
    const cur = nums2[i];
    let count = map[cur];
    if (count && count > 0) {
      result.push(cur);
      map[cur] -= 1;
    }
  }

  return result;
};

const stack_poland = (expression) => {
  const arr = expression.split(' ');
  const stack = [];

  while (arr) {
    const el = arr.pop();
    const numberEl = Number(el);
    if (!isNan(numberEl)) {
      stack.push(numberEl);
      continue;
    }

    const firstNum = stack.pop();
    const secondNum = stack.pop();

    switch (el) {
      case '+':
        stack.push(firstNum + secondNum);
        break;
      case '-':
        stack.push(firstNum - secondNum);
        break;
      case '/':
        stack.push(firstNum / secondNum);
        break;
      case '*':
        stack.push(firstNum * secondNum);
        break;
    }
  }
  return stack[0];
};

const flatten = (items) => {
  const stack = [...items];
  const result = [];
  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item);
    }
  }

  return result.reverse();
};

console.log(flatten([1, 2, [1, 2, 3, [1]], [5]]));

const queueTime = (customers, n) => {
  if (!customers.length) return 0;
  const queue = [...customers];
  const tills = Array(Math.min(customers.length, n)).fill(0); // кассы
  while (queue.length) {
    const customer = queue.shift();
    const tillMinIdx = tills.indexOf(Math.min(...tills));
    tills[tillMinIdx] += customer;
  }

  return Math.max(...tills);
};

const isValid = (str) => {
  const stack = [];
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  for (let symb of str) {
    if (!pairs[symb]) {
      stack.push(symb);
    } else if (stack.length === 0 || stack.pop() !== pairs[symb]) {
      return false;
    }
  }
  return stack.length === 0;
};

const maxProfit2 = (prices) => {
  let minPrice = prices[0];
  let maxProfit = 0;

  for (let i = 0; i < prices.length; i++) {
    let current = prices[i];

    if (current < minPrice) {
      minPrice = current;
    }

    if (current - minPrice > maxProfit) {
      maxProfit = current - minPrice;
    }
  }

  return maxProfit;
};

console.log(maxProfit2([2, 4, 7, 1, 9, 2]));

let wall = [
  [1, 2, 2, 1],
  [3, 1, 2],
  [1, 3, 2],
  [2, 4],
  [3, 1, 2],
  [1, 3, 1, 1],
];
const leastBricks = (wall) => {
  let map = {};
  let max = 0;
  wall.forEach((row) => {
    let sum = 0;
    for (let i = 0; i < row.length - 1; i++) {
      sum += row[i];
      map[sum] = map[sum] ? map[sum] + 1 : 1;
      max = Math.max(map[sum], max);
    }
  });

  return wall.length - max;
};

const firstUniqueSymb = (str) => {
  const map = new Map();
  for (let symb of str) {
    if (!map.has(symb)) {
      map.set(symb, 1);
    } else {
      map.set(symb, map.get(symb) + 1);
    }
  }
  for (let i = 0; str.length; i++) {
    if (map.get(str[i]) === 1) {
      return i;
    } else {
      return -1;
    }
  }
};
console.log(firstUniqueSymb('loo'));

const numIslands = (grid) => {
  if (!grid.length) return 0;
  let count = 0;
  let rows = grid.length;
  let cols = grid[0].length;

  const sink = (r, c) => {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        sink(r, c);
      }
    }
  }

  return count;
};

console.log(
  numIslands([
    ['1', '1', '0', '0', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '1', '0', '0'],
    ['0', '0', '0', '1', '1'],
  ]),
); // 3
console.log(
  numIslands([
    ['1', '1', '1', '1', '0'],
    ['1', '1', '0', '1', '0'],
    ['1', '1', '0', '0', '0'],
    ['0', '0', '0', '0', '0'],
  ]),
); // 1
console.log(numIslands([['1', '0', '1', '0', '1']])); // 3
console.log(
  numIslands([
    ['0', '0'],
    ['0', '0'],
  ]),
); // 0
console.log(numIslands([])); // 0

let search = (nums, target) => {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) {
      return mid;
    }

    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target <= nums[mid]) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (nums[mid] <= target && target <= nums[right]) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }

  return -1;
};

const peakIndexInMountainArray = (arr) => {
  let start = 0;
  let end = arr.length - 1;

  while (start < end) {
    let middle = Math.floor((start + end) / 2);
    if (arr[middle] < arr[middle + 1]) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }

  return start;
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let tmp = arr[i];
    let rnd = Math.floor(Math.random() * (i + 1));

    arr[i] = arr[rnd];
    arr[rnd] = tmp;
  }
  return arr;
};

const longestSubstringPalindrom = (str) => {
  let start = 0;
  let end = 0;

  for (let i = 0; i < str.length; i++) {
    let len1 = expandFromCenter(s, i, i);
    let len2 = expandFromCenter(s, i, i + 1);
    let len = Math.max(len1, len2);
    if (len > end - start) {
      start = Math.ceil(i - (len - 1) / 2);
      end = Math.floor(i + len / 2);
    }
  }

  function expandFromCenter(s, L, R) {
    while (L >= 0 && R < s.length && s[L] === s[R]) {
      L--;
      R++;
    }
    return R - L - 1;
  }

  return s.subscring(start, end + 1);
};

const isPalindromeNumber = (x) => {
  if (x < 0) return false;
  if (x % 10 === 0) return false;
  if (x < 10) return true;

  let reversedNum = 0;
  while (x > reversedNum) {
    reversedNum *= 10;
    reversedNum += x % 10;
    x = Math.trunc(x / 10);
  }
  return reversedNum === x || Math.trunc(reversedNum / 10) === x;
};

const setZeroes = (matrix) => {
  let ROWS = matrix.length;
  let COLS = matrix[0].length;
  let isCol = false;
  for (let i = 0; i < ROWS; i++) {
    if (matrix[i][0] === 0) {
      isCol = true;
    }
    for (let j = 1; j < COLS; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  for (let i = 1; i < ROWS; i++) {
    for (let j = 1; j < COLS; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  if (matrix[0][0] === 0) {
    for (let j = 0; j < COLS; j++) {
      matrix[0][j] = 0;
    }
  }

  if (isCol) {
    for (let i = 0; i < ROWS; i++) {
      matrix[i][0] = 0;
    }
  }

  return matrix;
};

function TreeNode(val, left, right) {
  this.val = val === undefined ? 0 : val;
  this.left = left === undefined ? null : left;
  this.right = right === undefined ? null : right;
}
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function (nums) {
  function build(left, right) {
    if (left > right) return null;

    const mid = Math.floor((left + right) / 2);

    const node = new TreeNode(nums[mid]);

    node.left = build(left, mid - 1);
    node.right = build(mid + 1, right);

    return node;
  }

  return build(0, nums.length - 1);
};

var isHappy = function (n) {
  const seen = new Set();
  while (n !== 1) {
    if (seen.has(n)) {
      return false;
    }
    seen.add(n);
    let sum = 0;

    while (n > 0) {
      const digit = n % 10;
      sum += digit * digit;
      n = Math.floor(n / 10);
    }
    n = sum;
  }

  return true;
};

/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function (s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (const char of s) {
    counts[char] = (counts[char] || 0) + 1;
  }
  for (const char of t) {
    if (!counts[char]) return false;

    counts[char]--;
  }
};

var isAnagram = function (s, t) {
  if (s.length !== t.length) return false;
  const counts = {};
  for (const char of s) {
    counts[char] = (counts[char] || 0) + 1;
  }
  for (const char of t) {
    if (!counts[char]) return false;

    counts[char]--;
  }

  return true;
};

var intersection = function (nums1, nums2) {
  const set1 = new Set(nums1);
  const result = new Set();
  for (const num of nums2) {
    if (set1.has(num)) {
      result.add(num);
    }
  }

  return [...result];
};
var longestPalindrome = function (s) {
  const counts = {};

  for (const char of s) {
    counts[char] = (counts[char] || 0) + 1;
  }

  let length = 0;

  for (const char in counts) {
    length += Math.floor(counts[char] / 2) * 2;
  }

  if (length < s.length) {
    length++;
  }

  return length;
};

var numUniqueEmails = function (emails) {
  let map = {};

  for (let email of emails) {
    const [local, domain] = email.split('@');

    const localWithoutDots = local.replaceAll('.', '');

    const [localWithoutPlus] = localWithoutDots.split('+');

    const normalizedEmail = localWithoutPlus + '@' + domain;

    map[normalizedEmail] = true;
  }

  return Object.keys(map).length;
};

var destCity = (paths) => {
  const fromCities = {};
  for (const [from, _] of paths) {
    fromCities[from] = true;
  }
  for (const [_, to] of paths) {
    if (!fromCities[to]) {
      return to;
    }
  }
};

const romanToInt = (s) => {
  const values = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let result = 0;
  for (let i = 0; i < s.length; i++) {
    const current = values[s[i]];
    const next = values[s[i + 1]];
    if (current < next) {
      result -= current;
    } else {
      result += current;
    }
  }

  return result;
};

var isPalindrome = function (s) {
  let formated = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = formated.length - 1;

  while (left < right) {
    if (formated[left] === formated[right]) {
      left++;
      right--;
    } else {
      return false;
    }
  }

  return true;
};

var moveZeroes = function (nums) {
  let write = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[write] = nums[i];
      write++;
    }
  }

  while (write < nums.length) {
    nums[write] = 0;
    write++;
  }
};

let reverseVowels = (s) => {
  const vowels = new Set(['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
  const chars = s.split('');

  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    while (left < right && !vowels.has(chars[left])) {
      left++;
    }

    while (left < right && !vowels.has(chars[right])) {
      right--;
    }

    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }

  return chars.join('');
};

const sortedSquares = (nums) => {
  let left = 0;
  let right = nums.length - 1;
  let index = nums.length - 1;

  const result = new Array(nums.length);
  while (left <= right) {
    const leftSquare = nums[left] * nums[left];
    const rightSquare = nums[right] * nums[right];
    if (leftSquare > rightSquare) {
      result[index] = leftSquare;
      left++;
    } else {
      result[index] = rightSquare;
      right--;
    }
    index--;
  }

  return result;
};

const reverseStr = (s, k) => {
  const chars = s.split('');

  for (let i = 0; i < chars.length; i += 2 * k) {
    let left = i;
    let right = Math.min(i + k - 1, chars.length - 1);

    while (left < right) {
      [chars[left], chars[right]] = [chars[right], chars[left]];
      left++;
      right--;
    }
  }

  return chars.join('');
};
