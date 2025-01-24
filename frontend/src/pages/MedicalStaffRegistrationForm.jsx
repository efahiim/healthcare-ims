import { useState } from "react";
import { createMedicalStaff } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";
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

const MedicalStaffRegistrationForm = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        role: "doctor",
        contact_info: "",
        employee_status: "active",
        user: {
            username: "",
            password: "",
            email: "",
            role: "medicalStaff",
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createMedicalStaff(formData, token);
            navigate("/");
        } catch (error) {
            console.error("Error during registration:", error.response.data);
            alert("Failed to register medical staff.");
        }
    };

    return (
        <Page>
            <Form onSubmit={handleSubmit}>
                <h3>Medical Staff Registration</h3>
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
                <select
                    name="role"
                    value={formData.role}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
                >
                    <option value="doctor">Doctor</option>
                    <option value="radiologist">Radiologist</option>
                </select>
                <textarea
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            contact_info: e.target.value,
                        }))
                    }
                    placeholder="Contact Info"
                    required
                />
                <select
                    name="employee_status"
                    value={formData.employee_status}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            employee_status: e.target.value,
                        }))
                    }
                >
                    <option value="active">Active</option>
                    <option value="retired">Retired</option>
                </select>
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
                <button type="submit">Register Medical Staff</button>
            </Form>
        </Page>
    );
};

export default MedicalStaffRegistrationForm;