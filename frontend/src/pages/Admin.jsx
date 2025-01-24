import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
    fetchUsers,
    fetchMedicalStaff,
    deleteMedicalStaff,
    fetchPatients,
    deletePatient,
    fetchInvoices,
} from "../api";
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
    border-radius: 8px;
    width: 100%;

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

const UsersCard = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
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

const Admin = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [medicalStaff, setMedicalStaff] = useState([]);
    const [patients, setPatients] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }

        const fetchData = async () => {
            try {
                const [userResponse, staffResponse, patientResponse, invoiceResponse] = await Promise.all([
                    fetchUsers(token),
                    fetchMedicalStaff(token),
                    fetchPatients(token),
                    fetchInvoices(token),
                ]);

                setUsers(userResponse);
                setMedicalStaff(staffResponse);
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

    const handleAddStaff = () => {
        navigate("/add-medical-staff");
    };

    const handleAddPatient = () => {
        navigate("/add-patient");
    };

    const handleDeleteStaff = async (id) => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
            try {
                await deleteMedicalStaff(id, token);
                setMedicalStaff((prev) => prev.filter((staff) => staff.staff_id !== id));
                alert("Staff deleted successfully!");
            } catch (error) {
                console.error("Error deleting staff:", error);
            }
        }
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
                        <UsersCard>
                            <h3>Users ({users?.length})</h3>
                            <Buttons>
                                <button onClick={handleAddStaff} className="add">
                                    Add Medical Staff
                                </button>
                                <button onClick={handleAddPatient} className="add">
                                    Add Patient
                                </button>
                            </Buttons>
                        </UsersCard>
                    </Card>

                    <Card>
                        <h3>Medical Staff ({medicalStaff?.length})</h3>
                        <ul>
                            {medicalStaff?.map((staff, index) => (
                                <ListItem key={staff.staff_id}>
                                    <div>
                                        {index + 1}. <span className="name">{staff.name}</span> - <span className="role">{staff.role}</span> - <span className={`status ${staff.employee_status}`}>{staff.employee_status}</span>
                                    </div>
                                    <Buttons>
                                        <button onClick={() => navigate(`/update-medical-staff/${staff.staff_id}`)} className="crud">Edit</button>
                                        <button onClick={() => handleDeleteStaff(staff.staff_id)} className="crud delete">Delete</button>
                                    </Buttons>
                                </ListItem>
                            ))}
                        </ul>
                    </Card>

                    <Card>
                        <h3>Patients ({patients?.length})</h3>
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

                    <Card>
                        <h3>Invoices ({invoices?.length} - £{invoices?.reduce((sum, invoice) => sum + invoice.total_amount, 0)})</h3>
                        <ul>
                            {invoices?.map((invoice) => (
                                <li key={invoice.id}>
                                    From: {invoice.patient.name} - £{invoice.total_amount} - {invoice.date_issued}
                                </li>
                            ))}
                        </ul>
                    </Card>
            </Dashboard>
        </Page>
    );
};

export default Admin;
