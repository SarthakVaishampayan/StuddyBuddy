import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';

// Inline Placeholders (no separate files needed)
const Subjects = () => (
  <div className="p-4">
    <h4 className="fw-bold">My Subjects</h4>
    <p className="text-muted">Subject statistics and materials will appear here (Phase 8).</p>
  </div>
);

const Analytics = () => (
  <div className="p-4">
    <h4 className="fw-bold">Analytics</h4>
    <p className="text-muted">Study progress charts and insights (Phase 3).</p>
  </div>
);

const Assignments = () => (
  <div className="p-4">
    <h4 className="fw-bold">Assignments</h4>
    <p className="text-muted">Manage deadlines and submissions (Phase 6).</p>
  </div>
);

const Chats = () => (
  <div className="p-4">
    <h4 className="fw-bold">Chats</h4>
    <p className="text-muted">Real-time study groups (Phase 10).</p>
  </div>
);

const ToDoPage = () => (
  <div className="p-4">
    <h4 className="fw-bold">Full ToDo List</h4>
    <p className="text-muted">Complete task management system (Phase 5).</p>
  </div>
);

const Settings = () => (
  <div className="p-4">
    <h4 className="fw-bold">Settings</h4>
    <p className="text-muted">App preferences and account management (Phase 4).</p>
  </div>
);

const Profile = () => (
  <div className="p-4">
    <h4 className="fw-bold">Profile</h4>
    <p className="text-muted">User information and preferences (Phase 4).</p>
  </div>
);

function App() {
  return (
    <Router>
      <div className="d-flex min-vh-100 bg-light">
        <Sidebar />
        <main className="flex-grow-1 overflow-auto" style={{ height: '100vh' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/todo" element={<ToDoPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
