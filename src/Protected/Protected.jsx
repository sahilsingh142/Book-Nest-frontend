import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Protected = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const verifyUser = async () => {
            try {
                await axios.get(`${API_URL}/protected/me`,
                    {
                        withCredentials: true,
                    });

                setIsAuth(true);
            } catch (err) {
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return isAuth ? children : <Navigate to="/auth" replace />;
};

export default Protected;