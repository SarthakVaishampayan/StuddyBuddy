import { useState, useEffect, useRef } from 'react';
import { Bell, Search, Settings, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="d-flex justify-content-between align-items-center bg-white border-bottom px-4 py-3 sticky-top shadow-sm">
      <div className="d-flex align-items-center">
        <button className="btn btn-light d-md-none me-2" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <h5 className="mb-0 fw-bold text-dark">Dashboard</h5>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="bg-light border rounded-pill px-3 py-1 d-flex align-items-center d-none d-md-flex" style={{ width: '250px' }}>
          <Search size={16} className="text-muted me-2" />
          <input type="text" className="border-0 bg-transparent small w-100" placeholder="Search tasks..." style={{ outline: 'none' }} />
        </div>

        <div className="position-relative" ref={notifRef}>
          <div className="cursor-pointer p-2 rounded-circle hover-bg-light" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell size={20} className="text-muted" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '0.6rem' }}>3</span>
          </div>

          {showNotifs && (
            <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg border p-0 z-1050" style={{ width: '320px' }}>
              <div className="p-3 border-bottom bg-light fw-bold small">Notifications</div>
              <div className="list-group list-group-flush" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                <div className="list-group-item border-0 p-3 small">
                   <span className="fw-bold text-primary">Math Quiz</span> due tomorrow.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="cursor-pointer p-2 rounded-circle hover-bg-light" onClick={() => navigate('/settings')}>
          <Settings size={20} className="text-muted" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
