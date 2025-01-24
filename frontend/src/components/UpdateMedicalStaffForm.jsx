import { useState, useEffect } from "react";
import { updateMedicalStaff, fetchMedicalStaffById } from "../api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
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

const UpdateMedicalStaffForm = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const [changes, setChanges] = useState({});

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                const data = await fetchMedicalStaffById(id, token);
                setFormData({
                    name: data.name,
                    role: data.role,
                    contact_info: data.contact_info,
                    employee_status: data.employee_status,
                    user: {
                        username: data.user.username,
                        email: data.user.email,
                    },
                });
            } catch (error) {
                console.error("Error fetching staff data:", error);
            }
        };
        fetchStaffData();
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
            await updateMedicalStaff(id, changes, token);
            navigate("/");
        } catch (error) {
            console.error("Error updating staff:", error.response?.data || error);
            alert("Failed to update medical staff.");
        }
    };

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <Page>
            <Form onSubmit={handleSubmit}>
                <h3>Update Medical Staff</h3>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Name"
                    required
                />
                <select
                    name="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                >
                    <option value="doctor">Doctor</option>
                    <option value="radiologist">Radiologist</option>
                </select>
                <textarea
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={(e) => handleInputChange("contact_info", e.target.value)}
                    placeholder="Contact Info"
                    required
                />
                <select
                    name="employee_status"
                    value={formData.employee_status}
                    onChange={(e) => handleInputChange("employee_status", e.target.value)}
                >
                    <option value="active">Active</option>
                    <option value="retired">Retired</option>
                </select>
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
                <button type="submit">Update Medical Staff</button>
            </Form>
        </Page>
    );
};

export default UpdateMedicalStaffForm;