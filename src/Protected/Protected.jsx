import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const Protected = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                await axios.get("http://localhost:5600/protected/me",
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