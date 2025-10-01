
import React, { useMemo } from 'react';
import { Student, InvoiceStatus } from '../../types';

interface AgingData {
    current: { amount: number; count: number };
    '1-30': { amount: number; count: number };
    '31-60': { amount: number; count: number };
    '61-90': { amount: number; count: number };
    '90+': { amount: number; count: number };
}

const ArAgingReport: React.FC<{ students: Student[] }> = ({ students }) => {

    const agingData = useMemo<AgingData>(() => {
        const data: AgingData = {
            current: { amount: 0, count: 0 },
            '1-30': { amount: 0, count: 0 },
            '31-60': { amount: 0, count: 0 },
            '61-90': { amount: 0, count: 0 },
            '90+': { amount: 0, count: 0 },
        };
        const today = new Date();

        students.forEach(student => {
            student.invoices.forEach(invoice => {
                if (invoice.balance > 0 && invoice.status !== InvoiceStatus.Cancelled) {
                    const dueDate = new Date(invoice.dueDate);
                    const diffTime = today.getTime() - dueDate.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let bucket: keyof AgingData;
                    if (diffDays <= 0) {
                        bucket = 'current';
                    } else if (diffDays <= 30) {
                        bucket = '1-30';
                    } else if (diffDays <= 60) {
                        bucket = '31-60';
                    } else if (diffDays <= 90) {
                        bucket = '61-90';
                    } else {
                        bucket = '90+';
                    }
                    data[bucket].amount += invoice.balance;
                    data[bucket].count++;
                }
            });
        });
        return data;
    }, [students]);
    
    const totalDue = Object.values(agingData).reduce((sum, bucket) => sum + bucket.amount, 0);

    const agingBuckets = [
        { label: 'Corriente', data: agingData.current, color: 'bg-secondary-500' },
        { label: '1-30 Días Vencido', data: agingData['1-30'], color: 'bg-yellow-500' },
        { label: '31-60 Días Vencido', data: agingData['31-60'], color: 'bg-orange-500' },
        { label: '61-90 Días Vencido', data: agingData['61-90'], color: 'bg-red-500' },
        { label: 'Más de 90 Días', data: agingData['90+'], color: 'bg-red-700' },
    ];

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Reporte de Antigüedad de Saldos (A/R)</h3>
            
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-4 mb-4 flex overflow-hidden">
                {agingBuckets.map(bucket => (
                    <div
                        key={bucket.label}
                        className={`${bucket.color} h-4`}
                        style={{ width: `${(bucket.data.amount / totalDue) * 100}%` }}
                        title={`${bucket.label}: $${bucket.data.amount.toLocaleString()}`}
                    ></div>
                ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {agingBuckets.map(bucket => (
                    <div key={bucket.label} className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                        <div className="flex items-center">
                           <span className={`w-3 h-3 rounded-full mr-2 ${bucket.color}`}></span>
                           <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{bucket.label}</p>
                        </div>
                        <p className="text-xl font-bold mt-1">${bucket.data.amount.toLocaleString('es-MX')}</p>
                        <p className="text-xs text-neutral-500">{bucket.data.count} facturas</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArAgingReport;
