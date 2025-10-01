
import React from 'react';
import { Student } from '../../types';
import PaymentReminderAutomation from './PaymentReminderAutomation';

interface AutomationsProps {
    students: Student[];
    addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Automations: React.FC<AutomationsProps> = ({ students, addToast }) => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Automatizaciones Inteligentes</h1>
                <p className="mt-1 text-neutral-500">Optimice su flujo de trabajo con procesos impulsados por IA.</p>
            </div>

            <PaymentReminderAutomation students={students} addToast={addToast} />
        </div>
    );
};

export default Automations;