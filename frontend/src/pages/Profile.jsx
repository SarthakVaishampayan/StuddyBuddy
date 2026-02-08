import { User, Mail, Shield, Award, Calendar } from 'lucide-react';

const Profile = () => {
  return (
    <div className="p-4 bg-light min-vh-100">
      <div className="container-fluid">
        <h4 className="fw-bold mb-4">User Profile</h4>
        
        <div className="row g-4">
          {/* Left Column: Avatar & Basic Info */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center">
              <div className="bg-light rounded-circle mx-auto mb-3 p-4 border" style={{ width: '120px', height: '120px' }}>
                <User size={60} className="text-purple-main" style={{ color: '#8b5cf6' }} />
              </div>
              <h5 className="fw-bold mb-1">Aman Gupta</h5>
              <p className="text-muted small mb-3">Student | Developer</p>
              <div className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                Active Streak: 12 Days
              </div>
              <hr className="my-4" />
              <div className="text-start">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Mail size={16} className="text-muted" />
                  <span className="small">aman@example.com</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={16} className="text-muted" />
                  <span className="small">Joined Jan 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Info */}
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border mb-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Shield size={18} className="text-primary" /> Personal Information
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Full Name</label>
                  <input type="text" className="form-control form-control-sm rounded-3" defaultValue="Aman Gupta" />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Education</label>
                  <input type="text" className="form-control form-control-sm rounded-3" defaultValue="B.Tech Computer Science" />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Study Goal</label>
                  <textarea className="form-control form-control-sm rounded-3" rows="3" defaultValue="Become a Senior Full-Stack Engineer and master AI RAG systems." />
                </div>
              </div>
              <button className="btn btn-primary btn-sm mt-4 px-4 rounded-pill">Save Changes</button>
            </div>

            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Award size={18} className="text-warning" /> Achievement Stats
              </h6>
              <div className="row g-3 text-center">
                <div className="col-4">
                  <div className="p-3 bg-light rounded-3">
                    <h4 className="fw-bold mb-0">156</h4>
                    <small className="text-muted">Study Hours</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-light rounded-3">
                    <h4 className="fw-bold mb-0">42</h4>
                    <small className="text-muted">Tasks Done</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="p-3 bg-light rounded-3">
                    <h4 className="fw-bold mb-0">8</h4>
                    <small className="text-muted">Subjects</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
