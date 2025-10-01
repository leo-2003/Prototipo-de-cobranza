
import React, { useState, useMemo } from 'react';
import { Student, PaymentStatus, InvoiceStatus, Account } from '../../types';
import StudentRow, { getStudentPaymentStatus } from './StudentRow';
import RegisterPaymentModal from '../payments/RegisterPaymentModal';

interface StudentListProps {
    students: Student[];
    onUpdateStudent: (student: Student) => void;
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
    chartOfAccounts: Account[];
}

const FilterButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            isActive 
            ? 'bg-primary-500 text-white shadow' 
            : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700'
        }`}
    >
        {label}
    </button>
);

const StudentList: React.FC<StudentListProps> = ({ students, onUpdateStudent, addToast }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'Todos'>('Todos');
    const [filterRisk, setFilterRisk] = useState<'Todos' | 'Bajo' | 'Medio' | 'Alto'>('Todos');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const { status } = getStudentPaymentStatus(student);
            const searchMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                student.email.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = filterStatus === 'Todos' || status === filterStatus;
            const riskMatch = filterRisk === 'Todos' || student.riskLevel === filterRisk;
            return searchMatch && statusMatch && riskMatch;
        });
    }, [students, searchTerm, filterStatus, filterRisk]);

    const handleRegisterPaymentClick = (student: Student) => {
        setSelectedStudent(student);
        setIsPaymentModalOpen(true);
    };
    
    const handlePaymentSuccess = (student: Student, amount: number) => {
        let remainingAmount = amount;
        
        const updatedInvoices = student.invoices.map(invoice => {
            if (invoice.balance > 0 && remainingAmount > 0) {
                const paymentForInvoice = Math.min(remainingAmount, invoice.balance);
                invoice.paidAmount += paymentForInvoice;
                invoice.balance -= paymentForInvoice;
                remainingAmount -= paymentForInvoice;
                
                if (invoice.balance <= 0) {
                    invoice.status = InvoiceStatus.Paid;
                }
            }
            return invoice;
        });

        const updatedStudent: Student = {
            ...student,
            invoices: updatedInvoices,
            paymentHistory: [...student.paymentHistory, {
                id: `P${Date.now()}`,
                amount,
                date: new Date().toISOString().split('T')[0],
                concept: `Abono a cuenta`
            }]
        };

        onUpdateStudent(updatedStudent);
        setIsPaymentModalOpen(false);
        setSelectedStudent(null);
        addToast(`Pago de $${amount.toFixed(2)} registrado para ${student.name}`, 'success');
    };

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Gestión de Alumnos</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar alumno..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        />
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium mr-2">Filtrar por:</span>
                    <div className="flex gap-2">
                        <FilterButton label="Todos" isActive={filterStatus === 'Todos'} onClick={() => setFilterStatus('Todos')} />
                        <FilterButton label="Pagado" isActive={filterStatus === PaymentStatus.Paid} onClick={() => setFilterStatus(PaymentStatus.Paid)} />
                        <FilterButton label="Pendiente" isActive={filterStatus === PaymentStatus.Pending} onClick={() => setFilterStatus(PaymentStatus.Pending)} />
                        <FilterButton label="Vencido" isActive={filterStatus === PaymentStatus.Overdue} onClick={() => setFilterStatus(PaymentStatus.Overdue)} />
                    </div>
                     <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
                     <div className="flex gap-2">
                        <FilterButton label="Riesgo: Todos" isActive={filterRisk === 'Todos'} onClick={() => setFilterRisk('Todos')} />
                        <FilterButton label="Alto" isActive={filterRisk === 'Alto'} onClick={() => setFilterRisk('Alto')} />
                        <FilterButton label="Medio" isActive={filterRisk === 'Medio'} onClick={() => setFilterRisk('Medio')} />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                    <thead className="bg-neutral-50 dark:bg-neutral-800">
                        <tr>
                            <th scope="col" className="w-12"></th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Estado de Pago</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Monto Adeudado</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Nivel de Riesgo</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                        {filteredStudents.map(student => (
                            <StudentRow 
                                key={student.id} 
                                student={student}
                                onRegisterPayment={handleRegisterPaymentClick} 
                                addToast={addToast}
                            />
                        ))}
                    </tbody>
                </table>
                 {filteredStudents.length === 0 && (
                    <div className="text-center py-10 text-neutral-500">
                        <p>No se encontraron alumnos que coincidan con los filtros.</p>
                    </div>
                )}
            </div>
            
            {isPaymentModalOpen && selectedStudent && (
                <RegisterPaymentModal 
                    student={selectedStudent}
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

const SearchIcon = ({className = "w-6 h-6"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);


export default StudentList;