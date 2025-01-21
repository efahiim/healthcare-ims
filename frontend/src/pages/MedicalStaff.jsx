import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"
import { useEffect } from "react";

const MedicalStaff = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(user)
    }, [])

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    if (!user) return <p>Unauthorized! Please login first.</p>;

    return (
        <div>
            <h1>Welcome Medical Staff, {user.username}</h1>
            <p>Role: {user.role}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default MedicalStaff;