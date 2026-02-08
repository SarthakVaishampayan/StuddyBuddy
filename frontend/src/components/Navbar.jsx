import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 sticky-top shadow-sm z-index-10">
      <div className="container-fluid p-0">
        <div className="d-flex align-items-center">
          <button className="btn btn-light d-md-none me-2" onClick={toggleSidebar}>
            <Menu size={20} />
          </button>
          <h5 className="mb-0 fw-bold text-dark">Workspace</h5>
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="bg-light border rounded-pill px-3 py-1 d-flex align-items-center d-none d-md-flex" style={{ width: '300px' }}>
            <Search size={16} className="text-muted me-2" />
            <input type="text" className="border-0 bg-transparent small w-100" placeholder="Search for anything..." style={{ outline: 'none' }} />
          </div>

          <div className="position-relative" ref={notifRef}>
            <div className="cursor-pointer p-2 rounded-circle hover-bg-light" onClick={() => setShowNotifs(!showNotifs)}>
              <Bell size={20} className="text-muted" />
              <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '0.6rem' }}>3</span>
            </div>

            {showNotifs && (
              <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-0" style={{ width: '320px', zIndex: 1050 }}>
                <div className="p-3 border-bottom bg-light fw-bold small text-dark">Notifications</div>
                <div className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  <div className="list-group-item border-0 p-3 small">
                    <span className="fw-bold text-primary">Assignment Reminder:</span> Physics lab report due at midnight.
                  </div>
                  <div className="list-group-item border-0 p-3 small border-top">
                     <span className="fw-bold text-success">Study Session:</span> Group meeting starts in 15 mins.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="cursor-pointer p-2 rounded-circle hover-bg-light" onClick={() => navigate('/settings')}>
            <Settings size={20} className="text-muted" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
