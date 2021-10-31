let db;
const request = indexedDB.open("budgettracker", 1);


request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("newbudget", { autoIncrement: true });
};


request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    uploadBudget;
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["newbudget"], "readwrite");
    const budgetStore = transaction.objectStore("newbudget");
    budgetStore.add(record);
}

function uploadBudget() {
  const transaction = db.transaction(["newbudget"], "readwrite");
  const budgetStore = transaction.objectStore("newbudget");
  const getAll = budgetStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }

          const transaction = db.transaction(["newbudget"], "readwrite");
          const budgetStore = transaction.objectStore("newbudget");
          budgetStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener('online', uploadBudget);