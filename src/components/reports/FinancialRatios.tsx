
import React, { useMemo } from 'react';
import { Student, InvoiceStatus } from '../../types';

interface FinancialRatiosProps {
    students: Student[];
}

const FinancialRatios: React.FC<FinancialRatiosProps> = ({ students }) => {

    const dso = useMemo(() => {
        let totalAccountsReceivable = 0;
        let totalCreditSales = 0; // Approximated as total invoiced amount in the last 30 days.
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        students.forEach(student => {
            student.invoices.forEach(invoice => {
                if (invoice.balance > 0) {
                    totalAccountsReceivable += invoice.balance;
                }
                const issueDate = new Date(invoice.issueDate);
                if (issueDate >= thirtyDaysAgo) {
                    totalCreditSales += invoice.totalAmount;
                }
            });
        });
        
        if (totalCreditSales === 0) return 0;

        return (totalAccountsReceivable / totalCreditSales) * 30;

    }, [students]);

    const getDsoInterpretation = (days: number) => {
        if (days < 15) return { text: 'Excelente', color: 'text-secondary-500' };
        if (days < 30) return { text: 'Saludable', color: 'text-green-500' };
        if (days < 45) return { text: 'Regular', color: 'text-accent-warning-500' };
        return { text: 'Necesita Atención', color: 'text-accent-danger-500' };
    };

    const dsoStatus = getDsoInterpretation(dso);

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md h-full">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1">Ratios Financieros Clave</h3>
            <p className="text-xs text-neutral-400 mb-4">Indicadores de eficiencia operativa.</p>
            
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-baseline">
                        <h4 className="font-semibold text-neutral-600 dark:text-neutral-300">Período Medio de Cobro (DSO)</h4>
                        <span className={`font-bold text-lg ${dsoStatus.color}`}>{dsoStatus.text}</span>
                    </div>
                    <p className="text-4xl font-bold text-primary-500 my-2">{dso.toFixed(1)} <span className="text-2xl text-neutral-400">días</span></p>
                    <p className="text-sm text-neutral-500">
                        En promedio, la institución tarda {dso.toFixed(1)} días en cobrar sus facturas después de emitirlas.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinancialRatios;