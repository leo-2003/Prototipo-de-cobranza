
import React, { useMemo } from 'react';
// Fix: Added InvoiceStatus to imports
import { Student, Account, Invoice, InvoiceStatus } from '../../types';

interface IncomeStatementProps {
    students: Student[];
    chartOfAccounts: Account[];
}

const getRecognizedRevenueForPeriod = (invoice: Invoice, period: Date): number => {
    if (!invoice.deferredRevenueSchedule) {
        // Not deferred, recognize when paid
        const paymentDate = new Date(invoice.issueDate); // Approximation
        if (paymentDate.getFullYear() === period.getFullYear() && paymentDate.getMonth() === period.getMonth()) {
           return invoice.paidAmount;
        }
        return 0;
    }
    
    // It's deferred revenue
    const schedule = invoice.deferredRevenueSchedule;
    const monthlyRecognition = invoice.totalAmount / schedule.recognitionMonths;
    const startDate = new Date(schedule.startDate);
    
    let recognizedAmount = 0;
    for (let i = 0; i < schedule.recognitionMonths; i++) {
        const recognitionDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        if (recognitionDate.getFullYear() === period.getFullYear() && recognitionDate.getMonth() === period.getMonth()) {
            recognizedAmount += monthlyRecognition;
        }
    }
    return recognizedAmount;
}


const IncomeStatement: React.FC<IncomeStatementProps> = ({ students, chartOfAccounts }) => {

    const incomeData = useMemo(() => {
        const incomeByAccount: { [accountId: string]: number } = {};
        const currentPeriod = new Date(); // Using current month as the reporting period

        students.forEach(student => {
            student.invoices.forEach(invoice => {
                // Fix: Used InvoiceStatus.Paid for comparison instead of the string 'Paid'.
                if (invoice.status === InvoiceStatus.Paid) {
                    const recognizedAmount = getRecognizedRevenueForPeriod(invoice, currentPeriod);
                    if (recognizedAmount > 0) {
                        invoice.items.forEach(item => {
                            // Allocate recognized amount proportionally to items
                            const proportion = item.amount / invoice.totalAmount;
                            const recognizedForItem = recognizedAmount * proportion;
                            if (!incomeByAccount[item.accountId]) {
                                incomeByAccount[item.accountId] = 0;
                            }
                            incomeByAccount[item.accountId] += recognizedForItem;
                        });
                    }
                }
            });
        });
        
        const totalIncome = Object.values(incomeByAccount).reduce((sum, amount) => sum + amount, 0);

        return { incomeByAccount, totalIncome };
    }, [students]);

    const incomeAccounts = chartOfAccounts.filter(acc => acc.type === 'Ingreso');

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md h-full">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1">Estado de Resultados (Devengado)</h3>
            <p className="text-xs text-neutral-400 mb-4">Ingresos reconocidos en el mes actual.</p>
            <div className="space-y-3">
                {incomeAccounts.map(account => {
                    const amount = incomeData.incomeByAccount[account.id] || 0;
                    const percentage = incomeData.totalIncome > 0 ? (amount / incomeData.totalIncome) * 100 : 0;
                    return (
                        <div key={account.id}>
                            <div className="flex justify-between items-center mb-1 text-sm">
                                <span className="text-neutral-600 dark:text-neutral-300">{account.name}</span>
                                <span className="font-medium">${amount.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                                <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between font-bold text-lg">
                <span>Total Ingreso Reconocido</span>
                <span>${incomeData.totalIncome.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
            </div>
        </div>
    );
};

export default IncomeStatement;