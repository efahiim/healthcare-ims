import { useEffect, useState } from "react";
import { fetchInvoicesByPatient, fetchPatientById, fetchPaymentByInvoice } from "../api";
import styled from "styled-components";
import Page from "../components/Page";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Wrapper = styled.div`
    margin: 2rem;

    h3 {
        margin-bottom: 2rem;
    }
`;

const Card = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    width: 100%;
    margin-bottom: 1rem;

    strong {
        text-transform: capitalize;
    }
`;

const ViewInvoicesAndPayments = () => {
    const { patientId } = useParams();
    const { token } = useAuth();
    const [invoicesWithPayments, setInvoicesWithPayments] = useState([]);
    const [patient, setPatient] = useState(null);

    // Fetch patient details using patientId from params
    useEffect(() => {
        const loadPatient = async () => {
            try {
                const data = await fetchPatientById(patientId, token);
                setPatient(data); // Store patient data
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };
        loadPatient();
    }, [patientId, token]);

    // Fetch invoices and their respective payments
    useEffect(() => {
        const loadInvoicesWithPayments = async () => {
            try {
                const invoices = await fetchInvoicesByPatient(patientId, token);
                
                // Fetch payments for each invoice and store in a new array
                const invoicesWithPaymentsData = await Promise.all(
                    invoices.map(async (invoice) => {
                        try {
                            const payment = await fetchPaymentByInvoice(invoice.invoice_id, token);
                            return { ...invoice, payment };
                        } catch (error) {
                            console.error(`Error fetching payment for invoice ${invoice.invoice_id}:`, error);
                            return { ...invoice };  // Return the invoice without the payment
                        }
                    })
                );

                setInvoicesWithPayments(invoicesWithPaymentsData);
            } catch (error) {
                console.error("Error fetching invoices or payments:", error);
            }
        };

        loadInvoicesWithPayments();
    }, [patientId, token]);

    return (
        <Page>
            <Wrapper>
                <h3>Invoices & Payments for {patient?.name}</h3>
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
            </Wrapper>
        </Page>
    );
};

export default ViewInvoicesAndPayments;
