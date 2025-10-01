
import React from 'react';
import { Student, Account } from '../../types';
import ArAgingReport from './ArAgingReport';
import IncomeStatement from './IncomeStatement';
import CashFlowForecast from './CashFlowForecast';
import FinancialRatios from './FinancialRatios';
import CohortAnalysis from './CohortAnalysis';
import DeferredRevenueReport from './DeferredRevenueReport';

interface ReportsProps {
    students: Student[];
    chartOfAccounts: Account[];
}

const Reports: React.FC<ReportsProps> = ({ students, chartOfAccounts }) => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Inteligencia Financiera y de Negocio</h1>
                <p className="mt-1 text-neutral-500">Análisis avanzados para la toma de decisiones estratégicas.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                    <ArAgingReport students={students} />
                </div>
                <div className="lg:col-span-1">
                    <FinancialRatios students={students} />
                </div>
                <div className="lg:col-span-2">
                    <IncomeStatement students={students} chartOfAccounts={chartOfAccounts} />
                </div>
                 <div className="lg:col-span-3">
                    <DeferredRevenueReport students={students} chartOfAccounts={chartOfAccounts} />
                </div>
                 <div className="lg:col-span-3">
                    <CohortAnalysis students={students} />
                </div>
                <div className="lg:col-span-3">
                    <CashFlowForecast students={students} />
                </div>
            </div>
        </div>
    );
};

export default Reports;
