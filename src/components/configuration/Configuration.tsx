
import React from 'react';
import { Account } from '../../types';
import ChartOfAccounts from './ChartOfAccounts';

interface ConfigurationProps {
    chartOfAccounts: Account[];
}

const Configuration: React.FC<ConfigurationProps> = ({ chartOfAccounts }) => {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Configuración Contable</h1>
                <p className="mt-1 text-neutral-500">Gestione el catálogo de cuentas y otras configuraciones financieras.</p>
            </div>
            <ChartOfAccounts accounts={chartOfAccounts} />
        </div>
    );
};

export default Configuration;