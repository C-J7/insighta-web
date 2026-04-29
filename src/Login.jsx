import { useState } from 'react';
import api from './api';

export default function Login() {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // redirect back to callback route
            const redirectUri = "http://localhost:5173/callback";
            const response = await api.get(`/auth/github?redirect_uri=${encodeURIComponent(redirectUri)}`);
            // Send user to GitHub
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Failed to fetch GitHub URL", error);
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h1>Insighta Labs+</h1>
            <p>Secure Profile Intelligence Platform</p>
            <button 
                onClick={handleLogin} 
                disabled={loading}
                style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
            >
                {loading ? "Redirecting..." : "Continue with GitHub"}
            </button>
        </div>
    );
}