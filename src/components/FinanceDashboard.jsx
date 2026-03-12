import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Send, Download, Plus, Search, Settings, ArrowRightLeft, ChevronDown, ArrowDown } from 'lucide-react';
import FinanceTransactionModal from './FinanceTransactionModal';
import FinanceMonthlyExpenseModal from './FinanceMonthlyExpenseModal';
import FinanceTransferModal from './FinanceTransferModal';
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
    const [showConverter, setShowConverter] = useState(false);
    const [amountToConvert, setAmountToConvert] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);
    const [defaultModalType, setDefaultModalType] = useState('expense');
    const [hideModalTypeSelector, setHideModalTypeSelector] = useState(false);

    const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
    const [editingMonthlyExpense, setEditingMonthlyExpense] = useState(null);

    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [transferDirection, setTransferDirection] = useState('balance_to_savings');

    const handleOpenTransferModal = (direction) => {
        setTransferDirection(direction);
        setIsTransferModalOpen(true);
    };

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

    const handleSwapCurrency = () => {
        setCurrencyMode(prev => prev === 'EUR_TO_COP' ? 'COP_TO_EUR' : 'EUR_TO_COP');
        // Optionally swap amounts when mode changes
        const tempEur = eurAmount;
        setEurAmount(copAmount);
        setCopAmount(tempEur);
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
                        <button 
                            className="nav-btn" 
                            style={{ color: '#E53E3E', background: 'rgba(229, 62, 62, 0.1)', border: '1px solid rgba(229, 62, 62, 0.2)', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '8px' }}
                            onClick={() => {
                                if(window.confirm('Are you sure you want to delete all your history and reset the app to zero? This action cannot be undone.')) {
                                    resetData();
                                }
                            }}
                        >
                            <Trash2 size={14} /> Reset App
                        </button>
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
                        <div className="balance-actions" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                            <button className="action-pill" onClick={() => handleOpenModal(null, 'income', true)}><Download size={16} /> Receive</button>
                            <button className="action-pill" onClick={() => handleOpenTransferModal('balance_to_savings')} style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--primary)', borderColor: 'rgba(139, 92, 246, 0.3)' }}><Send size={16} /> Send to Savings</button>
                        </div>

                        <div className="currency-converter-section" style={{ marginTop: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Quick Convert</h5>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {showConverter && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>1 EUR = {exchangeRate} COP</span>}
                                    <button 
                                        onClick={() => setShowConverter(!showConverter)} 
                                        className="action-pill" 
                                        style={{ padding: '6px 16px', fontSize: '0.8rem', margin: 0, cursor: 'pointer' }}
                                    >
                                        {showConverter ? 'Hide' : 'Open'}
                                    </button>
                                </div>
                            </div>

                            {showConverter && (
                                <div className="converter-card-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {/* You Send Block */}
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>You send</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px 6px 6px', borderRadius: '20px', cursor: 'pointer' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: currencyMode === 'EUR_TO_COP' ? '#0D8ABC' : '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                                                {currencyMode === 'EUR_TO_COP' ? '€' : '$'}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                {currencyMode === 'EUR_TO_COP' ? 'EUR' : 'COP'}
                                            </span>
                                            <ChevronDown size={14} color="var(--text-secondary)" />
                                        </div>
                                        <input
                                            type="number"
                                            value={currencyMode === 'EUR_TO_COP' ? eurAmount : copAmount}
                                            onChange={currencyMode === 'EUR_TO_COP' ? handleEurChange : handleCopChange}
                                            placeholder="0.00"
                                            style={{ width: '50%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, outline: 'none', textAlign: 'right', fontFamily: 'var(--font-heading)' }}
                                        />
                                    </div>
                                </div>

                                {/* Arrow Middle */}
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-14px', marginBottom: '-14px', position: 'relative', zIndex: 2 }}>
                                    <div 
                                        onClick={handleSwapCurrency}
                                        style={{ background: 'var(--bg-panel)', border: '4px solid rgba(0,0,0,0.1)', borderRadius: '50%', width: '30px', height: '30px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'transform 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                        <ArrowDown size={14} />
                                    </div>
                                </div>

                                {/* You Get Block */}
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>You get</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px 12px 6px 6px', borderRadius: '20px', cursor: 'pointer' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: currencyMode === 'EUR_TO_COP' ? '#8B5CF6' : '#0D8ABC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>
                                                {currencyMode === 'EUR_TO_COP' ? '$' : '€'}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                                                {currencyMode === 'EUR_TO_COP' ? 'COP' : 'EUR'}
                                            </span>
                                            <ChevronDown size={14} color="var(--text-secondary)" />
                                        </div>
                                        <input
                                            type="number"
                                            value={currencyMode === 'EUR_TO_COP' ? copAmount : eurAmount}
                                            onChange={currencyMode === 'EUR_TO_COP' ? handleCopChange : handleEurChange}
                                            placeholder="0.00"
                                            style={{ width: '50%', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, outline: 'none', textAlign: 'right', fontFamily: 'var(--font-heading)' }}
                                            readOnly={false}
                                        />
                                    </div>
                                </div>
                            </div>
                            )}
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
                            <button className="explore-btn" style={{ flex: 1, padding: '12px 8px', fontSize: '0.85rem', background: 'rgba(229, 62, 62, 0.1)', color: '#E53E3E' }} onClick={() => handleOpenTransferModal('savings_to_balance')}>Withdraw to Balance</button>
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

            {isTransferModalOpen && (
                <FinanceTransferModal
                    onClose={() => setIsTransferModalOpen(false)}
                    direction={transferDirection}
                />
            )}
        </div>
    );
};

export default FinanceDashboard;
