import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('profiles');
    const [profiles, setProfiles] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Pagination & Metrics State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // Detail View State
    const [selectedProfile, setSelectedProfile] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/');
            return;
        }
        setUser(JSON.parse(storedUser));
        fetchProfiles(1);
    }, [navigate]);

    const fetchProfiles = async (pageNumber) => {
        try {
            const response = await api.get(`/api/profiles?page=${pageNumber}&limit=10`);
            setProfiles(response.data.data);
            setPage(response.data.page);
            setTotalPages(response.data.total_pages);
            setTotalRecords(response.data.total);
        } catch (error) {
            if (error.response?.status === 401) handleLogout();
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await api.get(`/api/profiles/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchResults(response.data.data);
        } catch (error) {
            alert("Unable to interpret search query.");
        }
    };

    const handleLogout = async () => {
        try { await api.post('/auth/logout'); } catch (err) {}
        localStorage.removeItem('user');
        navigate('/');
    };

    if (!user) return null;

    // --- SUB-COMPONENTS ---

    const ProfileTable = ({ data }) => (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Country</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map(p => (
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        <td>{p.age} ({p.age_group})</td>
                        <td>{p.country_id}</td>
                        <td>
                            <button onClick={() => setSelectedProfile(p)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>View</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="dashboard-container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Insighta Labs+</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => {setActiveTab('profiles'); setSelectedProfile(null);}}>Dashboard</button>
                    <button onClick={() => {setActiveTab('search'); setSelectedProfile(null);}}>Search</button>
                    <button onClick={() => {setActiveTab('account'); setSelectedProfile(null);}}>Account</button>
                </div>
            </header>
            <hr />

            {/* DETAIL MODAL VIEW */}
            {selectedProfile ? (
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                    <h3>Profile Details: {selectedProfile.name}</h3>
                    <p><strong>ID:</strong> {selectedProfile.id}</p>
                    <p><strong>Gender:</strong> {selectedProfile.gender} ({(selectedProfile.gender_probability * 100).toFixed(1)}%)</p>
                    <p><strong>Age:</strong> {selectedProfile.age} ({selectedProfile.age_group})</p>
                    <p><strong>Nationality:</strong> {selectedProfile.country_name} ({selectedProfile.country_id})</p>
                    <p><strong>Created:</strong> {new Date(selectedProfile.created_at).toLocaleString()}</p>
                    <button onClick={() => setSelectedProfile(null)} style={{ marginTop: '15px' }}>Back</button>
                </div>
            ) : (
                <>
                    {/* PROFILES DASHBOARD TAB */}
                    {activeTab === 'profiles' && (
                        <div>
                            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div style={{ background: '#e2e8f0', padding: '15px', borderRadius: '8px', flex: 1 }}>
                                    <h3>Total Profiles</h3>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{totalRecords}</p>
                                </div>
                                <div style={{ background: '#e2e8f0', padding: '15px', borderRadius: '8px', flex: 1 }}>
                                    <h3>Current Page</h3>
                                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{page} / {totalPages}</p>
                                </div>
                            </div>
                            
                            <ProfileTable data={profiles} />

                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                <button disabled={page <= 1} onClick={() => fetchProfiles(page - 1)}>Previous Page</button>
                                <button disabled={page >= totalPages} onClick={() => fetchProfiles(page + 1)}>Next Page</button>
                            </div>
                        </div>
                    )}

                    {/* SEARCH TAB */}
                    {activeTab === 'search' && (
                        <div>
                            <h3>Natural Language Search</h3>
                            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
                                <input 
                                    type="text" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    placeholder="e.g. young females from nigeria" 
                                    style={{ flex: 1, padding: '10px' }}
                                />
                                <button type="submit">Search</button>
                            </form>
                            {searchResults.length > 0 && <ProfileTable data={searchResults} />}
                        </div>
                    )}

                    {/* ACCOUNT TAB */}
                    {activeTab === 'account' && (
                        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                            <h3>My Account</h3>
                            <p style={{ fontSize: '18px', marginTop: '10px' }}><strong>Username:</strong> @{user.username}</p>
                            <p style={{ fontSize: '18px' }}><strong>System Role:</strong> {user.role.toUpperCase()}</p>
                            <p style={{ marginTop: '20px', color: '#64748b' }}>As an {user.role}, your permissions are strictly enforced by the backend RBAC system.</p>
                            <button onClick={handleLogout} style={{ marginTop: '20px', backgroundColor: '#ef4444' }}>Log Out</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}