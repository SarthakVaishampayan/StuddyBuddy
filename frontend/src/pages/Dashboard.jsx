import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Play, Pause, Check, MoreHorizontal, RotateCcw, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const initialHabits = [
  { id: 1, name: 'Exercise', completed: 85, streak: 12, longest: 25, today: true },
  { id: 2, name: 'Reading', completed: 72, streak: 8, longest: 18, today: false },
  { id: 3, name: 'Water Intake', completed: 95, streak: 45, longest: 52, today: true },
  { id: 4, name: '8h Sleep', completed: 68, streak: 3, longest: 35, today: false },
];

const barData = [
  { name: 'Sun', hours: 4 }, { name: 'Mon', hours: 6 }, { name: 'Tue', hours: 4.5 },
  { name: 'Wed', hours: 7 }, { name: 'Thu', hours: 3.8 }, { name: 'Fri', hours: 5 }, { name: 'Sat', hours: 8 },
];

const pieData = [{ name: 'Completed', value: 85 }, { name: 'Pending', value: 15 }];

const Dashboard = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState(initialHabits);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);
  
  // Storage for logged sessions to be fed to backend later
  const [loggedSessions, setLoggedSessions] = useState([]);
  
  // Dynamic stats that update when you log a session
  const [studyStats, setStudyStats] = useState({ today: 4.2, week: 25.5, yesterday: 3.2 });

  // Study Timer Logic
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimerAction = () => {
    if (timerRunning) {
      setTimerRunning(false);
      setShowLogDialog(true);
    } else {
      setTimerRunning(true);
    }
  };

  const handleReset = () => {
    setElapsedTime(0);
    setShowLogDialog(false);
    setTimerRunning(false);
  };

  const handleLogSession = () => {
    // 1. Calculate the time earned
    const hoursEarned = parseFloat((elapsedTime / 3600).toFixed(2));
    
    // 2. Save session data (to be sent to backend in later phases)
    const newSession = {
      id: Date.now(),
      durationInHours: hoursEarned,
      durationInSeconds: elapsedTime,
      timestamp: new Date().toISOString()
    };
    setLoggedSessions(prev => [...prev, newSession]);

    // 3. Update the UI stats immediately for visual feedback
    setStudyStats(prev => ({ 
      ...prev, 
      today: parseFloat((prev.today + hoursEarned).toFixed(1)) 
    }));

    // 4. RESET and STOP the timer as requested
    setElapsedTime(0);
    setTimerRunning(false);
    setShowLogDialog(false);
    
    console.log("Session Logged:", newSession);
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, today: !h.today, streak: h.today ? h.streak - 1 : h.streak + 1 } : h
    ));
  };

  return (
    <div className="bg-light min-vh-100 position-relative">
      <Navbar />
      
      <div className="p-4">
        {/* Stats Row */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div 
              className="bg-white p-4 rounded-4 shadow-sm border cursor-pointer transition-all hover-shadow h-100"
              onClick={() => navigate('/todo')}
            >
              <h6 className="fw-bold text-muted small mb-3 uppercase tracking-wider">ToDo List</h6>
              <h2 className="fw-bold mb-1 text-dark">3</h2>
              <p className="text-muted small mb-0">Tasks remaining for today</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="fw-bold text-muted small mb-3 uppercase tracking-wider">Study Today</h6>
              <h2 className="fw-bold mb-1 text-dark">{studyStats.today}h</h2>
              <p className={`small fw-medium mb-0 ${studyStats.today >= studyStats.yesterday ? 'text-success' : 'text-danger'}`}>
                {studyStats.today >= studyStats.yesterday ? '+' : ''}
                {((studyStats.today / studyStats.yesterday - 1) * 100).toFixed(0)}% vs yesterday
              </p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="fw-bold text-muted small mb-3 uppercase tracking-wider">This Week</h6>
              <h2 className="fw-bold mb-1 text-dark">{studyStats.week}h</h2>
              <p className="text-muted small mb-0">Total focused study time</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="bg-white p-4 text-center rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-center">
              <h6 className="fw-bold text-muted mb-2 uppercase small tracking-wider">Study Session</h6>
              <div className="h3 fw-bold text-primary mb-3 font-monospace">{formatTime(elapsedTime)}</div>
              <div className="d-flex justify-content-center">
                <button 
                  className={`btn rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm ${timerRunning ? 'btn-danger' : 'btn-primary'}`}
                  onClick={handleTimerAction}
                  style={{ width: '50px', height: '50px', backgroundColor: timerRunning ? '#ef4444' : '#8b5cf6', border: 'none' }}
                >
                  {timerRunning ? <Pause size={20} color="white" /> : <Play size={20} color="white" className="ms-1" />}
                </button>
              </div>
              <small className={`mt-2 fw-bold ${timerRunning ? 'text-danger' : 'text-primary'}`}>
                {timerRunning ? 'Session Live' : 'Click to Focus'}
              </small>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold mb-0 text-dark">Study Activity</h6>
                <MoreHorizontal size={20} className="text-muted cursor-pointer" />
              </div>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#f9fafb'}} />
                    <Bar dataKey="hours" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="fw-bold mb-4 text-dark">Task Summary</h6>
              <div className="position-relative" style={{ width: '100%', height: 200 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#8b5cf6" /><Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                  <h4 className="fw-bold mb-0 text-dark">85%</h4>
                  <p className="text-muted x-small mb-0">Done</p>
                </div>
              </div>
              <div className="mt-4 px-2">
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted">Completed Tasks</span>
                  <span className="fw-bold text-success">24</span>
                </div>
                <div className="d-flex justify-content-between small">
                  <span className="text-muted">Assignments Due</span>
                  <span className="fw-bold text-warning">4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Tracker */}
        <div className="bg-white p-4 rounded-4 shadow-sm border">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h6 className="fw-bold mb-1 text-dark">Daily Habit Tracker</h6>
              <p className="text-muted x-small mb-0">Consistent habits lead to successful study outcomes</p>
            </div>
            <button className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
              + New Habit
            </button>
          </div>
          <div className="row g-3">
            {habits.map(habit => (
              <div key={habit.id} className="col-md-3">
                <div className="p-3 border rounded-3 bg-light bg-opacity-25 text-center">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fw-bold small text-dark">{habit.name}</span>
                    <button 
                      className={`btn btn-sm rounded-circle d-flex align-items-center justify-content-center p-0 transition-all ${habit.today ? 'btn-success' : 'btn-outline-secondary'}`} 
                      style={{width: '28px', height: '28px'}} 
                      onClick={() => toggleHabit(habit.id)}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                  <div className="h2 fw-bold mb-0 text-primary" style={{ color: '#8b5cf6' }}>{habit.streak}d</div>
                  <p className="text-muted x-small uppercase tracking-tighter mb-0">Current Streak</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timer Log Dialog */}
      {showLogDialog && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 z-1060 d-flex align-items-center justify-content-center p-4"
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <div className="bg-white rounded-4 p-5 text-center shadow-lg border-0" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="mb-4">
              <div className="display-5 fw-bold text-primary mb-2 font-monospace">{formatTime(elapsedTime)}</div>
              <h5 className="fw-bold text-dark">Session Paused</h5>
            </div>
            
            <p className="text-muted small mb-4 pb-3 border-bottom">
              Would you like to log this session to your study statistics or reset the timer?
            </p>
            
            <div className="d-grid gap-2">
              <button 
                className="btn btn-primary d-flex align-items-center justify-content-center gap-2 fw-bold py-2 rounded-3"
                onClick={handleLogSession}
              >
                <Save size={18} />
                Log Session
              </button>
              <button 
                className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 py-2 rounded-3"
                onClick={handleReset}
              >
                <RotateCcw size={18} />
                Reset Timer
              </button>
              <button 
                className="btn btn-link text-muted small p-0 mt-2 text-decoration-none"
                onClick={() => setShowLogDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
