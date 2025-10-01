import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// FIX: Import InvoiceStatus to use for filtering invoices.
import { Student, InvoiceStatus } from '../types';

const API_KEY = 'AIzaSyCh-hVWnTOcr5eoIUQKulW91g4WeWRM-VY';

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const getPaymentHistoryNotes = (student: Student): string => {
    if (student.paymentHistory.length === 0) {
        return "Sin historial de pagos registrado.";
    }
    const latePayments = student.paymentHistory.filter(p => p.concept.toLowerCase().includes('tardío')).length;
    if (latePayments > 1) {
        return `Tiene un historial de ${latePayments} pagos tardíos.`;
    }
    if (latePayments === 1) {
        return `Tiene un pago tardío registrado.`;
    }
    return `Generalmente paga a tiempo.`;
};


export const generateReminderMessage = async (student: Student): Promise<string> => {
    // FIX: The Student type does not have dueAmount or dueDate. They are derived from invoices.
    const unpaidInvoices = student.invoices.filter(
        (inv) => inv.status !== InvoiceStatus.Paid && inv.status !== InvoiceStatus.Cancelled
    );

    if (unpaidInvoices.length === 0) {
        return "El alumno no tiene adeudos pendientes.";
    }

    const dueAmount = unpaidInvoices.reduce((acc, inv) => acc + inv.balance, 0);

    const overdueInvoices = unpaidInvoices.filter(inv => inv.status === InvoiceStatus.Overdue);
    
    const mostUrgentInvoice = (overdueInvoices.length > 0 ? overdueInvoices : unpaidInvoices)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    
    const dueDate = mostUrgentInvoice.dueDate;

    if (!API_KEY) {
        return Promise.resolve(`Estimado/a ${student.name}, este es un recordatorio de que su pago de $${dueAmount.toFixed(2)} MXN con fecha de vencimiento ${dueDate} está pendiente. (Mensaje de demostración: API Key no configurada)`);
    }

    const paymentNotes = getPaymentHistoryNotes(student);
    
    const prompt = `
        Eres un asistente de cobranza profesional y cortés para una prestigiosa escuela de enfermería. Tu objetivo es recordar a un alumno sobre su pago vencido, manteniendo siempre una relación positiva y profesional.

        Detalles del Alumno:
        - Nombre: ${student.name}
        - Monto Vencido: $${dueAmount.toFixed(2)} MXN
        - Fecha de Vencimiento: ${dueDate}
        - Notas sobre su historial de pagos: ${paymentNotes}

        Basado en estos detalles, genera un mensaje de WhatsApp conciso y personalizado en español. 
        - Si el alumno tiene un buen historial de pagos, el tono debe ser un recordatorio muy amable.
        - Si tiene un historial de pagos tardíos, el tono debe ser más firme pero siempre profesional y respetuoso.
        - El mensaje debe ser breve, claro y motivar a la acción (realizar el pago o comunicarse).
        - No incluyas saludos genéricos como "Espero que este mensaje te encuentre bien". Ve directo al punto de forma amable.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating reminder message:", error);
        return "Hubo un error al generar el mensaje. Por favor, inténtelo de nuevo.";
    }
};

export const generateDashboardSummary = async (data: { totalCollected: number, totalDue: number, overdueCount: number, highRiskCount: number }): Promise<string> => {
    if (!API_KEY) {
        // Fix: Access properties from the 'data' object.
        return Promise.resolve(`Resumen de Cobranza: ${data.overdueCount} alumnos con pagos vencidos. ${data.highRiskCount} alumnos en alto riesgo. Tasa de cobranza: ${((data.totalCollected / (data.totalDue || 1)) * 100).toFixed(1)}%. (Resumen de demostración: API Key no configurada)`);
    }

    const prompt = `
        Eres un IA de análisis financiero para el director de finanzas de una escuela. Analiza los siguientes datos de cobranza del mes y proporciona un resumen ejecutivo conciso en español.

        Datos Clave:
        - Total Recaudado este mes: $${data.totalCollected.toLocaleString('es-MX')} MXN
        - Total por Cobrar este mes: $${data.totalDue.toLocaleString('es-MX')} MXN
        - Alumnos con Pagos Vencidos: ${data.overdueCount}
        - Alumnos en Alto Riesgo (predicción): ${data.highRiskCount}
        
        Tu tarea es generar una narrativa breve (2-3 frases) que destaque:
        1. El estado general de la cobranza (calcula el porcentaje de recaudación).
        2. El punto más crítico o de mayor preocupación (ej. el número de alumnos en alto riesgo).
        3. Una recomendación accionable y clara para mejorar la cobranza el próximo mes.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating dashboard summary:", error);
        return "No se pudo generar el resumen ejecutivo. Verifique la conexión con la API.";
    }
};
