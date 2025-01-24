import { useState, useEffect } from "react";
import { updatePatient, fetchPatientById } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import Page from "./Page";
import styled from "styled-components";

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

const UpdatePatientForm = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [changes, setChanges] = useState({});

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const data = await fetchPatientById(id, token);
                setFormData({
                    name: data.name,
                    address: data.address,
                    date_of_birth: data.date_of_birth,
                    diagnosis: data.diagnosis,
                    diagnosis_date: data.diagnosis_date,
                    conditions: data.conditions,
                    cost: data.cost,
                    user: {
                        username: data.user.username,
                        email: data.user.email,
                    },
                });
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };
        fetchPatientData();
    }, [id, token]);

    const handleInputChange = (field, value, nested = false) => {
        setFormData((prev) => {
            const updatedData = nested
                ? { ...prev, user: { ...prev.user, [field]: value } }
                : { ...prev, [field]: value };
            return updatedData;
        });
        setChanges((prev) => {
            const updatedChanges = nested
                ? { ...prev, user: { ...(prev.user || {}), [field]: value } }
                : { ...prev, [field]: value };
            return updatedChanges;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePatient(id, changes, token);
            navigate("/");
        } catch (error) {
            console.error("Error updating patient:", error.response?.data || error);
            alert("Failed to update patient.");
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Page>
            <Form onSubmit={handleSubmit}>
                <h3>Update Patient</h3>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Name"
                    required
                />
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Address"
                    required
                />
                <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                    placeholder="Date of Birth"
                    required
                />
                <textarea
                    name="diagnosis"
                    value={formData.diagnosis || ""}
                    onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                    placeholder="Diagnosis"
                />
                <input
                    type="date"
                    name="diagnosis_date"
                    value={formData.diagnosis_date || ""}
                    onChange={(e) => handleInputChange("diagnosis_date", e.target.value)}
                    placeholder="Diagnosis Date"
                />
                <textarea
                    name="conditions"
                    value={formData.conditions || ""}
                    onChange={(e) => handleInputChange("conditions", e.target.value)}
                    placeholder="Conditions"
                />
                <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={(e) => handleInputChange("cost", e.target.value)}
                    placeholder="Cost"
                    step="0.01"
                    required
                />
                <input
                    type="text"
                    name="username"
                    value={formData.user.username}
                    onChange={(e) => handleInputChange("username", e.target.value, true)}
                    placeholder="Username"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.user.email}
                    onChange={(e) => handleInputChange("email", e.target.value, true)}
                    placeholder="Email"
                    required
                />
                <button type="submit">Update Patient</button>
            </Form>
        </Page>
    );
};

export default UpdatePatientForm;