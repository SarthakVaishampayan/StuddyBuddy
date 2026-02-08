import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" 
         style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="card shadow-lg p-5" style={{maxWidth: '450px', width: '100%', borderRadius: '15px'}}>
        <div className="text-center mb-4">
          <h2 className="text-primary fw-bold">Welcome Back</h2>
          <p className="text-muted">Login to your account</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" className="form-control" required autoComplete="email"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" className="form-control" required autoComplete="current-password"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small">Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
