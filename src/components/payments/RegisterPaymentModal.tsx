import React, { useState, useEffect, useMemo } from 'react';
import { Student, InvoiceStatus } from '../../types';

interface RegisterPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: Student;
    onPaymentSuccess: (student: Student, amount: number) => void;
}

const RegisterPaymentModal: React.FC<RegisterPaymentModalProps> = ({ isOpen, onClose, student, onPaymentSuccess }) => {
    
    const totalDue = useMemo(() => {
        return student.invoices
            .filter(inv => inv.status !== InvoiceStatus.Paid && inv.status !== InvoiceStatus.Cancelled)
            .reduce((acc, inv) => acc + inv.balance, 0);
    }, [student.invoices]);

    const [amount, setAmount] = useState(totalDue.toString());
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [isProcessing, setIsProcessing] = useState(false);
    
    useEffect(() => {
        setAmount(totalDue.toString());
    }, [totalDue]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess(student, parseFloat(amount));
            onClose(); // Close modal after success
        }, 1000); // Simulate <30s processing time goal -> 1s is fast enough
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Registrar Pago Rápido</h3>
                        <p className="text-sm text-neutral-500 mt-1">Para: <span className="font-semibold">{student.name}</span></p>
                    </div>
                    <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Monto a Pagar (MXN)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <span className="text-neutral-500 sm:text-sm">$</span>
                                </div>
                                <input
                                    type="number"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="block w-full pl-7 pr-12 py-2 border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="0.00"
                                    required
                                    autoFocus
                                    step="0.01"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Método de Pago</label>
                            <select
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option>Efectivo</option>
                                <option>Tarjeta de Débito/Crédito</option>
                                <option>Transferencia Bancaria</option>
                            </select>
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-neutral-50 dark:bg-neutral-950/50 rounded-b-2xl flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
                            className="py-2 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-secondary-600 hover:bg-secondary-700 disabled:bg-secondary-400 disabled:cursor-not-allowed flex items-center"
                        >
                            {isProcessing && <SpinnerIcon />}
                            {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const SpinnerIcon = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default RegisterPaymentModal;