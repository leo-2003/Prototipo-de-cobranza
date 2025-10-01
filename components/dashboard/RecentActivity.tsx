import React, { useMemo } from 'react';
import { Student, InvoiceStatus, PaymentStatus } from '../../types';
import StudentStatusBadge from '../students/StudentStatusBadge';
import { getStudentPaymentStatus } from '../students/StudentRow';

const RecentActivity: React.FC<{ students: Student[] }> = ({ students }) => {
    
    const recentOverdue = useMemo(() => {
        return students
        .map(s => ({
            ...s,
            statusInfo: getStudentPaymentStatus(s)
        }))
        .filter(s => s.statusInfo.status === PaymentStatus.Overdue)
        .sort((a, b) => {
            const dateA = a.statusInfo.overdueInvoice ? new Date(a.statusInfo.overdueInvoice.dueDate).getTime() : 0;
            const dateB = b.statusInfo.overdueInvoice ? new Date(b.statusInfo.overdueInvoice.dueDate).getTime() : 0;
            return dateB - dateA;
        })
        .slice(0, 5);
    }, [students]);

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Actividad Reciente: Adeudos Críticos</h3>
            <div className="mt-4 flow-root">
                <ul role="list" className="-my-5 divide-y divide-neutral-200 dark:divide-neutral-800">
                    {recentOverdue.map((student) => {
                        return (
                            <li key={student.id} className="py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full" src={student.avatar} alt={student.name} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">{student.name}</p>
                                        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">{student.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-accent-danger-500">${student.statusInfo.dueAmount.toLocaleString('es-MX')}</p>
                                        <StudentStatusBadge status={student.statusInfo.status} />
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                     {recentOverdue.length === 0 && (
                        <li className="py-4 text-center text-neutral-500">
                            No hay alumnos con adeudos críticos actualmente.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default RecentActivity;
