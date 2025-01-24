import { useState, useEffect } from "react";
import { createInvoice, fetchPatientById } from "../api";
import styled from "styled-components";
import Page from "../components/Page";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Form = styled.form`
    margin: 2rem;
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    button {
        background-color: aquamarine;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        padding: 10px 15px;
        color: black;
        width: fit-content;
    }
`;

const CreateInvoice = () => {
    const { patientId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState("");
    const [patient, setPatient] = useState(null);

    // Fetch the patient details using patientId from params
    useEffect(() => {
        const loadPatient = async () => {
            try {
                const data = await fetchPatientById(patientId, token);
                setPatient(data);
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };
        loadPatient();
    }, [patientId, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare invoice data
            const invoiceData = {
                total_amount: totalAmount,
                patient: patientId,
            };

            // Create the invoice
            await createInvoice(invoiceData, token);
            navigate(`/invoices/${patientId}`);
        } catch (error) {
            console.error("Error creating invoice:", error);
        }
    };

    return (
        <Page>
            <Form onSubmit={handleSubmit}>
                <h3>Create Invoice for {patient?.name}</h3>
                <input
                    type="number"
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="Enter total amount"
                    required
                />
                <button type="submit">Create Invoice</button>
            </Form>
        </Page>
    );
};

export default CreateInvoice;
