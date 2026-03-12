import React, { useState, useContext } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X } from 'lucide-react';
import './FinanceTransactionModal.css';

const FinanceTransferModal = ({ onClose, direction }) => {
    const { transferFunds, calculateTotalBalance, calculateTotalSavings } = useContext(FinanceContext);
    const [amount, setAmount] = useState('');

    const maxAmount = direction === 'balance_to_savings' 
        ? calculateTotalBalance() 
        : calculateTotalSavings();

    const isToSavings = direction === 'balance_to_savings';

    const handleSubmit = (e) => {
        e.preventDefault();
        transferFunds(amount, direction);
        onClose();
    };

    const setMaxAmount = () => {
        setAmount(maxAmount > 0 ? parseFloat(maxAmount.toFixed(2)).toString() : '0');
    };

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content finance-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>

                <h2>{isToSavings ? 'Send to Savings' : 'Withdraw to Balance'}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
                    {isToSavings 
                        ? 'Transfer money from your main Balance to your Savings.' 
                        : 'Move money from your Savings back to your main Balance.'}
                </p>

                <form onSubmit={handleSubmit} className="finance-form">
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ margin: 0 }}>Amount (€)</label>
                            <span 
                                style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                                onClick={setMaxAmount}
                            >
                                Max: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(maxAmount)}
                            </span>
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            max={maxAmount > 0 ? maxAmount : undefined}
                            required
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="finance-input large-amount"
                            autoFocus
                        />
                    </div>

                    <div className="form-actions" style={{ marginTop: '24px' }}>
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount}
                            style={{ background: isToSavings ? 'var(--primary)' : 'var(--warning)', color: '#111' }}
                        >
                            {isToSavings ? 'Send to Savings' : 'Withdraw Amount'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinanceTransferModal;
