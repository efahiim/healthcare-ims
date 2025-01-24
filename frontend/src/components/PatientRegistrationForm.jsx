import { useState } from "react";
import { createPatient } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Page from "./Page";
import styled from 'styled-components';

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

const PatientRegistrationForm = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        date_of_birth: null,
        diagnosis: "",
        diagnosis_date: null,
        conditions: "",
        cost: 0.00,
        user: {
            username: "",
            password: "",
            email: "",
            role: "patient",
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createPatient(formData, token);
            navigate("/");
        } catch (error) {
            console.error("Error during registration:", error.response.data);
            alert("Failed to register patient.");
        }
    };

    return (
        <Page>
            <Form onSubmit={handleSubmit}>
                <h3>Patient Registration</h3>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Name"
                    required
                />
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="Address"
                    required
                />
                <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            date_of_birth: e.target.value,
                        }))
                    }
                    required
                />
                <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            diagnosis: e.target.value,
                        }))
                    }
                    placeholder="Diagnosis"
                />
                <input
                    type="date"
                    name="diagnosis_date"
                    value={formData.diagnosis_date}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            diagnosis_date: e.target.value,
                        }))
                    }
                />
                <textarea
                    name="conditions"
                    value={formData.conditions}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            conditions: e.target.value,
                        }))
                    }
                    placeholder="Conditions"
                />
                <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            cost: parseFloat(e.target.value) || 0.00,
                        }))
                    }
                    placeholder="Cost"
                    step="0.01"
                />
                <input
                    type="text"
                    name="username"
                    value={formData.user.username}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            user: { ...prev.user, username: e.target.value },
                        }))
                    }
                    placeholder="Username"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.user.password}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            user: { ...prev.user, password: e.target.value },
                        }))
                    }
                    placeholder="Password"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.user.email}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            user: { ...prev.user, email: e.target.value },
                        }))
                    }
                    placeholder="Email"
                    required
                />
                <button type="submit">Register Patient</button>
            </Form>
        </Page>
    );
};

export default PatientRegistrationForm;