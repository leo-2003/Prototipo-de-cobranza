
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
        
        try {
            const message = await generateReminderMessage(student);
            setGeneratedMessage(message);
        } catch (e) {
            if (e instanceof Error) {
                setGeneratedMessage(`--ERROR--\n${e.message}`);
            } else {
                setGeneratedMessage("--ERROR--\nOcurrió un error inesperado al generar el mensaje.");
            }
        } finally {
            setIsGeneratingMessage(false);
        }
    }, [student, overdueInvoice]);

    const handleCopyToClipboard = () => {
        const messageToCopy = generatedMessage.startsWith('--ERROR--') ? generatedMessage.substring(9) : generatedMessage;
        navigator.clipboard.writeText(messageToCopy);
        addToast("Mensaje copiado al portapapeles.", 'info');
    };

    const riskColor = {
        'Bajo': 'text-secondary-500',
        'Medio': 'text-accent-warning-500',
        'Alto': 'text-accent-danger-500'
    }[student.riskLevel];
    
    const handleGenerateStatement = () => {
        addToast(`Generando estado de cuenta para ${student.name}... (funcionalidad pendiente)`, 'info');
    }

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
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onRegisterPayment(student)}
                        disabled={status === PaymentStatus.Paid}
                        className="p-2 rounded-md hover:bg-secondary-100 dark:hover:bg-secondary-900/50 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Registrar Pago"
                    >
                        <DollarSignIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    </button>
                     <button 
                        onClick={handleGenerateMessage}
                        disabled={isGeneratingMessage || status !== PaymentStatus.Overdue}
                        className="p-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/50 disabled:opacity-30 disabled:cursor-not-allowed"
                         title="Generar Mensaje con IA"
                    >
                         {isGeneratingMessage ? <SpinnerIcon /> : <SparklesIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />}
                    </button>
                    <button 
                        onClick={handleGenerateStatement}
                        className="p-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700"
                        title="Generar Estado de Cuenta"
                    >
                        <DocumentTextIcon className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>
            </td>
        </tr>
        {isExpanded && (
            <tr className="bg-neutral-50 dark:bg-neutral-800/30">
                <td colSpan={6} className="px-4 py-4">
                    <InvoiceDetails invoices={student.invoices} paymentHistory={student.paymentHistory} />
                </td>
            </tr>
        )}
        {generatedMessage && (() => {
            const isError = generatedMessage.startsWith('--ERROR--');
            const messageToShow = isError ? generatedMessage.substring(9) : generatedMessage;
            const containerClasses = isError ? 'bg-red-50 dark:bg-red-900/20' : 'bg-primary-50 dark:bg-neutral-800';
            const textClasses = isError ? 'text-red-700 dark:text-red-200' : 'text-neutral-700 dark:text-neutral-200';
            const icon = isError 
                ? <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                : <SparklesIcon className="w-5 h-5 text-primary-500 mr-3 mt-1 flex-shrink-0" />;

            return (
                <tr>
                    <td colSpan={6} className={`p-4 ${containerClasses}`}>
                        <div className="flex items-start">
                            {icon}
                            <div className="flex-grow">
                                {isError && <p className="text-sm font-bold mb-1 text-red-800 dark:text-red-100">Error al Generar</p>}
                                <p className={`text-sm ${textClasses} whitespace-pre-wrap`}>{messageToShow}</p>
                                {!isError && (
                                     <button 
                                        onClick={handleCopyToClipboard}
                                        className="mt-2 text-xs text-primary-600 hover:underline font-semibold"
                                    >
                                        Copiar para WhatsApp
                                    </button>
                                )}
                            </div>
                             <button onClick={() => setGeneratedMessage('')} className="ml-4 text-neutral-400 hover:text-neutral-600 text-2xl leading-none">&times;</button>
                        </div>
                    </td>
                </tr>
            );
        })()}
        </>
    );
};
const DollarSignIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SparklesIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zM12.75 8.663a.75.75 0 00-1.5 0V12a.75.75 0 001.5 0V8.663zM16.5 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zM15 9.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546a.75.75 0 01.75-.75zM8.25 10.5a.75.75 0 00-1.5 0V14.25a.75.75 0 001.5 0v-3.75zM12 12.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546A.75.75 0 0112 12.75zM11.25 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM15.75 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM12 19.5a.75.75 0 01.75.75v.53a.75.75 0 01-1.5 0v-.53A.75.75 0 0112 19.5z" clipRule="evenodd" /></svg>;
const ChevronDownIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
const DocumentTextIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ExclamationTriangleIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

export default StudentRow;
