
import React, { useMemo } from 'react';
import { Student } from '../../types';

interface CohortAnalysisProps {
    students: Student[];
}

const CohortAnalysis: React.FC<CohortAnalysisProps> = ({ students }) => {
    
    const cohortData = useMemo(() => {
        const cohorts: { [key: string]: Student[] } = {};
        students.forEach(student => {
            const cohortKey = new Date(student.enrollmentDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' });
            if (!cohorts[cohortKey]) {
                cohorts[cohortKey] = [];
            }
            cohorts[cohortKey].push(student);
        });

        const cohortKeys = Object.keys(cohorts).sort((a,b) => new Date(a).getTime() - new Date(b).getTime());
        const maxMonths = 12; // Show up to 12 months after enrollment
        
        const tableData = cohortKeys.map(key => {
            const cohortStudents = cohorts[key];
            const cohortSize = cohortStudents.length;
            const cohortStartDate = new Date(cohortStudents[0].enrollmentDate);

            const monthlyRevenue = Array(maxMonths).fill(0).map((_, monthIndex) => {
                let totalRevenueForMonth = 0;
                const monthStartDate = new Date(cohortStartDate.getFullYear(), cohortStartDate.getMonth() + monthIndex, 1);
                const monthEndDate = new Date(cohortStartDate.getFullYear(), cohortStartDate.getMonth() + monthIndex + 1, 0);

                cohortStudents.forEach(student => {
                    student.paymentHistory.forEach(payment => {
                        const paymentDate = new Date(payment.date);
                        if (paymentDate >= monthStartDate && paymentDate <= monthEndDate) {
                            totalRevenueForMonth += payment.amount;
                        }
                    });
                });
                return totalRevenueForMonth;
            });
            
            const cumulativeRevenue = monthlyRevenue.reduce((acc, current, index) => {
                acc[index] = current + (acc[index-1] || 0);
                return acc;
            }, [] as number[]);

            const cumulativeAvgRevenue = cumulativeRevenue.map(total => total / cohortSize);

            return {
                cohort: key,
                size: cohortSize,
                avgRevenue: cumulativeAvgRevenue
            };
        });

        return { tableData, maxMonths };
    }, [students]);
    
    const getCellColor = (value: number | undefined) => {
        if (value === undefined || value === 0) return 'bg-neutral-100 dark:bg-neutral-800';
        const intensity = Math.min(Math.log(value / 1000 + 1) / Math.log(20), 1);
        if (isNaN(intensity)) return 'bg-neutral-100 dark:bg-neutral-800';
        return `bg-primary-500 opacity-${Math.round(intensity * 10) * 10 + 20}`;
    };

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-1">Análisis de Cohorts</h3>
            <p className="text-xs text-neutral-400 mb-4">Ingreso acumulado promedio por alumno desde la inscripción (LTV).</p>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-center">
                    <thead>
                        <tr className="text-xs text-neutral-500 uppercase">
                            <th className="py-2 px-3 text-left">Cohort</th>
                            <th className="py-2 px-3">Alumnos</th>
                            {Array.from({ length: cohortData.maxMonths }).map((_, i) => (
                                <th key={i} className="py-2 px-3">Mes {i}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {cohortData.tableData.map(({ cohort, size, avgRevenue }) => (
                            <tr key={cohort}>
                                <td className="py-2 px-3 font-medium text-left">{cohort}</td>
                                <td className="py-2 px-3">{size}</td>
                                {Array.from({ length: cohortData.maxMonths }).map((_, i) => (
                                    <td key={i} className={`py-2 px-3 ${getCellColor(avgRevenue[i])}`}>
                                        {avgRevenue[i] ? `$${avgRevenue[i].toLocaleString('es-MX', { maximumFractionDigits: 0 })}` : '-'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CohortAnalysis;