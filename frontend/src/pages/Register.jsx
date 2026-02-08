import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords don't match");
    
    setLoading(true);
    try {
      await register({ name: formData.name, email: formData.email, password: formData.password });
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
          <h2 className="text-primary fw-bold">Create Account</h2>
          <p className="text-muted">Start your journey with StudyBuddy</p>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Full Name</label>
            <input type="text" className="form-control" placeholder="John Doe" required autoComplete="name"
              onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Email Address</label>
            <input type="email" className="form-control" placeholder="name@example.com" required autoComplete="email"
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" className="form-control" required autoComplete="new-password"
              onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Confirm Password</label>
            <input type="password" className="form-control" required autoComplete="new-password"
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" disabled={loading}>
            {loading ? 'Processing...' : 'Register Now'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small">Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
