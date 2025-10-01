
export enum UserRole {
  Administrator = 'Administrador',
  Cashier = 'Cajero/Recepcionista',
  ReadOnly = 'Solo Lectura',
}

export enum PaymentStatus {
  Paid = 'Pagado',
  Pending = 'Pendiente',
  Overdue = 'Vencido',
}

export enum InvoiceStatus {
  Draft = 'Borrador',
  Sent = 'Enviada',
  Paid = 'Pagada',
  Overdue = 'Vencida',
  Cancelled = 'Cancelada',
}

export interface Account {
  id: string;
  name: string;
  type: 'Ingreso' | 'Gasto' | 'Liability';
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  concept: string;
  invoiceId?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  accountId: string; 
}

export interface DeferredRevenueSchedule {
  startDate: string;
  endDate: string;
  recognitionMonths: number;
}

export interface Invoice {
  id: string;
  folio: string;
  items: InvoiceItem[];
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  deferredRevenueSchedule?: DeferredRevenueSchedule;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  enrollmentDate: string;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  paymentHistory: Payment[];
  lastCommunication: string;
  invoices: Invoice[];
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface CashFlowForecastData {
    forecast: Array<{
        month: string;
        predictedIncome: number;
        notes: string;
    }>;
    summary: string;
}
