export function removeFromArrayByIndex(arr, index) {
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
