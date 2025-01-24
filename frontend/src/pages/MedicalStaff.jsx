import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    fetchPatients,
    deletePatient,
} from "../api";
import Page from "../components/Page";
import styled from 'styled-components';

const Dashboard = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    padding: 2rem;
`;

const HeadingButton = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
`;

const Card = styled.div`
    background: white;
    padding: 1.5rem;
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

const Buttons = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    button.add {
        background-color: aquamarine;
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        padding: 10px 15px;
        color: black;
    }

    button.crud {
        border: 0;
        background-color: transparent;
        cursor: pointer;
        color: black;
        text-decoration: underline;

        &.delete {
            color: red;
        }

        &.other {
            color: teal;
        }
    }
`;

const ListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 7px;
    border-radius: 4px;
    transition: all .25s ease-in-out;

    &:hover {
        background-color: aquamarine;
    }
`;

const MedicalStaff = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }

        const fetchData = async () => {
            try {
                const [patientResponse] = await Promise.all([
                    fetchPatients(token),
                ]);

                setPatients(patientResponse);
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

    const handleDeletePatient = async (id) => {
        if (window.confirm("Are you sure you want to delete this patient?")) {
            try {
                await deletePatient(id, token);
                setPatients((prev) => prev.filter((patient) => patient.patient_id !== id));
                alert("Patient deleted successfully!");
            } catch (error) {
                console.error("Error deleting patient:", error);
            }
        }
    };

    return (
        <Page>
            <Dashboard>
                    <Card>
                        <HeadingButton>
                            <h3>Patients ({patients?.length})</h3>
                            <button onClick={handleAddPatient}>
                                Add Patient
                            </button>
                        </HeadingButton>
                        <ul>
                            {patients?.map((patient, index) => (
                                <ListItem key={patient.patient_id}>
                                    <div>
                                        {index + 1}. <span className="name">{patient.name}</span> - {patient.address} - {patient.conditions}
                                    </div>
                                    <Buttons>
                                        <button onClick={() => navigate(`/patients/${patient.patient_id}/reports`)} className="crud other">View Reports</button>
                                        <button onClick={() => navigate(`/patients/${patient.patient_id}/add-report`)} className="crud other">Add Report</button>
                                        <button onClick={() => navigate(`/patients/${patient.patient_id}/images`)} className="crud other">View Images</button>
                                        <button onClick={() => navigate(`/invoices/${patient.patient_id}`)} className="crud other">View Invoices</button>
                                        <button onClick={() => navigate(`/invoices/${patient.patient_id}/create`)} className="crud other">Create Invoice</button>
                                        <button onClick={() => navigate(`/update-patient/${patient.patient_id}`)} className="crud">Edit</button>
                                        <button onClick={() => handleDeletePatient(patient.patient_id)} className="crud delete">Delete</button>
                                    </Buttons>
                                </ListItem>
                            ))}
                        </ul>
                    </Card>
            </Dashboard>
        </Page>
    );
};

export default MedicalStaff;
