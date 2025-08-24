function getLocalStorage() {
  let localStorageArr;
  if (localStorage.getItem("pnrData")) {
    localStorageArr = JSON.parse(localStorage.getItem("pnrData"));
  } else {
    localStorageArr = [];
  }
  return localStorageArr;
}

function setLocalStorage(dataArr) {
  console.log(dataArr);
  localStorage.setItem("pnrData", JSON.stringify(dataArr));
}

function clearBrowserStorage() {
  localStorage.clear();
  sessionStorage.clear();
}

function getSessionStorage(key) {
  let sessionStorageArr;
  if (sessionStorage.getItem(key) === null) {
    sessionStorageArr = [];
  } else {
    sessionStorageArr = JSON.parse(sessionStorage.getItem(key));
  }
  return sessionStorageArr;
}

function setSessionStorage(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export {
  getLocalStorage,
  setLocalStorage,
  getSessionStorage,
  setSessionStorage,
  clearBrowserStorage,
};
