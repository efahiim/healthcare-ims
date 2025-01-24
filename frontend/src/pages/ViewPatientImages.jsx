import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchImagesByPatient, fetchPatientById } from "../api"; // Assume this fetches images for a patient
import styled from "styled-components";
import Page from "../components/Page";

const Wrapper = styled.div`
    margin: 2rem;

    h3 {
        margin-bottom: 2rem;
    }
`;

const Gallery = styled.div`
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
`;

const Card = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    width: 300px;

    img {
        height: 200px;
        width: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 4px;
    }

    p {
        margin-top: 1rem;
        text-align: center;
    }
`;

const ViewPatientImages = () => {
    const { patientId } = useParams();
    const { token } = useAuth();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);

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

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imagesData = await fetchImagesByPatient(patientId, token);
                setImages(imagesData);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [patientId, token]);

    if (loading) {
        return <div>Loading images...</div>;
    }

    if (!images.length) {
        return (
            <div>
                <p>No images found for this patient.</p>
            </div>
        );
    }

    return (
        <Page>
            <Wrapper>
                <h3>Images for {patient?.name}</h3>
                <Gallery>
                    {images.map((image) => (
                        <Card key={image.image_id}>
                            <img src={`${import.meta.env.VITE_API_URL}${image.file}`} alt={`${image.type} image`} />
                            <p>{image.type} - {image.classification} - {image.timestamp}</p>
                        </Card>
                    ))}
                </Gallery>
            </Wrapper>
        </Page>
    );
};

export default ViewPatientImages;