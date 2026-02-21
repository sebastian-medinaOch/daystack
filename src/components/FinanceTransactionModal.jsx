
import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X } from 'lucide-react';
import './FinanceTransactionModal.css';

const FinanceTransactionModal = ({ onClose, transactionToEdit, defaultType = 'expense' }) => {
    const { addTransaction, updateTransaction } = useContext(FinanceContext);

    const [formData, setFormData] = useState({
        type: defaultType,
        amount: '',
        name: '',
        account: 'Unicaja',
        category: 'Gastos Personales',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (transactionToEdit) {
            setFormData({
                type: transactionToEdit.type,
                amount: Math.abs(transactionToEdit.amount).toString(),
                name: transactionToEdit.name,
                account: transactionToEdit.account,
                category: transactionToEdit.category || '',
                date: new Date(transactionToEdit.date).toISOString().split('T')[0],
            });
        }
    }, [transactionToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert amount to negative if it's an expense
        let finalAmount = parseFloat(formData.amount);
        if (formData.type === 'expense') {
            finalAmount = -Math.abs(finalAmount);
        } else if (formData.type === 'income') {
            finalAmount = Math.abs(finalAmount);
        } else if (formData.type === 'savings') {
            // Savings are positive balance transfers typically, but let's keep them positive for tracking
            finalAmount = Math.abs(finalAmount);
        }

        const transactionData = {
            ...formData,
            amount: finalAmount,
            date: new Date(formData.date).toISOString()
        };

        if (transactionToEdit) {
            updateTransaction({ ...transactionData, id: transactionToEdit.id });
        } else {
            addTransaction(transactionData);
        }

        onClose();
    };

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content finance-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>

                <h2>{transactionToEdit ? 'Edit Transaction' : 'New Transaction'}</h2>

                <form onSubmit={handleSubmit} className="finance-form">
                    <div className="form-group type-selector">
                        <button
                            type="button"
                            className={`type-btn ${formData.type === 'expense' ? 'active expense' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${formData.type === 'income' ? 'active income' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            className={`type-btn ${formData.type === 'savings' ? 'active savings' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, type: 'savings' }))}
                        >
                            Savings
                        </button>
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-2">
                            <label>Amount (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="amount"
                                required
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={handleChange}
                                className="finance-input large-amount"
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label>Date (Expected/Paid)</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="finance-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>
                            {formData.type === 'savings' ? 'Purpose of Saving' : 'Description'}
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder={formData.type === 'savings' ? 'e.g., Ahorro Viaje a Colombia' : 'e.g., Mercado'}
                            value={formData.name}
                            onChange={handleChange}
                            className="finance-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label>Account</label>
                            <input
                                type="text"
                                name="account"
                                list="accounts-list"
                                required
                                placeholder="e.g., Unicaja, BBVA"
                                value={formData.account}
                                onChange={handleChange}
                                className="finance-input"
                            />
                            <datalist id="accounts-list">
                                <option value="Unicaja" />
                                <option value="BBVA" />
                                <option value="Davivienda" />
                                <option value="Cash" />
                            </datalist>
                        </div>

                        {formData.type !== 'savings' && (
                            <div className="form-group flex-1">
                                <label>Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    list="categories-list"
                                    placeholder="e.g., Casa, Personal"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="finance-input"
                                />
                                <datalist id="categories-list">
                                    <option value="Casa" />
                                    <option value="Gastos Personales" />
                                    <option value="Gastos Inversiones" />
                                    <option value="Salario" />
                                    <option value="Otros" />
                                </datalist>
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save {formData.type}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinanceTransactionModal;
