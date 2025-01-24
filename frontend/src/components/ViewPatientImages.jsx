import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchImagesByPatient } from "../api"; // Assume this fetches images for a patient
import styled from "styled-components";
import Page from "./Page";

const Wrapper = styled.div`
    margin: 2rem;
`;

const ImageGallery = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
`;

const ImageCard = styled.div`
    background: white;
    padding: 1rem;
    border-radius: 8px;
    width: 200px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    text-align: center;

    img {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
    }
`;

const ViewPatientImages = () => {
    const { patientId } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <Page>
            <Wrapper>
                <h3>Images for Patient #{patientId}</h3>
                <ImageGallery>
                    {images.map((image) => (
                        <ImageCard key={image.id}>
                            <img src={image.url} alt={image.description || "Patient Image"} />
                            <p>{image.description}</p>
                        </ImageCard>
                    ))}
                </ImageGallery>
            </Wrapper>
        </Page>
    );
};

export default ViewPatientImages;