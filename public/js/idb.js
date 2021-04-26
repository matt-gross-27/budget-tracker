let db;

const req = indexedDB.open('budget-tracker', 1);

req.onupgradeneeded = e => {
  const db = e.target.result;
  db.createObjectStore('new_record', { autoIncrement: true });
};

req.onsuccess = e => {
  db = e.target.result;
};

req.onerror = e => {
  console.log(e.target.errorCode);
};

function storeRecord(record) {
  const idbTransaction = db.transaction(['new_record'], 'readwrite');
  const budgetObjectStore = idbTransaction.objectStore('new_record');
  budgetObjectStore.add(record);
}

function returnRecords() {
  const idbTransaction = db.transaction(['new_record'], 'readwrite');
  const budgetObjectStore = idbTransaction.objectStore('new_record');
  const getRecords = budgetObjectStore.getAll();

  return getRecords.onsuccess = () => {
    return getRecords.result
  }
}

function postRecords() {
  const idbTransaction = db.transaction(['new_record'], 'readwrite');
  const budgetObjectStore = idbTransaction.objectStore('new_record');
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
          
          const idbTransaction = db.transaction(['new_record'], 'readwrite');
          const budgetObjectStore = idbTransaction.objectStore('new_record');
          budgetObjectStore.clear();

          console.log('uploaded offline transactions');
        })
        .catch(err => console.log(err));
    }
  }
}

window.addEventListener('online', postRecords);