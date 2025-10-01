
import React, { useMemo } from 'react';
// Fix: Added InvoiceStatus to imports
import { Student, Account, InvoiceStatus } from '../../types';

interface DeferredRevenueReportProps {
    students: Student[];
    chartOfAccounts: Account[];
}

const DeferredRevenueReport: React.FC<DeferredRevenueReportProps> = ({ students, chartOfAccounts }) => {

    const reportData = useMemo(() => {
        let beginningBalance = 0;
        let newDeferrals = 0;
        let recognizedThisPeriod = 0;

        const currentPeriod = new Date();
        const firstDayOfCurrentMonth = new Date(currentPeriod.getFullYear(), currentPeriod.getMonth(), 1);
        const firstDayOfNextMonth = new Date(currentPeriod.getFullYear(), currentPeriod.getMonth() + 1, 1);
        
        students.forEach(student => {
            student.invoices.forEach(invoice => {
                // Fix: Used InvoiceStatus.Paid for comparison instead of the string 'Paid'.
                if (invoice.deferredRevenueSchedule && invoice.status === InvoiceStatus.Paid) {
                    const schedule = invoice.deferredRevenueSchedule;
                    const monthlyRecognition = invoice.totalAmount / schedule.recognitionMonths;
                    const startDate = new Date(schedule.startDate);
                    
                    for (let i = 0; i < schedule.recognitionMonths; i++) {
                        const recognitionDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
                        if (recognitionDate < firstDayOfCurrentMonth) {
                           // Part of beginning balance that's still deferred
                           beginningBalance += monthlyRecognition;
                        }
                    }

                    if (new Date(invoice.issueDate) >= firstDayOfCurrentMonth) {
                        newDeferrals += invoice.totalAmount;
                    }

                    // Calculate what has been recognized up to the beginning of this month
                    let recognizedBeforeThisPeriod = 0;
                    for (let i = 0; i < schedule.recognitionMonths; i++) {
                         const recognitionDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
                         if (recognitionDate < firstDayOfCurrentMonth) {
                            recognizedBeforeThisPeriod += monthlyRecognition;
                         }
                    }
                    beginningBalance -= recognizedBeforeThisPeriod;


                    // Calculate what is recognized THIS period
                    for (let i = 0; i < schedule.recognitionMonths; i++) {
                        const recognitionDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
                        if (recognitionDate >= firstDayOfCurrentMonth && recognitionDate < firstDayOfNextMonth) {
                            recognizedThisPeriod += monthlyRecognition;
                        }
                    }
                }
            });
        });
        
        const endingBalance = beginningBalance + newDeferrals - recognizedThisPeriod;

        return { beginningBalance, newDeferrals, recognizedThisPeriod, endingBalance };

    }, [students]);

    const formatCurrency = (amount: number) => `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1">Reporte de Ingresos Diferidos</h3>
            <p className="text-xs text-neutral-400 mb-4">Control de pasivos por ingresos no devengados.</p>
            
            <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <span className="font-medium text-neutral-600 dark:text-neutral-300">Saldo Inicial de Ingresos Diferidos</span>
                    <span className="font-semibold">{formatCurrency(reportData.beginningBalance)}</span>
                </div>
                 <div className="flex justify-between items-center p-3">
                    <span className="text-green-600 dark:text-green-400">(+) Nuevos Ingresos Diferidos (del mes)</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(reportData.newDeferrals)}</span>
                </div>
                <div className="flex justify-between items-center p-3">
                    <span className="text-red-600 dark:text-red-400">(-) Ingreso Reconocido (este mes)</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(reportData.recognizedThisPeriod)}</span>
                </div>
                 <div className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border-t-2 border-neutral-800 dark:border-neutral-200">
                    <span className="font-bold text-base">Saldo Final de Ingresos Diferidos</span>
                    <span className="font-bold text-base">{formatCurrency(reportData.endingBalance)}</span>
                </div>
            </div>
        </div>
    );
};

export default DeferredRevenueReport;