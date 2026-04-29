import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Dashboard() {
    const [profiles, setProfiles] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(storedUser));
        fetchProfiles();
    }, [navigate]);

    const fetchProfiles = async () => {
        try {
            const response = await api.get('/api/profiles');
            setProfiles(response.data.data);
        } catch (error) {
            console.error("Failed to fetch profiles", error);
            if (error.response?.status === 401) {
                handleLogout(); // Force logout if cookies expired
            }
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error(err);
        }
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Welcome, @{user.username} ({user.role})</h2>
                <button onClick={handleLogout}>Logout</button>
            </header>
            
            <hr />

            <h3>Intelligence Profiles</h3>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ccc' }}>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Country</th>
                    </tr>
                </thead>
                <tbody>
                    {profiles.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px 0' }}>{p.name}</td>
                            <td>{p.gender}</td>
                            <td>{p.age}</td>
                            <td>{p.country_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}