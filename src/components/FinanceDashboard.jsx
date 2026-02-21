import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Send, Download, Plus, Search, Settings, ArrowRightLeft } from 'lucide-react';
import FinanceTransactionModal from './FinanceTransactionModal';
import FinanceMonthlyExpenseModal from './FinanceMonthlyExpenseModal';
import './FinanceDashboard.css';

const FinanceDashboard = () => {
    const {
        transactions,
        calculateTotalBalance,
        calculateExpectedExpenses,
        monthlyExpenses,
        toggleMonthlyExpensePaid,
        calculateTotalSavings,
        getSavings,
        exchangeRate
    } = useContext(FinanceContext);

    const [currencyMode, setCurrencyMode] = useState('EUR_TO_COP'); // 'EUR_TO_COP' or 'COP_TO_EUR'
    const [amountToConvert, setAmountToConvert] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [defaultModalType, setDefaultModalType] = useState('expense');
    const [hideModalTypeSelector, setHideModalTypeSelector] = useState(false);

    const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
    const [editingMonthlyExpense, setEditingMonthlyExpense] = useState(null);

    // Currency Converter State
    const [eurAmount, setEurAmount] = useState('');
    const [copAmount, setCopAmount] = useState('');

    const handleEurChange = (e) => {
        const value = e.target.value;
        setEurAmount(value);
        setCopAmount(value ? (parseFloat(value) * exchangeRate).toFixed(2) : '');
    };

    const handleCopChange = (e) => {
        const value = e.target.value;
        setCopAmount(value);
        setEurAmount(value ? (parseFloat(value) / exchangeRate).toFixed(2) : '');
    };

    const totalBalance = calculateTotalBalance();
    const totalExpectedExpenses = calculateExpectedExpenses();

    const handleConvert = () => {
        if (!amountToConvert) return '0.00';
        const amount = parseFloat(amountToConvert);
        if (isNaN(amount)) return '0.00';

        if (currencyMode === 'EUR_TO_COP') {
            return (amount * exchangeRate).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
        } else {
            return (amount / exchangeRate).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
        }
    };

    const getInitials = (name) => {
        return name.substring(0, 2).toUpperCase();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    }

    const handleOpenModal = (tx = null, defaultType = 'expense', hideTypeSelector = false) => {
        setEditingTx(tx);
        setDefaultModalType(defaultType);
        setHideModalTypeSelector(hideTypeSelector);
        setIsModalOpen(true);
    };

    const handleOpenMonthlyModal = (expense = null) => {
        setEditingMonthlyExpense(expense);
        setIsMonthlyModalOpen(true);
    };

    return (
        <div className="finance-dashboard animate-fade-in">
            {/* Header Area */}
            <header className="finance-header">
                <div className="finance-logo">
                    <div className="logo-pulse"></div>
                    <h2>Bankio</h2>
                    <nav className="finance-nav">
                        <button className="nav-btn active">All</button>
                        <button className="nav-btn">Transactions</button>
                        <button className="nav-btn" onClick={() => handleOpenModal()}>+ New Record</button>
                    </nav>
                </div>

                <div className="finance-header-actions">
                    <div className="search-bar">
                        <Search size={16} />
                        <input type="text" placeholder="Search" />
                    </div>
                    <button className="icon-btn"><RefreshCw size={20} /></button>
                    <button className="icon-btn"><Settings size={20} /></button>
                    <div className="user-avatar">
                        <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User" />
                    </div>
                </div>
            </header>

            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="grid-col-left">

                    {/* Total Balance Card */}
                    <div className="glass-card balance-card">
                        <h4>Total Balance</h4>
                        <div className="balance-amount">{formatCurrency(totalBalance)}</div>
                        <div className="balance-expected" style={{ marginTop: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                            <span className="expected-label" style={{ fontWeight: 500 }}>Total a gastar mensual: </span>
                            <span className="expected-value" style={{ fontSize: '1.2rem', color: 'var(--danger)', fontWeight: 700 }}>
                                {formatCurrency(totalExpectedExpenses)}
                            </span>
                        </div>
                        <div className="balance-actions" style={{ marginTop: '16px' }}>
                            <button className="action-pill" onClick={() => handleOpenModal(null, 'income', true)}><Download size={16} /> Receive</button>
                        </div>

                        <div className="currency-converter-section" style={{ marginTop: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h5>Quick Convert</h5>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 EUR = {exchangeRate} COP</span>
                            </div>
                            <div className="converter-inputs" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '16px' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>EUR (€)</label>
                                    <input
                                        type="number"
                                        value={eurAmount}
                                        onChange={handleEurChange}
                                        placeholder="0.00"
                                        style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600, outline: 'none' }}
                                    />
                                </div>
                                <div className="converter-icon" style={{ color: 'var(--text-secondary)', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>
                                    <ArrowRightLeft size={16} />
                                </div>
                                <div className="input-group" style={{ flex: 1, textAlign: 'right' }}>
                                    <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>COP ($)</label>
                                    <input
                                        type="number"
                                        value={copAmount}
                                        onChange={handleCopChange}
                                        placeholder="0"
                                        style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: 600, outline: 'none', textAlign: 'right' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transactions List */}
                    <div className="glass-card transactions-card">
                        <div className="card-header">
                            <h4>Transactions</h4>
                            <button className="see-all-btn">See All</button>
                        </div>
                        <div className="transactions-list">
                            {transactions.filter(t => t.type !== 'savings').slice(0, 6).map((tx) => (
                                <div key={tx.id} className="transaction-item" onClick={() => handleOpenModal(tx)} style={{ cursor: 'pointer' }}>
                                    <div className="tx-icon">
                                        {getInitials(tx.name)}
                                    </div>
                                    <div className="tx-details">
                                        <div className="tx-name">{tx.name}</div>
                                        <div className="tx-category">{tx.category || 'Savings'} • {new Date(tx.date).toLocaleDateString()}</div>
                                    </div>
                                    <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                                        {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="grid-col-right">



                    {/* Monthly Expected Expenses Table */}
                    <div className="glass-card monthly-expenses-card">
                        <div className="card-header">
                            <h4>Monthly Expected</h4>
                            <button className="see-all-btn" onClick={() => handleOpenMonthlyModal()}>Add New</button>
                        </div>
                        <div className="expected-table-container">
                            <table className="expected-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th align="right">Amount</th>
                                        <th align="center">Paid</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {monthlyExpenses.map((expense) => (
                                        <tr key={expense.id} className={expense.isPaid ? 'is-paid' : ''}>
                                            <td style={{ cursor: 'pointer' }} onClick={() => handleOpenMonthlyModal(expense)}>
                                                {expense.name}
                                            </td>
                                            <td align="right" style={{ cursor: 'pointer' }} onClick={() => handleOpenMonthlyModal(expense)}>
                                                {formatCurrency(expense.amount)}
                                            </td>
                                            <td align="center">
                                                <button
                                                    className={`action-btn-sm ${expense.isPaid ? 'paid' : ''}`}
                                                    onClick={() => toggleMonthlyExpensePaid(expense.id)}
                                                    style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '99px',
                                                        border: '1px solid var(--border-light)',
                                                        background: expense.isPaid ? 'rgba(56, 161, 105, 0.15)' : 'transparent',
                                                        color: expense.isPaid ? 'var(--success)' : 'var(--text-primary)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {expense.isPaid ? 'Paid' : 'Pay'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Total Savings Card */}
                    <div className="glass-card savings-panel-card">
                        <div className="card-header">
                            <h4>Total Savings</h4>
                            <button className="see-all-btn" onClick={() => handleOpenModal(null, 'savings')}>+ Add</button>
                        </div>
                        <div className="savings-content" style={{ textAlign: 'center', margin: '20px 0' }}>
                            <div className="savings-amount" style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                                {formatCurrency(calculateTotalSavings())}
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Saved across accounts</span>
                        </div>

                        <div className="savings-history" style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <div className="transactions-list" style={{ gap: '8px' }}>
                                {transactions.filter(t => t.type === 'savings').slice(0, 3).map((tx) => (
                                    <div key={tx.id} className="transaction-item" onClick={() => handleOpenModal(tx, 'savings', true)} style={{ cursor: 'pointer', padding: '4px 0' }}>
                                        <div className="tx-details">
                                            <div className="tx-name" style={{ fontSize: '0.85rem' }}>{tx.name}</div>
                                            <div className="tx-category" style={{ fontSize: '0.65rem' }}>{new Date(tx.date).toLocaleDateString()}</div>
                                        </div>
                                        <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`} style={{ fontSize: '0.85rem' }}>
                                            {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="savings-actions" style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                            <button className="explore-btn" style={{ flex: 1, padding: '12px 8px', fontSize: '0.85rem' }} onClick={() => handleOpenModal(null, 'savings', true)}>Deposit</button>
                            <button className="explore-btn" style={{ flex: 1, padding: '12px 8px', fontSize: '0.85rem', background: 'rgba(229, 62, 62, 0.1)', color: '#E53E3E' }} onClick={() => handleOpenModal(null, 'savings', true)}>Withdraw</button>
                        </div>
                    </div>

                </div>
            </div>

            {isModalOpen && (
                <FinanceTransactionModal
                    onClose={() => setIsModalOpen(false)}
                    transactionToEdit={editingTx}
                    defaultType={defaultModalType}
                    hideTypeSelector={hideModalTypeSelector}
                />
            )}

            {isMonthlyModalOpen && (
                <FinanceMonthlyExpenseModal
                    onClose={() => setIsMonthlyModalOpen(false)}
                    expenseToEdit={editingMonthlyExpense}
                />
            )}
        </div>
    );
};

export default FinanceDashboard;
