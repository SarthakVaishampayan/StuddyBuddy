import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Chats from './pages/Chats';
import Assignments from './pages/Assignments';
import Subjects from './pages/Subjects';
import Analytics from './pages/Analytics';
import Todo from './pages/Todo';
import { useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  const { token } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="d-flex min-vh-100 bg-light">
      {token && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
      <div className="flex-grow-1 d-flex flex-column">
        {token && <Navbar toggleSidebar={() => setIsCollapsed(!isCollapsed)} />}
        <main className="flex-grow-1 overflow-auto">
          <Routes>
            <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
            <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
            
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/chats" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
            <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
