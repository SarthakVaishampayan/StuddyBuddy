import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Layout wrapper to show/hide sidebar
const MainLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="d-flex min-vh-100 bg-light">
      {user && <Sidebar />}
      <main className="flex-grow-1 overflow-auto" style={{ height: '100vh' }}>
        {children}
      </main>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Inline placeholders
const Placeholder = ({ name }) => (
  <div className="p-4">
    <h4 className="fw-bold">{name}</h4>
    <p className="text-muted">Feature coming soon.</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            {/* Auth Routes (No Sidebar) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes (With Sidebar) */}
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Placeholder name="Analytics" /></ProtectedRoute>} />
            <Route path="/assignments" element={<ProtectedRoute><Placeholder name="Assignments" /></ProtectedRoute>} />
            <Route path="/subjects" element={<ProtectedRoute><Placeholder name="Subjects" /></ProtectedRoute>} />
            <Route path="/chats" element={<ProtectedRoute><Placeholder name="Chats" /></ProtectedRoute>} />
            <Route path="/todo" element={<ProtectedRoute><Placeholder name="Todo" /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Placeholder name="Settings" /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Placeholder name="Profile" /></ProtectedRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
