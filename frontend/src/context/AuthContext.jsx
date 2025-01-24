import { createContext, useState, useContext } from "react";
import { login as loginService, logout as logoutService } from "../api";

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = async (username, password) => {
        const data = await loginService(username, password);
        setUser(data);
        setToken(data.token);
        localStorage.setItem("authToken", data.token);
    };

    const logout = async () => {
        if (token) {
            await logoutService(token);
            setUser(null);
            setToken(null);
            localStorage.removeItem("authToken");
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
