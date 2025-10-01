
import React from 'react';

interface QuickActionsProps {
    setCurrentView: (view: 'dashboard' | 'students') => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ setCurrentView }) => {
    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
                <button 
                    onClick={() => alert('Funcionalidad para abrir modal de pago rápido global pendiente.')}
                    className="w-full flex items-center p-3 text-left bg-secondary-50 hover:bg-secondary-100 dark:bg-secondary-900/30 dark:hover:bg-secondary-900/50 rounded-lg transition-colors"
                >
                    <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full mr-4">
                        <DollarSignIcon className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                    </div>
                    <div>
                        <p className="font-semibold text-secondary-800 dark:text-secondary-200">Registrar un Pago</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">Procesar un pago para cualquier alumno.</p>
                    </div>
                </button>
                 <button 
                    onClick={() => setCurrentView('students')}
                    className="w-full flex items-center p-3 text-left bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                >
                    <div className="p-2 bg-primary-100 dark:bg-primary-800 rounded-full mr-4">
                        <SearchIcon className="w-5 h-5 text-primary-600 dark:text-primary-300" />
                    </div>
                    <div>
                        <p className="font-semibold text-primary-800 dark:text-primary-200">Buscar Alumno</p>
                        <p className="text-xs text-primary-600 dark:text-primary-400">Consultar estado de cuenta y detalles.</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

const DollarSignIcon = ({className="w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 12v-2m0-10a9 9 0 110 18 9 9 0 010-18z" /></svg>;
const SearchIcon = ({className = "w-6 h-6"}) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

export default QuickActions;
