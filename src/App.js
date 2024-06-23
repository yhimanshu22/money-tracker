import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  const REACT_APP_API_URL = 'http://localhost:4000';

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    try {
      const url = `${REACT_APP_API_URL}/api/transactions`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return []; // Return empty array on error to prevent crashing
    }
  }

  async function addNewTransaction(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const price = parseFloat(name.split(' ')[0]); // Parse price from input
    const transactionName = name.substring(price.toString().length + 1); // Extract transaction name

    const url = `${REACT_APP_API_URL}/api/transaction`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price, name: transactionName, description, datetime }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log('Transaction created successfully:', json);

      // Reset form fields after successful submission
      setName('');
      setDatetime('');
      setDescription('');

      // Refresh transactions after adding a new one
      await refreshTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  }

  async function refreshTransactions() {
    const updatedTransactions = await getTransactions();
    setTransactions(updatedTransactions);
  }

  let balance = transactions.reduce((acc, transaction) => acc + transaction.price, 0).toFixed(2);

  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>${balance}<span>.{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="+200 new samsung tv"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
          />
        </div>

        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="description"
          />
        </div>

        <button type="submit">Add New Transaction...</button>
      </form>

      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction, index) => (
            <div className="transaction" key={index}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                  {transaction.price}
                </div>
                <div className="datetime">{transaction.datetime}</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
