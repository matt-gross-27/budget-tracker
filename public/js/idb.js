let db;

const req = indexedDB.open('budget-tracker', 1);

req.onupgradeneeded = e => {
  const db = e.target.result;
  db.createObjectStore('lineItems', { autoIncrement: true });
};

req.onsuccess = e => {
  db = e.target.result;
  if (navigator.onLine) {
    postRecords();
  }
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
        method: 'POST',
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

function updateTransactions() {
  indexedDB.open("budget-tracker").onsuccess = e => {
    const idbTx = db.transaction(['lineItems'], 'readonly');
    idbTx.onerror = (err) => console.log(err);
    idbTx.oncomplete = (e) => {
      transactions = [...getRecords.result.reverse(), ...transactions];
      
      populateChart();
      populateTable();
      populateTotal();
    }
    const idbStore = idbTx.objectStore('lineItems');
    getRecords = idbStore.getAll();
    getRecords.onerror = (err) => console.log(err)
  }
}