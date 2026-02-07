const threeSum = nums => {
  nums.sort((a, b) => a - b)

  const res = []

  for (let i = 0; i < nums.length - 2; i++) {

    let left = i + 1
    let right = nums.length - 1

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]

      if (sum === 0) {
        res.push([nums[i], nums[left], nums[right]])
        left++
        right--
      } 
      else if (sum < 0) {
        left++
      } 
      else {
        right--
      }
    }
  }

  return res
}


console.log(threeSum([-1,0,1,2,-1,-4]))
