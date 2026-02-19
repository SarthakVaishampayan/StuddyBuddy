import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Settings } from 'lucide-react';

const Navbar = ({ notifications = [] }) => {
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter for next 48h deadlines
  const imminent = notifications.filter(r => {
    const deadlineDate = new Date(r.deadline);
    const now = new Date();
    const diffDays = (new Date(deadlineDate.setHours(0,0,0,0)) - new Date(now.setHours(0,0,0,0))) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 1;
  });

  return (
    <nav className="bg-white border-bottom px-4 py-2 d-flex justify-content-between align-items-center sticky-top shadow-sm" style={{ zIndex: 100 }}>
      <h5 className="mb-0 fw-bold text-dark">Dashboard</h5>
      
      <div className="d-flex align-items-center gap-4">
        <div className="position-relative d-none d-md-block">
          <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={18} />
          <input className="form-control bg-light border-0 ps-5 rounded-pill" style={{ width: '300px' }} placeholder="Search..." />
        </div>

        {/* Notifications */}
        <div className="position-relative" ref={notifRef}>
          <button 
            className={`btn rounded-circle shadow-sm position-relative transition-all ${showNotif ? 'btn-primary text-white' : 'btn-light text-dark'}`} 
            onClick={() => setShowNotif(!showNotif)}
          >
            <Bell size={20} />
            {imminent.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: '10px' }}>{imminent.length}</span>}
          </button>
          
          {showNotif && (
            <div className="position-absolute end-0 mt-3 bg-white shadow-lg border rounded-4 p-3 animate-fade-in" style={{ width: '320px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <h6 className="fw-bold mb-0">Notifications</h6>
                <span className="badge bg-light text-dark border">{imminent.length} New</span>
              </div>
              
              {imminent.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  <Bell size={32} className="mb-2 opacity-50"/>
                  <p className="mb-0">You're all caught up!</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2 max-h-300 overflow-auto">
                  {imminent.map(r => (
                    <div key={r._id} className="p-2 px-3 bg-light rounded-3 border-start border-danger border-4 hover-bg-gray transition-all">
                      <div className="fw-bold small text-dark mb-1">{r.text}</div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-danger x-small fw-bold text-uppercase">Deadline Warning</span>
                        <span className="text-muted x-small">{new Date(r.deadline).toDateString() === new Date().toDateString() ? 'Today' : 'Tomorrow'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <button className="btn btn-light rounded-circle shadow-sm hover-bg-gray"><Settings size={20} /></button>
      </div>
    </nav>
  );
};

export default Navbar;
