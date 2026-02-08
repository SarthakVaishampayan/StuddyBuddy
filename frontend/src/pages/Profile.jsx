import { useAuth } from '../context/AuthContext';
import { User, Mail, Award } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4">My Profile</h3>
      <div className="bg-white p-5 rounded-4 shadow-sm border text-center">
        <div className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{width: '100px', height: '100px'}}>
          <User size={50} />
        </div>
        <h4 className="fw-bold mb-1">{user?.name || 'Study Buddy'}</h4>
        <p className="text-muted mb-4">{user?.email}</p>
        <div className="d-flex justify-content-center gap-5 border-top pt-4">
          <div><h5 className="fw-bold mb-0">12</h5><small className="text-muted">Courses</small></div>
          <div><h5 className="fw-bold mb-0">85%</h5><small className="text-muted">Avg Grade</small></div>
          <div><h5 className="fw-bold mb-0">45d</h5><small className="text-muted">Streak</small></div>
        </div>
      </div>
    </div>
  );
}
