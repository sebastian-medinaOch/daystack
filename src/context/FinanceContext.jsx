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
    { id: uuidv4(), name: 'Ahorro Inversion', amount: 100, account: 'Unicaja', category: 'Ahorros', date: new Date().toISOString(), type: 'savings' },
    { id: uuidv4(), name: 'Ahorro Extra', amount: 280, account: 'BBVA', category: 'Ahorros', date: new Date().toISOString(), type: 'savings' },
    { id: uuidv4(), name: 'Salario', amount: 3500, account: 'Unicaja', category: 'Ingresos', date: new Date(new Date().setDate(5)).toISOString(), type: 'income' },
];

const initialMonthlyExpenses = [
    { id: uuidv4(), name: 'Arriendo', amount: 600, isPaid: false },
    { id: uuidv4(), name: 'Servicios del piso', amount: 220, isPaid: false },
    { id: uuidv4(), name: 'Internet', amount: 35, isPaid: false },
    { id: uuidv4(), name: 'Mercado', amount: 250, isPaid: false },
    { id: uuidv4(), name: 'Seguro BBVA', amount: 10, isPaid: false },
    { id: uuidv4(), name: 'Datos', amount: 15, isPaid: false },
    { id: uuidv4(), name: 'Cross y gym', amount: 120, isPaid: false },
    { id: uuidv4(), name: 'Peluqueadas', amount: 35, isPaid: false },
    { id: uuidv4(), name: 'Gastos extras', amount: 200, isPaid: false },
    { id: uuidv4(), name: 'Pago Icloud', amount: 2.99, isPaid: false },
    { id: uuidv4(), name: 'Spotify', amount: 11, isPaid: false },
    { id: uuidv4(), name: 'HBO', amount: 7, isPaid: false },
    { id: uuidv4(), name: 'Google', amount: 1.80, isPaid: false },
    { id: uuidv4(), name: 'Servicios casa mama', amount: 5.40, isPaid: false },
    { id: uuidv4(), name: 'Pago de la gata', amount: 45, isPaid: false },
    { id: uuidv4(), name: 'Soe Store', amount: 54, isPaid: false },
    { id: uuidv4(), name: 'Deudas', amount: 204, isPaid: false },
    { id: uuidv4(), name: 'Comodín', amount: 100, isPaid: false },
    { id: uuidv4(), name: 'Ahorro Viaje a Colombia', amount: 300, isPaid: false },
    { id: uuidv4(), name: 'Ahorro Coche', amount: 300, isPaid: false },
    { id: uuidv4(), name: 'Ahorro Emergencia', amount: 200, isPaid: false },
    { id: uuidv4(), name: 'Ahorro Inversion', amount: 100, isPaid: false },
    { id: uuidv4(), name: 'Ahorro Extra', amount: 280, isPaid: false },
];

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
