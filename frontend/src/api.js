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

export const fetchImagesByPatient = async (patientId, token) => {
    const response = await api.get("api/images/", {
        params: { patient_id: patientId },
        headers: {
            Authorization: `Token ${token}`,
        },
    });
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

export const fetchUsers = async (token) => {
    const response = await api.get("api/users/", {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const fetchInvoices = async (token) => {
    const response = await api.get("api/invoices/", {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const fetchMedicalStaff = async (token) => {
    const response = await api.get("api/medical-staff/", {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const fetchMedicalStaffById = async (id, token) => {
    const response = await api.get(`api/medical-staff/${id}`, {
        headers: {
            Authorization: `Token ${token}`
        },
    });
    return response.data;
};

export const createMedicalStaff = async (medicalStaffData, token) => {
    const response = await api.post("api/auth/register/medical-staff/", medicalStaffData, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const updateMedicalStaff = async (staffId, updatedData, token) => {
    const response = await api.put(`api/medical-staff/${staffId}/`, updatedData, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const deleteMedicalStaff = async (staffId, token) => {
    const response = await api.delete(`api/medical-staff/${staffId}/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const fetchPatients = async (token) => {
    const response = await api.get("api/patients/", {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const fetchPatientById = async (id, token) => {
    const response = await api.get(`api/patients/${id}`, {
        headers: {
            Authorization: `Token ${token}`
        },
    });
    return response.data;
};

export const createPatient = async (patientData, token) => {
    const response = await api.post("api/auth/register/patient/", patientData, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const updatePatient = async (patientId, updatedData, token) => {
    const response = await api.put(`api/patients/${patientId}/`, updatedData, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};

export const deletePatient = async (patientId, token) => {
    const response = await api.delete(`api/patients/${patientId}/`, {
        headers: {
            Authorization: `Token ${token}`,
        },
    });
    return response.data;
};
