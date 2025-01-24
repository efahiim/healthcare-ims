import styled from 'styled-components';
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const HeaderWrapper = styled.header`
    padding: 1rem 2rem;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled.div`
    font-weight: bold;
    font-size: 1.1rem;
`;

const User = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    p {
        margin-right: 1rem;
        span {
            color: blue;
        }
    }

    button {
        border: 0;
        border-radius: 8px;
        cursor: pointer;
        padding: 10px 15px;

        &.homepage {
            background-color: yellow;
            color: black;
        }

        &.logout {
            background-color: red;
            color: white;
        }
    }
`;

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const goBack = () => navigate(-1);

    return (
        <HeaderWrapper>
            <Logo>Healthcare IMS</Logo>
            {user && (
                <User>
                    <p>Hello there, <span>{ user.username }</span></p>
                    {location.pathname !== '/' && (
                        <button onClick={goBack} className='homepage'>
                            Go back
                        </button>
                    )}
                    <button onClick={handleLogout} className='logout'>
                        Logout
                    </button>
                </User>
            )}
        </HeaderWrapper>
    )
};

export default Header;