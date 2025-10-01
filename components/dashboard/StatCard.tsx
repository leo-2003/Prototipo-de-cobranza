import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    // Fix: Changed JSX.Element to React.ReactNode to resolve namespace error.
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
    const isIncrease = changeType === 'increase';
    const changeColor = isIncrease ? 'text-secondary-500' : 'text-accent-danger-500';

    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 glassmorphism">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mt-1">{value}</p>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full text-primary-600 dark:text-primary-400">
                    {icon}
                </div>
            </div>
            <div className="flex items-center mt-4">
                <span className={`text-sm font-semibold ${changeColor}`}>{change}</span>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-2">vs mes anterior</span>
            </div>
        </div>
    );
};

export default StatCard;
