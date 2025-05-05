import { useContext, useEffect } from "react";
import AuthenticationContext from "../../contexts/authenticationContext";

export default function Logout() {
    const { logoutHandler } = useContext(AuthenticationContext);

    useEffect(() => {
        const handleLogout = async () => {
            await logoutHandler();
        };

        handleLogout();
    }, [logoutHandler]);

    return null;
}