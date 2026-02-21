import React, { useContext, useState } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Send, Download, Plus, Search, Settings } from 'lucide-react';
import FinanceTransactionModal from './FinanceTransactionModal';
import './FinanceDashboard.css';

const MOCK_BAR_DATA = [
    { name: 'Jun', amount: 4500 },
    { name: 'Jul', amount: 3800 },
    { name: 'Aug', amount: 5200 },
    { name: 'Sep', amount: 4800 },
    { name: 'Oct', amount: 6100 },
    { name: 'Nov', amount: 5500 },
    { name: 'Dec', amount: 8250 },
];

const MOCK_AREA_DATA = [
    { name: '1 Dec', value: 2000 },
    { name: '2 Dec', value: 4500 },
    { name: '3 Dec', value: 5000 },
    { name: '4 Dec', value: 9500 },
    { name: '5 Dec', value: 8000 },
    { name: '6 Dec', value: 10245 },
    { name: '7 Dec', value: 7500 },
    { name: '8 Dec', value: 6000 },
    { name: '9 Dec', value: 8500 },
    { name: '10 Dec', value: 7200 },
];

const FinanceDashboard = () => {
    const {
        transactions,
        calculateTotalBalance,
        exchangeRate
    } = useContext(FinanceContext);

    const [currencyMode, setCurrencyMode] = useState('EUR_TO_COP'); // 'EUR_TO_COP' or 'COP_TO_EUR'
    const [amountToConvert, setAmountToConvert] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTx, setEditingTx] = useState(null);

    const totalBalance = calculateTotalBalance();

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

    const handleOpenModal = (tx = null) => {
        setEditingTx(tx);
        setIsModalOpen(true);
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
                        <div className="balance-actions">
                            <button className="action-pill"><Send size={16} /> Send</button>
                            <button className="action-pill"><Download size={16} /> Receive</button>
                        </div>

                        <div className="cards-section">
                            <h5>My cards</h5>
                            <div className="cards-row">
                                {/* Visual Representation of Accounts */}
                                <div className="credit-card primary">
                                    <div className="chip"></div>
                                    <div className="card-details">
                                        <span className="card-number">**** **** **** 4455</span>
                                        <span className="card-name">Jack Walson</span>
                                    </div>
                                </div>
                                <div className="credit-card secondary">
                                    <div className="card-type">VISA</div>
                                    <div className="card-details">
                                        <span className="card-number">**** 1599</span>
                                        <span className="card-name">Jack Walson</span>
                                    </div>
                                </div>
                                <button className="add-card-btn">
                                    <Plus />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Expenses Graph Component */}
                    <div className="glass-card expenses-graph-card">
                        <div className="card-header">
                            <h4>Expenses</h4>
                            <select className="dropdown-select"><option>Dec 06</option></select>
                        </div>
                        <div className="chart-container area-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={MOCK_AREA_DATA}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#4A90E2" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip />
                                    <Area type="monotone" dataKey="value" stroke="#4A90E2" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* X Axis mock labels below */}
                        <div className="chart-x-labels">
                            {['1 Dec', '2 Dec', '3 Dec', '4 Dec', '5 Dec', '6 Dec', '7 Dec', '8 Dec', '9 Dec', '10 Dec'].map(label => (
                                <span key={label}>{label}</span>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Middle Column */}
                <div className="grid-col-middle">

                    {/* Spending Bar Chart */}
                    <div className="glass-card spending-card">
                        <div className="card-header">
                            <h4>Spending</h4>
                            <select className="dropdown-select"><option>Month</option></select>
                        </div>
                        <div className="spending-total">$8250.00</div>
                        <div className="chart-container bar-chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={MOCK_BAR_DATA}>
                                    <Bar dataKey="amount" fill="#E2E8F0" radius={[4, 4, 4, 4]}
                                        activeBar={{ fill: '#4A90E2' }} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="chart-x-labels small">
                            {MOCK_BAR_DATA.map(d => <span key={d.name}>{d.name}</span>)}
                        </div>
                    </div>

                    {/* Currency Converter */}
                    <div className="glass-card converter-card green-tint">
                        <div className="converter-header">
                            <h4>Currency Converter</h4>
                            <button className="swap-btn" onClick={() => setCurrencyMode(prev => prev === 'EUR_TO_COP' ? 'COP_TO_EUR' : 'EUR_TO_COP')}>
                                <RefreshCw size={14} />
                            </button>
                        </div>
                        <p className="converter-subtitle">
                            {currencyMode === 'EUR_TO_COP' ? 'EUR (€) to COP ($)' : 'COP ($) to EUR (€)'}
                        </p>
                        <div className="converter-input-group">
                            <input
                                type="number"
                                value={amountToConvert}
                                onChange={(e) => setAmountToConvert(e.target.value)}
                                placeholder="Enter amount"
                            />
                            <span className="currency-symbol">{currencyMode === 'EUR_TO_COP' ? '€' : '$'}</span>
                        </div>
                        <div className="converter-result">
                            <span>Result:</span>
                            <strong>{handleConvert()}</strong>
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="grid-col-right">

                    {/* Transactions List */}
                    <div className="glass-card transactions-card">
                        <div className="card-header">
                            <h4>Transactions</h4>
                            <button className="see-all-btn">See All</button>
                        </div>
                        <div className="transactions-list">
                            {transactions.slice(0, 6).map((tx) => (
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

                    {/* Credit Score Gauge (Mock component for aesthetics) */}
                    <div className="glass-card score-card">
                        <div className="card-header">
                            <h4>Credit Score</h4>
                            <button className="see-all-btn">See More</button>
                        </div>
                        <div className="gauge-container">
                            {/* SVG for a simple gauge */}
                            <svg viewBox="0 0 100 50" className="gauge-svg">
                                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
                                <path d="M 10 50 A 40 40 0 0 1 50 10" fill="none" stroke="#F56565" strokeWidth="8" strokeLinecap="round" />
                                <path d="M 50 10 A 40 40 0 0 1 80 25" fill="none" stroke="#ED8936" strokeWidth="8" strokeLinecap="round" />
                                <path d="M 80 25 A 40 40 0 0 1 90 50" fill="none" stroke="#48BB78" strokeWidth="8" strokeLinecap="round" />
                            </svg>
                            <div className="score-value">
                                <h3>1620</h3>
                                <span>Excellent</span>
                            </div>
                        </div>
                        <button className="explore-btn">Explore Benefits</button>
                    </div>

                </div>
            </div>

            {isModalOpen && (
                <FinanceTransactionModal
                    onClose={() => setIsModalOpen(false)}
                    transactionToEdit={editingTx}
                />
            )}
        </div>
    );
};

export default FinanceDashboard;
