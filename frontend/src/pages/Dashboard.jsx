import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, Check, MoreHorizontal, RotateCcw, Save, X } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const pieData = [{ name: 'Completed', value: 85 }, { name: 'Pending', value: 15 }];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  // Data States
  const [habits, setHabits] = useState([]);
  const [barData, setBarData] = useState([]);
  const [studyStats, setStudyStats] = useState({ today: 0, week: 0, yesterday: 0 });
  const [loading, setLoading] = useState(true);

  // Timer States
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);

  // Fetch Initial Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/demo/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setHabits(data.habits);
        setBarData(data.barData);
        setStudyStats(data.studyStats);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);

  // Timer Interval Logic
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer Actions
  const handleToggleTimer = () => {
    if (timerRunning) {
      setTimerRunning(false);
      setShowLogDialog(true); // Open dialog when paused
    } else {
      setTimerRunning(true);
    }
  };

  const handleResetTimer = () => {
    setElapsedTime(0);
    setTimerRunning(false);
    setShowLogDialog(false);
  };

  const handleLogSession = () => {
    // 1. Convert seconds to hours (decimal)
    const hoursEarned = parseFloat((elapsedTime / 3600).toFixed(2));
    
    // 2. Update the UI stats immediately
    setStudyStats(prev => ({
      ...prev,
      today: parseFloat((prev.today + hoursEarned).toFixed(2)),
      week: parseFloat((prev.week + hoursEarned).toFixed(2))
    }));

    // 3. Reset timer and close dialog
    setElapsedTime(0);
    setTimerRunning(false);
    setShowLogDialog(false);
    
    alert(`Session logged: ${hoursEarned} hours added to your total!`);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, today: !h.today, streak: h.today ? h.streak - 1 : h.streak + 1 } : h
    ));
  };

  if (loading) return <div className="p-5 text-center">Loading Dashboard...</div>;

  return (
    <div className="bg-light min-vh-100 position-relative">
      <Navbar />
      <div className="p-4">
        <h3 className="fw-bold mb-4 text-dark">Hello, {user?.name?.split(' ')[0] || 'User'}!</h3>
        
        {/* Stats Row */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 cursor-pointer" onClick={() => navigate('/todo')}>
              <h6 className="fw-bold text-muted small mb-3 text-uppercase">Tasks Pending</h6>
              <h2 className="fw-bold mb-1">3</h2>
              <p className="text-muted small mb-0">View your list</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="fw-bold text-muted small mb-3 text-uppercase">Study Today</h6>
              <h2 className="fw-bold mb-1 text-primary">{studyStats.today}h</h2>
              <p className="text-success small mb-0">+12% vs yesterday</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="fw-bold text-muted small mb-3 text-uppercase">Weekly Total</h6>
              <h2 className="fw-bold mb-1">{studyStats.week}h</h2>
              <p className="text-muted small mb-0">Total focus time</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="bg-white p-4 text-center rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-center">
              <h6 className="fw-bold text-muted small mb-2 text-uppercase">Focus Timer</h6>
              <div className="h3 fw-bold text-primary mb-3 font-monospace">{formatTime(elapsedTime)}</div>
              <div className="d-flex justify-content-center gap-2">
                <button 
                  className={`btn rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm ${timerRunning ? 'btn-danger' : 'btn-primary'}`}
                  onClick={handleToggleTimer}
                  style={{ width: '45px', height: '45px' }}
                >
                  {timerRunning ? <Pause size={20} /> : <Play size={20} className="ms-1" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Habits Row */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <h6 className="fw-bold mb-4">Study Activity</h6>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f9fafb'}} />
                    <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="fw-bold mb-4">Daily Habits</h6>
              <div className="d-flex flex-column gap-3">
                {habits.map(habit => (
                  <div key={habit.id} className="d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light bg-opacity-50">
                    <div>
                      <div className="fw-bold small">{habit.name}</div>
                      <div className="text-muted x-small">{habit.streak} day streak</div>
                    </div>
                    <button 
                      className={`btn btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center ${habit.today ? 'btn-success' : 'btn-outline-secondary'}`}
                      style={{ width: '28px', height: '28px' }}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Log Dialog Overlay */}
      {showLogDialog && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center z-3 shadow-lg" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="bg-white p-5 rounded-4 shadow-lg text-center" style={{ maxWidth: '400px', width: '90%' }}>
            <div className="d-flex justify-content-end">
                <button className="btn btn-link text-muted p-0" onClick={() => setShowLogDialog(false)}><X size={20}/></button>
            </div>
            <div className="h1 fw-bold text-primary mb-3 font-monospace">{formatTime(elapsedTime)}</div>
            <h5 className="fw-bold mb-3">Session Paused</h5>
            <p className="text-muted small mb-4">Would you like to log this time to your daily study total or reset the timer?</p>
            
            <div className="d-grid gap-2">
              <button className="btn btn-primary fw-bold py-2 d-flex align-items-center justify-content-center gap-2" onClick={handleLogSession}>
                <Save size={18} /> Log Study Session
              </button>
              <button className="btn btn-outline-secondary fw-bold py-2 d-flex align-items-center justify-content-center gap-2" onClick={handleResetTimer}>
                <RotateCcw size={18} /> Reset Timer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
