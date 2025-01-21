import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const login = async (username, password) => {
    const response = await api.post("api/auth/login/", { username, password });
    return response.data;
};

export const logout = async (token) => {
    const response = await api.post(
        "api/auth/logout/",
        {},
        {
        headers: {
            Authorization: `Token ${token}`,
        },
        }
    );
    return response.data;
};

export const fetchImages = async () => {
    const response = await api.get("api/images/");
    return response.data;
};

export const createImage = async (imageData) => {
    const response = await api.post("api/images/", imageData);
    return response.data;
};

export const fetchInvoiceByPatient = async (patientId) => {
    const response = await api.get(`api/invoices/${patientId}/`);
    return response.data;
};

export const fetchReportsByPatient = async (patientId) => {
    const response = await api.get(`api/reports/${patientId}/`);
    return response.data;
};

export const createReport = async (reportData) => {
    const response = await api.post("api/reports/", reportData);
    return response.data;
};

export const fetchPaymentsByInvoice = async (invoiceId) => {
    const response = await api.get(`api/payments/${invoiceId}/`);
    return response.data;
};

export const createPayment = async (paymentData) => {
    const response = await api.post("api/payments/", paymentData);
    return response.data;
};
