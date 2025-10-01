
import React, { useState, useCallback } from 'react';
import { Student, CashFlowForecastData } from '../../types';
import { generateCashFlowForecast } from '../../services/geminiService';

interface CashFlowForecastProps {
    students: Student[];
}

const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ students }) => {
    const [forecast, setForecast] = useState<CashFlowForecastData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateForecast = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await generateCashFlowForecast(students);
            setForecast(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Hubo un error inesperado al generar el pronóstico.');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [students]);

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md h-full flex flex-col">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Pronóstico de Flujo de Efectivo (IA)</h3>
            <div className="flex-grow mt-4">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                        <p className="ml-3 text-neutral-500">Analizando datos históricos y pendientes...</p>
                    </div>
                )}
                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-sm text-red-800 dark:text-red-200 h-full flex flex-col justify-center">
                        <p className="font-bold mb-1">Error de Pronóstico</p>
                        <p>{error}</p>
                    </div>
                )}
                {!isLoading && !error && forecast && (
                    <div>
                         <div className="p-4 mb-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm text-primary-800 dark:text-primary-200">
                           <p className="font-semibold mb-1">Resumen del Analista IA:</p>
                           {forecast.summary}
                         </div>
                         <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b dark:border-neutral-700">
                                    <th className="text-left font-medium py-2">Mes</th>
                                    <th className="text-right font-medium py-2">Ingreso Estimado</th>
                                </tr>
                            </thead>
                            <tbody>
                            {forecast.forecast.map((item, index) => (
                                <tr key={index} className="border-b dark:border-neutral-800">
                                    <td className="py-3">{item.month}</td>
                                    <td className="text-right font-semibold text-lg text-secondary-600 dark:text-secondary-400">${item.predictedIncome.toLocaleString('es-MX')}</td>
                                </tr>
                            ))}
                            </tbody>
                         </table>
                    </div>
                )}
                {!isLoading && !forecast && !error && (
                     <div className="text-center text-neutral-400 dark:text-neutral-500 h-full flex flex-col justify-center items-center">
                         <p>La IA analizará el comportamiento de pago para predecir los ingresos futuros.</p>
                     </div>
                )}
            </div>
             <button
                onClick={handleGenerateForecast}
                disabled={isLoading}
                className="w-full mt-4 bg-primary-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-primary-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {isLoading ? 'Calculando...' : 'Generar Pronóstico'}
                <SparklesIcon className="ml-2"/>
            </button>
        </div>
    );
};

const SparklesIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M9 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25A.75.75 0 019 4.5zM12.75 8.663a.75.75 0 00-1.5 0V12a.75.75 0 001.5 0V8.663zM16.5 4.5a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zM15 9.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546a.75.75 0 01.75-.75zM8.25 10.5a.75.75 0 00-1.5 0V14.25a.75.75 0 001.5 0v-3.75zM12 12.75a.75.75 0 01.75.75v3.546a.75.75 0 01-1.5 0v-3.546A.75.75 0 0112 12.75zM11.25 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM15.75 3.53a.75.75 0 00-1.5 0v.53a.75.75 0 001.5 0v-.53zM12 19.5a.75.75 0 01.75.75v.53a.75.75 0 01-1.5 0v-.53A.75.75 0 0112 19.5z" clipRule="evenodd" /></svg>;

export default CashFlowForecast;