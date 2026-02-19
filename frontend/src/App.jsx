import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Todo from './pages/Todo';

import Login from './pages/Login';
import Register from './pages/Register';

import { AuthProvider, useAuth } from './context/AuthContext';
import { TimerProvider, useTimer } from './context/TimerContext';

import { Save, RotateCcw, Trash2, AlertCircle } from 'lucide-react';

const Placeholder = ({ title }) => (
  <div className="p-5 text-center">
    <h1 className="fw-bold text-dark mb-3">{title}</h1>
    <p className="text-muted lead">This feature is currently under development.</p>
    <div className="bg-white p-5 rounded-4 shadow-sm border mt-4 d-inline-block">
      <p className="mb-0 text-primary fw-bold">Coming Soon!</p>
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
  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

// GLOBAL TIMER FINISH MODAL (shows on any page)
const GlobalTimerFinishModal = () => {
  const { token } = useAuth();
  const {
    sessionEnded,
    setSessionEnded,
    getTimeStudied,
    restartSession,
    discardSession,
    mode,
    initialTime,
    elapsedTime,
  } = useTimer();

  const formatHms = (sec) => {
    const s = Math.max(0, Number(sec) || 0);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return h > 0 ? `${h}h ${m}m ${r}s` : `${m}m ${r}s`;
  };

  const handleLog = async () => {
    const studied = getTimeStudied();
    if (!studied || studied <= 0) {
      setSessionEnded(false);
      return;
    }

    try {
      await fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ durationInSeconds: studied }),
      });

      // After logging: close popup and reset the timer state
      setSessionEnded(false);

      // reset based on mode
      // stopwatch -> 0, timer -> full duration
      if (mode === 'timer') {
        // keep ready for next run
        // (we don't have direct setters here; your Dashboard can set it again)
      }
    } catch (e) {
      console.error('Failed to log session:', e);
      // Keep modal open so user can retry or discard
    }
  };

  if (!sessionEnded) return null;

  // For countdown: show remaining too (useful info)
  const studiedSec = getTimeStudied();
  const remainingSec = mode === 'timer' ? elapsedTime : null;
  const goalSec = mode === 'timer' ? initialTime : null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center"
      style={{ zIndex: 9999, backdropFilter: 'blur(6px)' }}
      onClick={() => setSessionEnded(false)}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg"
        style={{ width: 420, maxWidth: '92vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <AlertCircle size={44} className="text-primary mb-2" />
          <h5 className="fw-bold mb-2">Session finished</h5>
          <p className="text-muted small mb-3">
            Time studied: <span className="fw-bold text-dark">{formatHms(studiedSec)}</span>
            {mode === 'timer' && (
              <>
                <br />
                Goal: <span className="fw-bold text-dark">{formatHms(goalSec)}</span>, Remaining:{' '}
                <span className="fw-bold text-dark">{formatHms(remainingSec)}</span>
              </>
            )}
          </p>
        </div>

        <div className="d-grid gap-2">
          <button className="btn btn-primary py-2 fw-bold rounded-3" onClick={handleLog} type="button">
            <Save className="me-2" size={18} /> Log time
          </button>

          <button className="btn btn-outline-secondary py-2 fw-bold rounded-3" onClick={restartSession} type="button">
            <RotateCcw className="me-2" size={18} /> Restart
          </button>

          <button className="btn btn-light py-2 fw-bold rounded-3 text-danger" onClick={discardSession} type="button">
            <Trash2 className="me-2" size={18} /> Discard
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <TimerProvider>
          <MainLayout>
            <GlobalTimerFinishModal />

            <Routes>
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Main */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/todo" element={<ProtectedRoute><Todo /></ProtectedRoute>} />

              {/* Placeholders */}
              <Route path="/assignments" element={<ProtectedRoute><Placeholder title="Assignments" /></ProtectedRoute>} />
              <Route path="/subjects" element={<ProtectedRoute><Placeholder title="Subjects" /></ProtectedRoute>} />
              <Route path="/chats" element={<ProtectedRoute><Placeholder title="Study Chat" /></ProtectedRoute>} />
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
