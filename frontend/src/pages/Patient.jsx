import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    fetchReportsByPatient,
    fetchInvoicesByPatient,
    fetchImagesByPatient,
    fetchMedicalStaffById,
    fetchPatientById,
    fetchPaymentByInvoice,
} from "../api";
import styled from "styled-components";
import Page from "../components/Page";

const Wrapper = styled.div`
    margin: 2rem;

    h3 {
        margin-bottom: 2rem;
    }
`;

const Section = styled.div`
    margin-bottom: 3rem;
`;

const Card = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    width: 100%;
    margin-bottom: 1rem;
`;

const Gallery = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

const ImageCard = styled.div`
    background: white;
    padding: 1rem;
    border-radius: 8px;
    width: 300px;

    img {
        height: 200px;
        width: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 4px;
    }

    p {
        margin-top: 1rem;
        text-align: center;
    }
`;

const PatientDashboard = () => {
    const { token, user } = useAuth();
    const [patient, setPatient] = useState(null);
    const [reports, setReports] = useState([]);
    const [invoicesWithPayments, setInvoicesWithPayments] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPatientData = async () => {
            try {
                const patientData = await fetchPatientById(user.id - 11, token);
                setPatient(patientData);
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };

        const loadReports = async () => {
            try {
                const reportData = await fetchReportsByPatient(user.id - 11, token);
                const enrichedReports = await Promise.all(
                    reportData.map(async (report) => {
                        const medicalStaffData = await fetchMedicalStaffById(report.medical_staff, token);
                        return { ...report, medical_staff: medicalStaffData };
                    })
                );
                setReports(enrichedReports);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        const loadInvoicesWithPayments = async () => {
            try {
                const invoices = await fetchInvoicesByPatient(user.id - 11, token);
                const enrichedInvoices = await Promise.all(
                    invoices.map(async (invoice) => {
                        try {
                            const payment = await fetchPaymentByInvoice(invoice.invoice_id, token);
                            return { ...invoice, payment };
                        } catch (error) {
                            console.error(`Error fetching payment for invoice ${invoice.invoice_id}:`, error);
                            return { ...invoice };
                        }
                    })
                );
                setInvoicesWithPayments(enrichedInvoices);
            } catch (error) {
                console.error("Error fetching invoices or payments:", error);
            }
        };

        const loadImages = async () => {
            try {
                const imagesData = await fetchImagesByPatient(user.id - 11, token);
                setImages(imagesData);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };

        const loadData = async () => {
            setLoading(true);
            await Promise.all([loadPatientData(), loadReports(), loadInvoicesWithPayments(), loadImages()]);
            setLoading(false);
        };

        loadData();
    }, [user.id, token]);

    if (loading) {
        return <Page>Loading patient data...</Page>;
    }

    return (
        <Page>
            <Wrapper>
                <h3>Patient Dashboard for {patient?.name}</h3>

                {/* Reports Section */}
                <Section>
                    <h3>Diagnostic Reports</h3>
                    <ul>
                        {reports.map((report) => (
                            <Card key={report.report_id}>
                                <p>Diagnosis: {report.diagnosis}</p>
                                <p>Report Date: {report.report_date}</p>
                                <p>Medical Staff: {report.medical_staff?.name}</p>
                                <p>Images: {report.images.length}</p>
                            </Card>
                        ))}
                    </ul>
                </Section>

                {/* Images Section */}
                <Section>
                    <h3>Images</h3>
                    {images.length ? (
                        <Gallery>
                            {images.map((image) => (
                                <ImageCard key={image.image_id}>
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${image.file}`}
                                        alt={`${image.type} image`}
                                    />
                                    <p>{image.type} - {image.classification} - {image.timestamp}</p>
                                </ImageCard>
                            ))}
                        </Gallery>
                    ) : (
                        <p>No images found for this patient.</p>
                    )}
                </Section>

                {/* Invoices and Payments Section */}
                <Section>
                    <h3>Invoices & Payments</h3>
                    <ul>
                        {invoicesWithPayments.map((invoice) => (
                            <Card key={invoice.invoice_id}>
                                <p>Total Amount: £{invoice.total_amount}</p>
                                <p>Date Issued: {invoice.date_issued}</p>
                                {invoice.payment ? (
                                    <strong>Payment: {invoice.payment.payment_method}</strong>
                                ) : (
                                    <p>No payment recorded for this invoice.</p>
                                )}
                            </Card>
                        ))}
                    </ul>
                </Section>
            </Wrapper>
        </Page>
    );
};

export default PatientDashboard;
