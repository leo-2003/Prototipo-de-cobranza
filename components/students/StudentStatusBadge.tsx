
import React from 'react';
import { PaymentStatus } from '../../types';

interface StudentStatusBadgeProps {
  status: PaymentStatus;
}

export const getStatusClasses = (status: PaymentStatus): string => {
  switch (status) {
    case PaymentStatus.Paid:
      return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/50 dark:text-secondary-300';
    case PaymentStatus.Pending:
      return 'bg-accent-warning-500/20 text-accent-warning-500 dark:bg-accent-warning-500/20 dark:text-yellow-400';
    case PaymentStatus.Overdue:
      return 'bg-accent-danger-500/10 text-accent-danger-500 dark:bg-accent-danger-500/20 dark:text-red-400';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};


const StudentStatusBadge: React.FC<StudentStatusBadgeProps> = ({ status }) => {
  const classes = getStatusClasses(status);
  
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${classes}`}>
      {status}
    </span>
  );
};

export default StudentStatusBadge;
