function getLocalStorage() {
  let localStorageArr;
  if (localStorage.getItem("pnrData") === null) {
    localStorageArr = [];
  } else {
    localStorageArr = JSON.parse(localStorage.getItem("pnrData"));
  }
  return localStorageArr;
}

function setLocalStorage(dataArr) {
  localStorage.setItem("pnrData", JSON.stringify(dataArr));
}

export { getLocalStorage, setLocalStorage };
