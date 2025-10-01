
import React from 'react';
import { Account } from '../../types';

interface ChartOfAccountsProps {
    accounts: Account[];
}

const ChartOfAccounts: React.FC<ChartOfAccountsProps> = ({ accounts }) => {
    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Catálogo de Cuentas</h3>
                 <button className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600">
                    Agregar Cuenta
                 </button>
            </div>
           
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                    <thead className="bg-neutral-50 dark:bg-neutral-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">ID de Cuenta</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Nombre de Cuenta</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tipo</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                        {accounts.map(account => (
                            <tr key={account.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{account.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{account.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{account.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChartOfAccounts;