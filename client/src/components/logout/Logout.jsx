import { useContext, useEffect, useState } from 'react';
import AuthenticationContext from '../../contexts/authenticationContext';
import InfoPopup from '../infoPopup/InfoPopup';

export default function Logout() {
    const { logoutHandler } = useContext(AuthenticationContext);
    const [error, setError] = useState('');
    const [infoPopupVisibility, setInfoPopupVisibility] = useState(false);

    useEffect(() => {
        const handleLogout = async () => {
            try{
                await logoutHandler();
            }
            catch(error){
                setError(error);
                setInfoPopupVisibility(true);
            }
        };

        handleLogout();
    }, [logoutHandler]);

    const handeOnClose = () => {
        setError('');
        setInfoPopupVisibility(false);
    };

    if (infoPopupVisibility) {
        console.log(error);

        return <InfoPopup message={error} onClose={handeOnClose} />
    }

    return null;
}