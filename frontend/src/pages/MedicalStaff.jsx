import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    fetchPatients,
    fetchInvoices,
} from "../api";
import "../styles/Dashboard.css";
import Page from "../components/Page";
import styled from 'styled-components';

const Dashboard = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 2rem;
`;

const Card = styled.div`
    background: white;
    padding: 1.5rem;
    /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
    border-radius: 8px;
    width: 100%;

    button {
        background-color: aquamarine;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        padding: 10px 15px;
        color: black;
    }

    ul {
        list-style-type: none;
        margin: 1rem 0;

        li {
            margin: 0.5rem 0;
        }
    }

    span.name {
        font-weight: bold;
    }

    span.role {
        text-transform: capitalize;
    }

    span.status {
        text-transform: capitalize;

        &.active {
            color: green;
        }

        &.retired {
            color: red;
        }
    }
`;

const MedicalStaff = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }

        const fetchData = async () => {
            try {
                const [patientResponse, invoiceResponse] = await Promise.all([
                    fetchPatients(token),
                    fetchInvoices(token),
                ]);

                setPatients(patientResponse);
                setInvoices(invoiceResponse);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    if (!user) {
        return <p>Unauthorized! Please login first.</p>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleAddPatient = () => {
        navigate("/add-patient");
    };

    return (
        <Page>
            <Dashboard>
                    <Card>
                        <h3>Patients ({patients?.length})</h3>
                        <ul>
                            {patients?.map((patient, index) => (
                                <li key={patient.id}>
                                    {index + 1}. <span className="name">{patient.name}</span> - {patient.address} - {patient.conditions}
                                </li>
                            ))}
                        </ul>
                        <button onClick={handleAddPatient}>
                            Add Patient
                        </button>
                    </Card>

                    <Card>
                        <h3>Invoices ({invoices?.length} - £{invoices?.reduce((sum, invoice) => sum + invoice.total_amount, 0)})</h3>
                        <ul>
                            {invoices?.map((invoice) => (
                                <li key={invoice.id}>
                                    {invoice.date_issued} - £{invoice.total_amount}
                                </li>
                            ))}
                        </ul>
                    </Card>
            </Dashboard>
        </Page>
    );
};

export default MedicalStaff;
