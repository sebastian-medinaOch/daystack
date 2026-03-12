import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const FinanceContext = createContext();

const initialTransactions = [];

const initialMonthlyExpenses = [];

export const FinanceProvider = ({ children }) => {
    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('daystack_finances');
        return saved ? JSON.parse(saved) : initialTransactions;
    });

    const [monthlyExpenses, setMonthlyExpenses] = useState(() => {
        const saved = localStorage.getItem('daystack_monthly_expenses');
        return saved ? JSON.parse(saved) : initialMonthlyExpenses;
    });

    const [exchangeRate, setExchangeRate] = useState(4200); // 1 EUR = ~4200 COP (mock default)

    useEffect(() => {
        localStorage.setItem('daystack_finances', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('daystack_monthly_expenses', JSON.stringify(monthlyExpenses));
    }, [monthlyExpenses]);

    const addTransaction = (transaction) => {
        setTransactions(prev => [{ ...transaction, id: uuidv4() }, ...prev]);
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    };

    const updateTransaction = (updatedTransaction) => {
        setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    };

    const calculateTotalBalance = () => {
        const total = transactions
            .filter(t => t.type !== 'savings')
            .reduce((acc, current) => acc + current.amount, 0);
        return Math.round(total * 100) / 100;
    };

    const getExpenses = () => transactions.filter(t => t.type === 'expense');
    const getIncome = () => transactions.filter(t => t.type === 'income');
    const getSavings = () => transactions.filter(t => t.type === 'savings');

    const calculateTotalExpenses = () => Math.round(getExpenses().reduce((acc, curr) => acc + curr.amount, 0) * 100) / 100;
    const calculateTotalSavings = () => Math.round(getSavings().reduce((acc, curr) => acc + curr.amount, 0) * 100) / 100;
    const calculateTotalIncome = () => Math.round(getIncome().reduce((acc, curr) => acc + curr.amount, 0) * 100) / 100;

    // --- Monthly Expected Expenses (Panel / Tabla Mensual) ---
    const addMonthlyExpense = (expense) => {
        setMonthlyExpenses(prev => [...prev, { ...expense, id: uuidv4(), isPaid: false }]);
    };

    const updateMonthlyExpense = (updatedExpense) => {
        setMonthlyExpenses(prev => prev.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    };

    const deleteMonthlyExpense = (id) => {
        setMonthlyExpenses(prev => prev.filter(e => e.id !== id));
    };

    const toggleMonthlyExpensePaid = (id) => {
        setMonthlyExpenses(prev => prev.map(e => {
            if (e.id === id) {
                const newIsPaid = !e.isPaid;
                // Automatically create a transaction if marked as paid
                if (newIsPaid) {
                    addTransaction({
                        name: e.name,
                        amount: -Math.abs(e.amount),
                        type: 'expense',
                        account: 'Unicaja', // default account
                        category: 'Pagos Mensuales',
                        date: new Date().toISOString()
                    });
                }
                return { ...e, isPaid: newIsPaid };
            }
            return e;
        }));
    };

    const calculateExpectedExpenses = () => {
        const total = monthlyExpenses
            .filter(e => !e.isPaid)
            .reduce((acc, curr) => acc + curr.amount, 0);
        return Math.round(total * 100) / 100;
    };

    const resetData = () => {
        setTransactions([]);
        setMonthlyExpenses([]);
    };

    const transferFunds = (amount, direction) => {
        const date = new Date().toISOString();
        const absAmount = Math.round(Math.abs(parseFloat(amount)) * 100) / 100;
        if (isNaN(absAmount) || absAmount <= 0) return;

        if (direction === 'balance_to_savings') {
            addTransaction({
                name: 'Transfer to Savings',
                amount: -absAmount,
                type: 'expense',
                account: 'Internal Transfer',
                category: 'Transfer',
                date: date
            });
            addTransaction({
                name: 'Transfer from Balance',
                amount: absAmount,
                type: 'savings',
                account: 'Internal Transfer',
                category: 'Transfer',
                date: date
            });
        } else if (direction === 'savings_to_balance') {
            addTransaction({
                name: 'Transfer to Balance',
                amount: -absAmount,
                type: 'savings',
                account: 'Internal Transfer',
                category: 'Transfer',
                date: date
            });
            addTransaction({
                name: 'Transfer from Savings',
                amount: absAmount,
                type: 'income',
                account: 'Internal Transfer',
                category: 'Transfer',
                date: date
            });
        }
    };

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
            monthlyExpenses,
            addMonthlyExpense,
            updateMonthlyExpense,
            deleteMonthlyExpense,
            toggleMonthlyExpensePaid,
            calculateExpectedExpenses,
            transferFunds,
            resetData,
            exchangeRate,
            setExchangeRate
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
