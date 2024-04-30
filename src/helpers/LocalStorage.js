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
};
