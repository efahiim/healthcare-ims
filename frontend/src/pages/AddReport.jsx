import { useState, useEffect } from "react";
import { createImage, createReport, fetchPatientById } from "../api";
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

const AddReport = () => {
    const { patientId } = useParams();
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [diagnosis, setDiagnosis] = useState("");
    const [images, setImages] = useState([]);
    const [patient, setPatient] = useState(null);
    const [imageType, setImageType] = useState(""); // For the type input
    const [imageClassification, setImageClassification] = useState(""); // For the classification input

    // Fetch the patient details using patientId from params
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

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            // Upload images with type and classification
            const uploadedImages = await Promise.all(
                images.map(async (image) => {
                    const formData = new FormData();
                    formData.append("file", image);
                    formData.append("type", imageType);
                    formData.append("classification", imageClassification);
                    formData.append("patient", patientId);
                    return await createImage(formData, token);
                })
            );

            // Prepare report data
            const reportData = {
                diagnosis,
                medical_staff: user.role === 'administrator' ? user.id : user.id - 1, // -1 to temporarily fix issue with wrong user
                patient: patientId,
                images: uploadedImages.map((img) => img.image_id),
            };

            // Create the report
            await createReport(reportData, token);
            navigate(`/patients/${patientId}/reports`);
        } catch (error) {
            console.error("Error creating report:", error);
        }
    };

    return (
        <Page>
            <Form onSubmit={handleSubmit}>
                <h3>Add Diagnostic Report for {patient?.name}</h3>
                <textarea
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Enter diagnosis"
                />
                <label htmlFor="images">Images</label>
                <input
                    name="images"
                    type="file"
                    multiple
                    onChange={(e) => setImages([...e.target.files])}
                />
                <input
                    type="text"
                    value={imageType}
                    onChange={(e) => setImageType(e.target.value)}
                    placeholder="Enter images type (e.g., X-Ray)"
                />
                <input
                    type="text"
                    value={imageClassification}
                    onChange={(e) => setImageClassification(e.target.value)}
                    placeholder="Enter images classification (e.g., Abnormal)"
                />
                <button type="submit">Add Report</button>
            </Form>
        </Page>
    );
};

export default AddReport;