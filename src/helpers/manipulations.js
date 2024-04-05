// Function to check if object with a specific ID exists in the array
function isObjectExists(arr, id) {
  // some() It returns true if at least one element in the array passes the test, otherwise it returns false.
  return arr.some((obj) => obj.id == id);
}

// Function to push object to array if it doesn't exist
function addObjectIfNotExists(arr, newObj) {
  // below fuction retun false bcoz it fails the test case so !false = true
  if (!isObjectExists(arr, newObj.id)) {
    arr.push(newObj);
  }
}

export { isObjectExists, addObjectIfNotExists };
