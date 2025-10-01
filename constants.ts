import { Student, InvoiceStatus } from './types';

export const MOCK_STUDENTS: Student[] = [
  {
    id: 'S001',
    name: 'Ana García Pérez',
    avatar: 'https://picsum.photos/seed/S001/100/100',
    email: 'ana.garcia@example.com',
    riskLevel: 'Alto',
    paymentHistory: [
      { id: 'P001', amount: 3500, date: '2024-06-08', concept: 'Colegiatura Junio', invoiceId: 'INV-001' },
      { id: 'P002', amount: 3500, date: '2024-05-05', concept: 'Colegiatura Mayo', invoiceId: 'INV-000' },
    ],
    lastCommunication: '2024-07-10',
    invoices: [
        { id: 'INV-002', folio: 'F-2024-002', items: [{id: 'I-01', description: 'Colegiatura Julio', amount: 3500}], issueDate: '2024-07-01', dueDate: '2024-07-05', status: InvoiceStatus.Overdue, totalAmount: 3500, paidAmount: 0, balance: 3500 },
        { id: 'INV-001', folio: 'F-2024-001', items: [{id: 'I-02', description: 'Colegiatura Junio', amount: 3500}], issueDate: '2024-06-01', dueDate: '2024-06-05', status: InvoiceStatus.Paid, totalAmount: 3500, paidAmount: 3500, balance: 0 },
    ]
  },
  {
    id: 'S002',
    name: 'Luis Martínez Hernández',
    avatar: 'https://picsum.photos/seed/S002/100/100',
    email: 'luis.martinez@example.com',
    riskLevel: 'Bajo',
    paymentHistory: [
      { id: 'P003', amount: 3500, date: '2024-07-01', concept: 'Colegiatura Julio', invoiceId: 'INV-003' },
      { id: 'P004', amount: 3500, date: '2024-06-02', concept: 'Colegiatura Junio', invoiceId: 'INV-004' },
    ],
    lastCommunication: 'N/A',
    invoices: [
        { id: 'INV-005', folio: 'F-2024-005', items: [{id: 'I-03', description: 'Colegiatura Agosto', amount: 3500}], issueDate: '2024-08-01', dueDate: '2024-08-05', status: InvoiceStatus.Sent, totalAmount: 3500, paidAmount: 0, balance: 3500 },
        { id: 'INV-003', folio: 'F-2024-003', items: [{id: 'I-04', description: 'Colegiatura Julio', amount: 3500}], issueDate: '2024-07-01', dueDate: '2024-07-05', status: InvoiceStatus.Paid, totalAmount: 3500, paidAmount: 3500, balance: 0 },
    ]
  },
  {
    id: 'S003',
    name: 'Sofía Rodríguez López',
    avatar: 'https://picsum.photos/seed/S003/100/100',
    email: 'sofia.rodriguez@example.com',
    riskLevel: 'Bajo',
    paymentHistory: [
      { id: 'P005', amount: 3500, date: '2024-07-05', concept: 'Colegiatura Julio', invoiceId: 'INV-006' },
    ],
    lastCommunication: 'N/A',
    invoices: [
        { id: 'INV-007', folio: 'F-2024-007', items: [{id: 'I-05', description: 'Colegiatura Agosto', amount: 3500}], issueDate: '2024-08-01', dueDate: '2024-08-05', status: InvoiceStatus.Sent, totalAmount: 3500, paidAmount: 0, balance: 3500 },
        { id: 'INV-006', folio: 'F-2024-006', items: [{id: 'I-06', description: 'Colegiatura Julio', amount: 3500}], issueDate: '2024-07-01', dueDate: '2024-07-05', status: InvoiceStatus.Paid, totalAmount: 3500, paidAmount: 3500, balance: 0 },
    ]
  },
  {
    id: 'S004',
    name: 'Carlos Sánchez González',
    avatar: 'https://picsum.photos/seed/S004/100/100',
    email: 'carlos.sanchez@example.com',
    riskLevel: 'Medio',
    paymentHistory: [
        { id: 'P006', amount: 3500, date: '2024-06-10', concept: 'Colegiatura Junio (Tardío)', invoiceId: 'INV-008' },
    ],
    lastCommunication: '2024-07-11',
    invoices: [
        { id: 'INV-009', folio: 'F-2024-009', items: [{id: 'I-07', description: 'Colegiatura Julio', amount: 3750}], issueDate: '2024-07-01', dueDate: '2024-07-05', status: InvoiceStatus.Overdue, totalAmount: 3750, paidAmount: 0, balance: 3750 },
        { id: 'INV-008', folio: 'F-2024-008', items: [{id: 'I-08', description: 'Colegiatura Junio', amount: 3500}], issueDate: '2024-06-01', dueDate: '2024-06-05', status: InvoiceStatus.Paid, totalAmount: 3500, paidAmount: 3500, balance: 0 },
    ]
  },
  {
    id: 'S005',
    name: 'Valentina Gómez Díaz',
    avatar: 'https://picsum.photos/seed/S005/100/100',
    email: 'valentina.gomez@example.com',
    riskLevel: 'Bajo',
    paymentHistory: [
        { id: 'P007', amount: 3500, date: '2024-07-03', concept: 'Colegiatura Julio', invoiceId: 'INV-010' },
    ],
    lastCommunication: 'N/A',
     invoices: [
        { id: 'INV-011', folio: 'F-2024-011', items: [{id: 'I-09', description: 'Colegiatura Agosto', amount: 3500}], issueDate: '2024-08-01', dueDate: '2024-08-05', status: InvoiceStatus.Sent, totalAmount: 3500, paidAmount: 0, balance: 3500 },
        { id: 'INV-010', folio: 'F-2024-010', items: [{id: 'I-10', description: 'Colegiatura Julio', amount: 3500}], issueDate: '2024-07-01', dueDate: '2024-07-05', status: InvoiceStatus.Paid, totalAmount: 3500, paidAmount: 3500, balance: 0 },
    ]
  },
   {
    id: 'S006',
    name: 'Javier Fernández Cruz',
    avatar: 'https://picsum.photos/seed/S006/100/100',
    email: 'javier.fernandez@example.com',
    riskLevel: 'Alto',
    paymentHistory: [
        { id: 'P008', amount: 3500, date: '2024-05-05', concept: 'Colegiatura Mayo', invoiceId: 'INV-012' },
    ],
    lastCommunication: '2024-07-09',
    invoices: [
        { id: 'INV-014', folio: 'F-2024-014', items: [{id: 'I-11', description: 'Colegiatura Julio', amount: 3500}], issueDate: '2024-07-01', dueDate: '2024-07-05', status: InvoiceStatus.Overdue, totalAmount: 3500, paidAmount: 0, balance: 3500 },
        { id: 'INV-013', folio: 'F-2024-013', items: [{id: 'I-12', description: 'Colegiatura Junio', amount: 3500}], issueDate: '2024-06-01', dueDate: '2024-06-05', status: InvoiceStatus.Overdue, totalAmount: 3500, paidAmount: 0, balance: 3500 },
        { id: 'INV-012', folio: 'F-2024-012', items: [{id: 'I-13', description: 'Colegiatura Mayo', amount: 3500}], issueDate: '2024-05-01', dueDate: '2024-05-05', status: InvoiceStatus.Paid, totalAmount: 3500, paidAmount: 3500, balance: 0 },
    ]
  }
];
