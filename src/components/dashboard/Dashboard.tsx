
import React from 'react';
import { Student, InvoiceStatus } from '../../types';
import StatCard from './StatCard';
import CollectionChart from './CollectionChart';
import RiskAnalysis from '../risk-analysis/RiskAnalysis';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import { View } from '../../App';

interface DashboardProps {
    students: Student[];
    setCurrentView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, setCurrentView }) => {
    const metrics = React.useMemo(() => {
        let totalCollected = 0;
        let totalPotential = 0;
        const overdueStudentsSet = new Set<string>();

        students.forEach(student => {
            let studentHasOverdue = false;
            student.invoices.forEach(invoice => {
                totalPotential += invoice.totalAmount;
                totalCollected += invoice.paidAmount;
                if (invoice.status === InvoiceStatus.Overdue) {
                    studentHasOverdue = true;
                }
            });
            if (studentHasOverdue) {
                overdueStudentsSet.add(student.id);
            }
        });
        
        const overdueCount = overdueStudentsSet.size;
        const totalDue = totalPotential - totalCollected;

        return { totalCollected, totalDue, overdueCount };
    }, [students]);

    const collectionRate = metrics.totalCollected + metrics.totalDue > 0 ? (metrics.totalCollected / (metrics.totalCollected + metrics.totalDue)) * 100 : 0;
    const highRiskStudents = students.filter(s => s.riskLevel === 'Alto').length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Tasa de Cobranza Hist." 
                    value={`${collectionRate.toFixed(1)}%`}
                    change="+5.2%"
                    changeType="increase"
                    icon={<TrendingUpIcon />}
                />
                <StatCard 
                    title="Total Recaudado (Hist.)" 
                    value={`$${metrics.totalCollected.toLocaleString('es-MX')}`}
                    change="+12.5%"
                    changeType="increase"
                    icon={<DollarSignIcon />}
                />
                <StatCard 
                    title="Alumnos con Adeudo" 
                    value={metrics.overdueCount.toString()}
                    change="-3"
                    changeType="decrease"
                    icon={<UsersIcon />}
                />
                <StatCard 
                    title="Alumnos en Riesgo" 
                    value={highRiskStudents.toString()}
                    change="+1"
                    changeType="increase"
                    icon={<AlertTriangleIcon />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CollectionChart />
                </div>
                <div className="flex flex-col gap-6">
                    <QuickActions setCurrentView={setCurrentView} />
                    <RiskAnalysis 
                      totalCollected={metrics.totalCollected}
                      totalDue={metrics.totalDue}
                      overdueCount={metrics.overdueCount}
                      highRiskCount={highRiskStudents}
                    />
                </div>
            </div>
            
            <div>
              <RecentActivity students={students} />
            </div>
        </div>
    );
};

const TrendingUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;

export default Dashboard;