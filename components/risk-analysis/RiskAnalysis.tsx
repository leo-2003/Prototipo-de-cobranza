
import React, { useState, useCallback } from 'react';
import { generateDashboardSummary } from '../../services/geminiService';

interface RiskAnalysisProps {
    totalCollected: number;
    totalDue: number;
    overdueCount: number;
    highRiskCount: number;
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ totalCollected, totalDue, overdueCount, highRiskCount }) => {
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateSummary = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSummary('');
        try {
            const result = await generateDashboardSummary({
                totalCollected,
                totalDue,
                overdueCount,
                highRiskCount
            });
            setSummary(result);
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Ocurrió un error inesperado al generar el resumen.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [totalCollected, totalDue, overdueCount, highRiskCount]);
    
    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Análisis de Riesgo con IA</h3>
            <div className="flex-grow mt-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <p className="ml-3 text-neutral-500">Generando insights...</p>
                    </div>
                ) : error ? (
                     <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-800 dark:text-red-200 h-full flex flex-col justify-center">
                        <p className="font-bold mb-1">Error de Análisis</p>
                        <p>{error}</p>
                    </div>
                ) : summary ? (
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm text-primary-800 dark:text-primary-200 leading-relaxed">
                        <p>{summary}</p>
                    </div>
                ) : (
                    <div className="text-center text-neutral-400 dark:text-neutral-500 h-full flex flex-col justify-center">
                        <p>Haga clic para obtener un resumen ejecutivo y recomendaciones de la IA.</p>
                    </div>
                )}
            </div>
            <button
                onClick={handleGenerateSummary}
                disabled={isLoading}
                className="w-full mt-4 bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? 'Analizando...' : 'Generar Resumen Ejecutivo'}
                <SparklesIcon className="ml-2"/>
            </button>
        </div>
    );
};

const SparklesIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zM12.75 8.663a.75.75 0 00-1.5 0V12a.75.75 0 001.5 0V8.663zM16.5 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zM15 9.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546a.75.75 0 01.75-.75zM8.25 10.5a.75.75 0 00-1.5 0V14.25a.75.75 0 001.5 0v-3.75zM12 12.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546A.75.75 0 0112 12.75zM11.25 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM15.75 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM12 19.5a.75.75 0 01.75.75v.53a.75.75 0 01-1.5 0v-.53A.75.75 0 0112 19.5z" clipRule="evenodd" /></svg>;


export default RiskAnalysis;
