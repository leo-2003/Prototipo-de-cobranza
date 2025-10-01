
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Ene', Cobrado: 400000, Pendiente: 240000 },
  { name: 'Feb', Cobrado: 300000, Pendiente: 139800 },
  { name: 'Mar', Cobrado: 500000, Pendiente: 280000 },
  { name: 'Abr', Cobrado: 478000, Pendiente: 190800 },
  { name: 'May', Cobrado: 589000, Pendiente: 180000 },
  { name: 'Jun', Cobrado: 439000, Pendiente: 380000 },
  { name: 'Jul', Cobrado: 449000, Pendiente: 430000 },
];

const CollectionChart: React.FC = () => {
    return (
        <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md h-[400px]">
            <h3 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-100">Rendimiento de Cobranza Mensual</h3>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#a3a3a3', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px',
                            color: '#171717'
                        }}
                        cursor={{fill: 'rgba(12, 140, 233, 0.1)'}}
                    />
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="Cobrado" fill="#0c8ce9" name="Cobrado" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Pendiente" fill="#b9ddfe" name="Pendiente" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CollectionChart;
