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
        setTransactions([{ ...transaction, id: uuidv4() }, ...transactions]);
    };

    const deleteTransaction = (id) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const updateTransaction = (updatedTransaction) => {
        setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
    };

    const calculateTotalBalance = () => {
        return transactions
            .filter(t => t.type !== 'savings')
            .reduce((acc, current) => acc + current.amount, 0);
    };

    const getExpenses = () => transactions.filter(t => t.type === 'expense');
    const getIncome = () => transactions.filter(t => t.type === 'income');
    const getSavings = () => transactions.filter(t => t.type === 'savings');

    const calculateTotalExpenses = () => getExpenses().reduce((acc, curr) => acc + curr.amount, 0);
    const calculateTotalSavings = () => getSavings().reduce((acc, curr) => acc + curr.amount, 0);
    const calculateTotalIncome = () => getIncome().reduce((acc, curr) => acc + curr.amount, 0);

    // --- Monthly Expected Expenses (Panel / Tabla Mensual) ---
    const addMonthlyExpense = (expense) => {
        setMonthlyExpenses([...monthlyExpenses, { ...expense, id: uuidv4(), isPaid: false }]);
    };

    const updateMonthlyExpense = (updatedExpense) => {
        setMonthlyExpenses(monthlyExpenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    };

    const deleteMonthlyExpense = (id) => {
        setMonthlyExpenses(monthlyExpenses.filter(e => e.id !== id));
    };

    const toggleMonthlyExpensePaid = (id) => {
        setMonthlyExpenses(monthlyExpenses.map(e => {
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
        return monthlyExpenses
            .filter(e => !e.isPaid)
            .reduce((acc, curr) => acc + curr.amount, 0);
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
            exchangeRate,
            setExchangeRate
        }}>
            {children}
        </FinanceContext.Provider>
    );
};
