import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import Login from './pages/Login';
import Register from './pages/Register';

// Standard Placeholder for WIP pages
const Placeholder = ({ title }) => (
  <div className="p-5 text-center">
    <h1 className="fw-bold text-dark mb-3">{title}</h1>
    <p className="text-muted lead">This feature is currently under development in Phase 7-10.</p>
    <div className="bg-white p-5 rounded-4 shadow-sm border mt-4 d-inline-block">
      <p className="mb-0">Coming Soon!</p>
    </div>
  </div>
);

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
  if (loading) return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TimerProvider>
          <MainLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Placeholder title="Analytics" /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><Placeholder title="Assignments" /></ProtectedRoute>} />
              <Route path="/subjects" element={<ProtectedRoute><Placeholder title="Subjects" /></ProtectedRoute>} />
              <Route path="/chats" element={<ProtectedRoute><Placeholder title="Study Chat" /></ProtectedRoute>} />
              <Route path="/todo" element={<ProtectedRoute><Placeholder title="To-Do List" /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Placeholder title="Settings" /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Placeholder title="Profile" /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </TimerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
