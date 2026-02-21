import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const FinanceContext = createContext();

const initialTransactions = [
  { id: uuidv4(), name: 'Servicios del piso', amount: -220, account: 'Unicaja', category: 'Casa', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Internet', amount: -35, account: 'Unicaja', category: 'Casa', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Mercado', amount: -250, account: 'Unicaja', category: 'Casa', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Seguro BBVA', amount: -10, account: 'Unicaja', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Cross y gym', amount: -120, account: 'Unicaja', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Peluqueria', amount: -35, account: 'Unicaja', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Gastos extras', amount: -200, account: 'Unicaja', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Pago iCloud', amount: -2.99, account: 'Unicaja', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Spotify', amount: -11, account: 'Unicaja', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Servicios casa mamá', amount: -5.40, account: 'Davivienda', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Pago de la gata', amount: -45, account: 'Davivienda', category: 'Gastos Personales', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Soe Store', amount: -54, account: 'Unicaja', category: 'Gastos inversiones', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Deudas', amount: -204, account: 'Unicaja', category: 'Gastos inversiones', date: new Date().toISOString(), type: 'expense' },
  { id: uuidv4(), name: 'Ahorro Viaje a Colombia', amount: -300, account: 'Unicaja', category: 'Ahorros', date: new Date().toISOString(), type: 'savings' },
  { id: uuidv4(), name: 'Ahorro Coche', amount: -300, account: 'Unicaja', category: 'Ahorros', date: new Date().toISOString(), type: 'savings' },
  { id: uuidv4(), name: 'Ahorro Emergencia', amount: -200, account: 'Unicaja', category: 'Ahorros', date: new Date().toISOString(), type: 'savings' },
  { id: uuidv4(), name: 'Ahorro Inversion', amount: -100, account: 'Unicaja', category: 'Ahorros', date: new Date().toISOString(), type: 'savings' },
  { id: uuidv4(), name: 'Ahorro Extra', amount: -280, account: 'BBVA', category: 'Ahorros', date: new Date().toISOString(), type: 'savings' },
  { id: uuidv4(), name: 'Salario', amount: 3500, account: 'Unicaja', category: 'Ingresos', date: new Date(new Date().setDate(5)).toISOString(), type: 'income' },
];

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('daystack_finances');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [exchangeRate, setExchangeRate] = useState(4200); // 1 EUR = ~4200 COP (mock default)

  useEffect(() => {
    localStorage.setItem('daystack_finances', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, id: uuidv4() }, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const updateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const calculateTotalBalance = () => {
    return transactions.reduce((acc, current) => acc + current.amount, 0);
  };

  const getExpenses = () => transactions.filter(t => t.type === 'expense');
  const getIncome = () => transactions.filter(t => t.type === 'income');
  const getSavings = () => transactions.filter(t => t.type === 'savings');

  const calculateTotalExpenses = () => getExpenses().reduce((acc, curr) => acc + curr.amount, 0);
  const calculateTotalSavings = () => getSavings().reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  const calculateTotalIncome = () => getIncome().reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      calculateTotalBalance,
      calculateTotalExpenses,
      calculateTotalSavings,
      calculateTotalIncome,
      getExpenses,
      getIncome,
      getSavings,
      exchangeRate,
      setExchangeRate
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
