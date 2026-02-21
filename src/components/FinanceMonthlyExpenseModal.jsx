import React, { useState, useContext, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { X } from 'lucide-react';
import './FinanceTransactionModal.css';

const FinanceMonthlyExpenseModal = ({ onClose, expenseToEdit }) => {
    const { addMonthlyExpense, updateMonthlyExpense, deleteMonthlyExpense } = useContext(FinanceContext);

    const [formData, setFormData] = useState({
        name: '',
        amount: '',
    });

    useEffect(() => {
        if (expenseToEdit) {
            setFormData({
                name: expenseToEdit.name,
                amount: Math.abs(expenseToEdit.amount).toString(),
            });
        }
    }, [expenseToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const expenseData = {
            name: formData.name,
            amount: parseFloat(formData.amount)
        };

        if (expenseToEdit) {
            updateMonthlyExpense({ ...expenseToEdit, ...expenseData });
        } else {
            addMonthlyExpense(expenseData);
        }

        onClose();
    };

    const handleDelete = () => {
        if (expenseToEdit) {
            deleteMonthlyExpense(expenseToEdit.id);
            onClose();
        }
    }

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-content finance-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}><X size={20} /></button>

                <h2>{expenseToEdit ? 'Edit Monthly Expense' : 'New Monthly Expense'}</h2>

                <form onSubmit={handleSubmit} className="finance-form">
                    <div className="form-group">
                        <label>Expense Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g., Arriendo, Internet..."
                            value={formData.name}
                            onChange={handleChange}
                            className="finance-input"
                        />
                    </div>

                    <div className="form-group">
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

                    <div className="form-actions" style={{ marginTop: '24px', justifyContent: 'space-between' }}>
                        {expenseToEdit ? (
                            <button type="button" className="btn btn-ghost text-danger" onClick={handleDelete}>Delete</button>
                        ) : <div></div>}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Expense</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinanceMonthlyExpenseModal;
