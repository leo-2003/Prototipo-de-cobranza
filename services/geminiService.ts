
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Student, InvoiceStatus, CashFlowForecastData } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Handles errors from the Gemini API, throwing a more specific, user-friendly error.
 * @param error The original error caught.
 * @param context A string describing the operation that failed (e.g., 'generating reminder message').
 * @throws An error with a user-friendly message.
 */
const handleGeminiError = (error: unknown, context: string): never => {
    console.error(`Error ${context}:`, error);
    if (error instanceof Error && (error.message.toLowerCase().includes('api key') || error.message.toLowerCase().includes('invalid'))) {
        throw new Error("La clave API de Gemini no está configurada o no es válida. Por favor, configure la variable de entorno API_KEY.");
    }
    throw new Error(`No se pudo completar la acción de "${context}". Inténtelo de nuevo.`);
};


const getPaymentHistoryNotes = (student: Student): string => {
    if (student.paymentHistory.length === 0) {
        return "Sin historial de pagos registrado.";
    }
    const latePayments = student.paymentHistory.filter(p => {
        const paymentDate = new Date(p.date);
        const relatedInvoice = student.invoices.find(inv => inv.id === p.invoiceId);
        if (!relatedInvoice) return false;
        const dueDate = new Date(relatedInvoice.dueDate);
        return paymentDate > dueDate;
    }).length;

    if (latePayments > 1) {
        return `Tiene un historial de ${latePayments} pagos tardíos.`;
    }
    if (latePayments === 1) {
        return `Tiene un pago tardío registrado.`;
    }
    return `Generalmente paga a tiempo.`;
};


export const generateReminderMessage = async (student: Student): Promise<string> => {
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
    
    const paymentNotes = getPaymentHistoryNotes(student);
    
    const prompt = `
        Eres un asistente de cobranza profesional y cortés para una prestigiosa escuela de enfermería. Tu objetivo es recordar a un alumno sobre su pago vencido, manteniendo siempre una relación positiva y profesional.

        Detalles del Alumno:
        - Nombre: ${student.name}
        - Monto Vencido Total: $${dueAmount.toFixed(2)} MXN
        - Fecha de Vencimiento más próxima: ${dueDate}
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
        handleGeminiError(error, 'generar mensaje de recordatorio');
    }
};

export const generateDashboardSummary = async (data: { totalCollected: number, totalDue: number, overdueCount: number, highRiskCount: number }): Promise<string> => {
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
        handleGeminiError(error, 'generar resumen ejecutivo');
    }
};


export const generateCashFlowForecast = async (students: Student[]): Promise<CashFlowForecastData> => {
    const studentDataForPrompt = students.map(s => ({
        id: s.id,
        riskLevel: s.riskLevel,
        paymentHistoryNotes: getPaymentHistoryNotes(s),
        pendingInvoices: s.invoices
            .filter(inv => inv.status === InvoiceStatus.Overdue || inv.status === InvoiceStatus.Sent)
            .map(inv => ({
                dueDate: inv.dueDate,
                balance: inv.balance,
            })),
    }));

    const prompt = `
      Eres un analista financiero experto en predicción de flujo de efectivo para instituciones educativas.
      Tu tarea es analizar los datos de los alumnos y sus facturas pendientes para crear un pronóstico de ingresos de efectivo para los próximos 3 meses.
      
      Considera los siguientes factores en tu análisis:
      1.  **Fechas de Vencimiento:** Las facturas vencidas tienen más probabilidad de ser pagadas pronto.
      2.  **Nivel de Riesgo:** Un alumno de 'Alto' riesgo tiene más probabilidad de pagar tarde o no pagar, comparado con uno de 'Bajo' riesgo.
      3.  **Historial de Pagos:** Las notas sobre pagos tardíos son un indicador clave del comportamiento futuro.
      
      Datos de Alumnos:
      ${JSON.stringify(studentDataForPrompt)}

      Basado en estos datos, proporciona un pronóstico realista. No asumas que el 100% de lo adeudado será pagado. Aplica un factor de probabilidad de pago basado en el riesgo y el historial.
      
      Devuelve tu análisis únicamente en formato JSON.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        forecast: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    month: { type: Type.STRING },
                                    predictedIncome: { type: Type.NUMBER },
                                    notes: { type: Type.STRING }
                                },
                                required: ["month", "predictedIncome", "notes"]
                            }
                        },
                        summary: { type: Type.STRING }
                    },
                    required: ["forecast", "summary"]
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CashFlowForecastData;

    } catch (error) {
        handleGeminiError(error, 'generar pronóstico de flujo de efectivo');
    }
};
