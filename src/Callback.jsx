import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './api';

export default function Callback() {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
            // set HTTP-only cookies on this response.
            api.get(`/auth/github/callback?code=${code}`)
                .then((response) => {
                    // Cookies securely stored in the browser!
                    localStorage.setItem('user', JSON.stringify({
                        username: response.data.username,
                        role: response.data.role
                    }));
                    navigate('/dashboard');
                })
                .catch((err) => {
                    setError("Authentication failed. Please try again.");
                    console.error(err);
                });
        }
    }, [location, navigate]);

    if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</div>;
    
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Authenticating... please wait.</div>;
}