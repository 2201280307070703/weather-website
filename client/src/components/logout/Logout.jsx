import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../contexts/authenticationContext';
import InfoPopup from '../infoPopup/InfoPopup';

export default function Logout() {
    const { logoutHandler } = useContext(AuthenticationContext);
    const [error, setError] = useState(null);
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutHandler();
            }
            catch (error) {
                setError(error.message);
                setInfoPopupVisibility(true);
            }
        };
        handleLogout();
    }, [logoutHandler]);

    const handeOnClose = () => {
        setError(null);
        setInfoPopupVisibility(false);
    };

    if (infoPopupVisibility) {
        return <InfoPopup message={error} onClose={handeOnClose} />
    }

    return null;
};