import React from 'react';
import { Invoice, Payment, InvoiceStatus } from '../../types';

interface InvoiceDetailsProps {
    invoices: Invoice[];
    paymentHistory: Payment[];
}

const getStatusClasses = (status: InvoiceStatus): string => {
  switch (status) {
    case InvoiceStatus.Paid:
      return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300';
    case InvoiceStatus.Sent:
      return 'bg-accent-info-500/20 text-accent-info-500 dark:bg-accent-info-500/20 dark:text-blue-400';
    case InvoiceStatus.Overdue:
      return 'bg-accent-danger-500/10 text-accent-danger-500 dark:bg-accent-danger-500/20 dark:text-red-400';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

const InvoiceStatusBadge: React.FC<{ status: InvoiceStatus }> = ({ status }) => {
  const classes = getStatusClasses(status);
  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>
      {status}
    </span>
  );
};

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoices, paymentHistory }) => {
    return (
        <div className="p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-inner">
            <h4 className="font-bold text-md mb-3">Detalle Financiero</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-sm">
                <div className="md:col-span-3">
                    <h5 className="font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Facturas</h5>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="text-xs text-neutral-500 uppercase">
                                <tr>
                                    <th className="py-2 px-3 text-left">Folio</th>
                                    <th className="py-2 px-3 text-left">Vencimiento</th>
                                    <th className="py-2 px-3 text-left">Estado</th>
                                    <th className="py-2 px-3 text-right">Saldo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {invoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td className="py-2 px-3 font-medium">{invoice.folio}</td>
                                        <td className="py-2 px-3">{invoice.dueDate}</td>
                                        <td className="py-2 px-3"><InvoiceStatusBadge status={invoice.status} /></td>
                                        <td className="py-2 px-3 text-right font-mono">${invoice.balance.toLocaleString('es-MX')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                 <div className="md:col-span-2">
                    <h5 className="font-semibold text-neutral-600 dark:text-neutral-400 mb-2">Últimos Pagos</h5>
                    <ul className="space-y-1">
                        {paymentHistory.slice(0, 4).map(p => (
                            <li key={p.id} className="flex justify-between p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700/50">
                                <span className="text-neutral-600 dark:text-neutral-300">{p.concept} <span className="text-xs">({p.date})</span></span>
                                <span className="font-medium font-mono">${p.amount.toLocaleString('es-MX')}</span>
                            </li>
                        ))}
                        {paymentHistory.length === 0 && <li className="text-neutral-500 italic">Sin pagos registrados.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;