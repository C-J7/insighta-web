import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Callback from './Callback';
import Dashboard from './Dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/callback" element={<Callback />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default App;