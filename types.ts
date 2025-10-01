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

export interface Payment {
  id: string;
  amount: number;
  date: string;
  concept: string;
  invoiceId?: string; // Asocia un pago a una factura específica
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
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
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  // Deprecated fields, logic now derived from invoices
  // status: PaymentStatus;
  // dueDate: string;
  // dueAmount: number;
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
