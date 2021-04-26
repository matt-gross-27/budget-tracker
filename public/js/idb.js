let db;

const req = indexedDB.open('budget-tracker', 1);

req.onupgradeneeded = e => {
  const db = e.target.result;
  db.createObjectStore('lineItems', { autoIncrement: true });
};

req.onsuccess = e => {
  db = e.target.result;
};

req.onerror = e => {
  console.log(e.target.errorCode);
};

function storeRecord(record) {
  const transaction = db.transaction(['lineItems'], 'readwrite');
  const budgetObjectStore = transaction.objectStore('lineItems');
  budgetObjectStore.add(record);
}

function postRecords() {
  const transaction = db.transaction(['lineItems'], 'readwrite');
  const budgetObjectStore = transaction.objectStore('lineItems');
  const getRecords = budgetObjectStore.getAll();

  getRecords.onsuccess = () => {
    if (getRecords.result.length > 0) {
      fetch('/api/transaction/bulk', {
        body: JSON.stringify(getRecords.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(serverResponse => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          
          const transaction = db.transaction(['lineItems'], 'readwrite');
          const budgetObjectStore = transaction.objectStore('lineItems');
          budgetObjectStore.clear();

          console.log('uploaded offline transactions');
        })
        .catch(err => console.log(err));
    }
  }
}

window.addEventListener('online', postRecords);