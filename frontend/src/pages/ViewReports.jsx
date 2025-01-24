import { useEffect, useState } from "react";
import { fetchReportsByPatient, fetchMedicalStaffById, fetchPatientById } from "../api";
import styled from "styled-components";
import Page from "../components/Page";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Wrapper = styled.div`
    margin: 2rem;

    h3 {
        margin-bottom: 2rem;
    }
`;

const Card = styled.div`
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    width: 100%;
    margin-bottom: 1rem;
`;

const ViewReports = () => {
    const { patientId } = useParams();
    const { token } = useAuth();
    const [reports, setReports] = useState([]);
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

    // Fetch the reports related to the patient
    useEffect(() => {
        const loadReports = async () => {
            try {
                const data = await fetchReportsByPatient(patientId, token);
                const enrichedReports = await Promise.all(data.map(async (report) => {
                    const medicalStaffData = await fetchMedicalStaffById(report.medical_staff, token);
                    
                    // Add medical staff data to the report
                    return {
                        ...report,
                        medical_staff: medicalStaffData,
                    };
                }));
                setReports(enrichedReports);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        loadReports();
    }, [patientId, token]);

    return (
        <Page>
            <Wrapper>
                <h3>Diagnostic Reports for {patient?.name}</h3>
                <ul>
                    {reports.map((report) => (
                        <Card key={report.report_id}>
                            <p>Diagnosis: {report.diagnosis}</p>
                            <p>Report Date: {report.report_date}</p>
                            <p>Medical Staff: {report.medical_staff?.name}</p>
                            <p>Images: {report.images.length}</p>
                        </Card>
                    ))}
                </ul>
            </Wrapper>
        </Page>
    );
};

export default ViewReports;
