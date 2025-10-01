import React, { useState, useCallback, useMemo } from 'react';
import { Student, PaymentStatus, Invoice, InvoiceStatus } from '../../types';
import StudentStatusBadge from './StudentStatusBadge';
import InvoiceDetails from './InvoiceDetails';
import { generateReminderMessage } from '../../services/geminiService';

interface StudentRowProps {
    student: Student;
    onRegisterPayment: (student: Student) => void;
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const getStudentPaymentStatus = (student: Student): { status: PaymentStatus; dueAmount: number; overdueInvoice?: Invoice } => {
    const unpaidInvoices = student.invoices.filter(inv => inv.status !== InvoiceStatus.Paid && inv.status !== InvoiceStatus.Cancelled);
    const dueAmount = unpaidInvoices.reduce((acc, inv) => acc + inv.balance, 0);

    if (unpaidInvoices.length === 0) {
        return { status: PaymentStatus.Paid, dueAmount: 0 };
    }

    const overdueInvoices = unpaidInvoices.filter(inv => inv.status === InvoiceStatus.Overdue);
    if (overdueInvoices.length > 0) {
        const mostUrgentOverdue = overdueInvoices.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
        return { status: PaymentStatus.Overdue, dueAmount, overdueInvoice: mostUrgentOverdue };
    }

    return { status: PaymentStatus.Pending, dueAmount };
};


const StudentRow: React.FC<StudentRowProps> = ({ student, onRegisterPayment, addToast }) => {
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
    const [generatedMessage, setGeneratedMessage] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const { status, dueAmount, overdueInvoice } = useMemo(() => getStudentPaymentStatus(student), [student]);

    const handleGenerateMessage = useCallback(async () => {
        if (!overdueInvoice) return;

        setIsGeneratingMessage(true);
        setGeneratedMessage('');
        
        const studentForPrompt = {
            ...student,
            dueAmount: overdueInvoice.balance,
            dueDate: overdueInvoice.dueDate,
        };

        const message = await generateReminderMessage(studentForPrompt);
        setGeneratedMessage(message);
        setIsGeneratingMessage(false);
    }, [student, overdueInvoice]);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedMessage);
        addToast("Mensaje copiado al portapapeles.", 'info');
    };

    const riskColor = {
        'Bajo': 'text-secondary-500',
        'Medio': 'text-accent-warning-500',
        'Alto': 'text-accent-danger-500'
    }[student.riskLevel];

    return (
        <>
        <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
            <td className="pl-4 pr-2 py-4">
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700">
                    <ChevronDownIcon className={`w-5 h-5 text-neutral-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={student.avatar} alt={student.name} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">{student.name}</div>
                        <div className="text-sm text-neutral-500">{student.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StudentStatusBadge status={status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-300">
                ${dueAmount.toLocaleString('es-MX')}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${riskColor}`}>
                {student.riskLevel}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button 
                    onClick={() => onRegisterPayment(student)}
                    disabled={status === PaymentStatus.Paid}
                    className="text-secondary-600 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-secondary-300 transition-colors disabled:text-neutral-400 disabled:cursor-not-allowed"
                >
                    Registrar Pago
                </button>
                 <button 
                    onClick={handleGenerateMessage}
                    disabled={isGeneratingMessage || status !== PaymentStatus.Overdue}
                    className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors disabled:text-neutral-400 disabled:cursor-not-allowed"
                >
                    {isGeneratingMessage ? 'Generando...' : 'Mensaje IA'}
                </button>
            </td>
        </tr>
        {isExpanded && (
            <tr className="bg-neutral-50 dark:bg-neutral-800/30">
                <td colSpan={6} className="px-4 py-4">
                    <InvoiceDetails invoices={student.invoices} paymentHistory={student.paymentHistory} />
                </td>
            </tr>
        )}
        {generatedMessage && (
            <tr>
                <td colSpan={6} className="p-4 bg-primary-50 dark:bg-neutral-800">
                    <div className="flex items-start">
                        <SparklesIcon className="w-5 h-5 text-primary-500 mr-3 mt-1 flex-shrink-0" />
                        <div className="flex-grow">
                            <p className="text-sm text-neutral-700 dark:text-neutral-200">{generatedMessage}</p>
                             <button 
                                onClick={handleCopyToClipboard}
                                className="mt-2 text-xs text-primary-600 hover:underline font-semibold"
                            >
                                Copiar para WhatsApp
                            </button>
                        </div>
                         <button onClick={() => setGeneratedMessage('')} className="ml-4 text-neutral-400 hover:text-neutral-600 text-2xl leading-none">&times;</button>
                    </div>
                </td>
            </tr>
        )}
        </>
    );
};

const SparklesIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zM12.75 8.663a.75.75 0 00-1.5 0V12a.75.75 0 001.5 0V8.663zM16.5 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zM15 9.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546a.75.75 0 01.75-.75zM8.25 10.5a.75.75 0 00-1.5 0V14.25a.75.75 0 001.5 0v-3.75zM12 12.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546A.75.75 0 0112 12.75zM11.25 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM15.75 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM12 19.5a.75.75 0 01.75.75v.53a.75.75 0 01-1.5 0v-.53A.75.75 0 0112 19.5z" clipRule="evenodd" /></svg>;
const ChevronDownIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>


export default StudentRow;
