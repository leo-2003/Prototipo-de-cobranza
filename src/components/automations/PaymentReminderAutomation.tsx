
import React, { useState, useCallback } from 'react';
import { Student, ReminderResult, PaymentStatus } from '../../types';
import { generateReminderMessage } from '../../services/geminiService';
import { getStudentPaymentStatus } from '../students/StudentRow';

interface PaymentReminderAutomationProps {
    students: Student[];
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const PaymentReminderAutomation: React.FC<PaymentReminderAutomationProps> = ({ students, addToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string>('Listo para ejecutar.');
    const [results, setResults] = useState<ReminderResult[]>([]);

    const handleRunAutomation = useCallback(async () => {
        setIsLoading(true);
        setResults([]);
        setStatusMessage('Identificando alumnos con adeudos...');

        const overdueStudents = students.filter(student => {
            const { status } = getStudentPaymentStatus(student);
            return status === PaymentStatus.Overdue;
        });

        if (overdueStudents.length === 0) {
            setStatusMessage('No se encontraron alumnos con facturas vencidas.');
            setIsLoading(false);
            addToast('No hay alumnos con adeudos para notificar.', 'info');
            return;
        }
        
        const generatedResults: ReminderResult[] = [];
        for (let i = 0; i < overdueStudents.length; i++) {
            const student = overdueStudents[i];
            setStatusMessage(`(${i + 1}/${overdueStudents.length}) Generando mensaje para ${student.name}...`);
            try {
                const message = await generateReminderMessage(student);
                generatedResults.push({
                    studentId: student.id,
                    studentName: student.name,
                    studentAvatar: student.avatar,
                    message,
                    status: 'success'
                });
            } catch (error) {
                console.error(`Error generating message for ${student.name}:`, error);
                const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
                generatedResults.push({
                    studentId: student.id,
                    studentName: student.name,
                    studentAvatar: student.avatar,
                    message: `Error: ${errorMessage}`,
                    status: 'error',
                    error: errorMessage
                });
            }
        }
        
        setResults(generatedResults);
        setStatusMessage(`Proceso completado. Se generaron ${generatedResults.filter(r => r.status === 'success').length} mensajes.`);
        setIsLoading(false);
        addToast(`Automatización finalizada. ${generatedResults.length} mensajes generados.`, 'success');

    }, [students, addToast]);

    const handleCopyToClipboard = (message: string) => {
        navigator.clipboard.writeText(message);
        addToast("Mensaje copiado al portapapeles.", 'info');
    };

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 flex items-center">
                        <BellIcon className="w-6 h-6 mr-3 text-primary-500" />
                        Recordatorios de Pago Automáticos
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 max-w-2xl">
                        Identifica alumnos con facturas vencidas y genera mensajes de recordatorio personalizados por IA, listos para enviar por WhatsApp.
                    </p>
                </div>
                 <button
                    onClick={handleRunAutomation}
                    disabled={isLoading}
                    className="mt-4 md:mt-0 w-full md:w-auto bg-primary-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                >
                    {isLoading ? <SpinnerIcon /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                    {isLoading ? 'Procesando...' : 'Ejecutar Automatización'}
                </button>
            </div>

            <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Estado:</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{statusMessage}</p>
            </div>
            
            {results.length > 0 && (
                <div className="mt-6">
                    <h4 className="font-semibold text-neutral-700 dark:text-neutral-200 mb-3">Resultados Generados</h4>
                    <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {results.map(result => (
                            <li key={result.studentId} className={`p-4 border rounded-lg ${result.status === 'error' ? 'border-red-300 dark:border-red-700' : 'border-neutral-200 dark:border-neutral-700'}`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <img src={result.studentAvatar} alt={result.studentName} className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <p className="font-semibold">{result.studentName}</p>
                                            {result.status === 'error' && <p className="text-xs text-red-500 font-medium">Fallo al generar mensaje</p>}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(result.message)}
                                        disabled={result.status === 'error'}
                                        className="text-xs font-semibold text-primary-600 hover:text-primary-800 disabled:opacity-50 flex items-center shrink-0 ml-4"
                                    >
                                        <ClipboardIcon className="w-4 h-4 mr-1" />
                                        Copiar Mensaje
                                    </button>
                                </div>
                                <p className={`mt-3 text-sm p-3 rounded-md whitespace-pre-wrap font-mono ${result.status === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200' : 'bg-neutral-100 dark:bg-neutral-800'}`}>{result.message}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const BellIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>;
const SparklesIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zM12.75 8.663a.75.75 0 00-1.5 0V12a.75.75 0 001.5 0V8.663zM16.5 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zM15 9.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546a.75.75 0 01.75-.75zM8.25 10.5a.75.75 0 00-1.5 0V14.25a.75.75 0 001.5 0v-3.75zM12 12.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546A.75.75 0 0112 12.75zM11.25 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM15.75 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM12 19.5a.75.75 0 01.75.75v.53a.75.75 0 01-1.5 0v-.53A.75.75 0 0112 19.5z" clipRule="evenodd" /></svg>;
const SpinnerIcon = () => <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const ClipboardIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25V5.25c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V7.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>;

export default PaymentReminderAutomation;