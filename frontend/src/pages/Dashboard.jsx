import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../context/TimerContext';
import { Play, Pause, Save, RotateCcw, Check, Plus, Trash2, MoreHorizontal, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';

const Dashboard = () => {
  const { user, token } = useAuth();
  const { elapsedTime, setElapsedTime, timerRunning, setTimerRunning } = useTimer();
  
  const [habits, setHabits] = useState([]);
  const [studyStats, setStudyStats] = useState({ today: "0m 0s", totalSeconds: 0, percentChange: 0 });
  const [barData, setBarData] = useState([]);
  const [showLogDialog, setShowLogDialog] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newHabitName, setNewHabitName] = useState('');

  const formatHms = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
  };

  const fetchData = async () => {
    try {
      const hRes = await fetch('http://localhost:5000/api/habits', { headers: { Authorization: `Bearer ${token}` } });
      const hData = await hRes.json();
      if (hData.success) setHabits(hData.habits);

      const sRes = await fetch('http://localhost:5000/api/sessions/today', { headers: { Authorization: `Bearer ${token}` } });
      const sData = await sRes.json();
      if (sData.success) setStudyStats({ today: formatHms(sData.totalSeconds), totalSeconds: sData.totalSeconds, percentChange: sData.percentChange });

      const wRes = await fetch('http://localhost:5000/api/sessions/weekly-stats', { headers: { Authorization: `Bearer ${token}` } });
      const wData = await wRes.json();
      if (wData.success) {
        // Dynamic scaling: If all sessions are small, we scale the graph to emphasize minutes.
        const maxHours = Math.max(...wData.graphData.map(d => d.hours));
        const chartData = wData.graphData.map(d => ({
          ...d,
          // Ensure even 10s is visible by providing a tiny minimum height
          displayHours: d.hours === 0 ? 0 : Math.max(d.hours, maxHours * 0.05)
        }));
        setBarData(chartData);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleLogSession = async () => {
    const res = await fetch('http://localhost:5000/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ durationInSeconds: elapsedTime })
    });
    if (res.ok) { setElapsedTime(0); setTimerRunning(false); setShowLogDialog(false); fetchData(); }
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar />
      <div className="p-4 px-lg-5">
        <h2 className="fw-bold mb-5 mt-3">Hello, {user?.name?.split(' ')[0]}!</h2>
        
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="text-muted small fw-bold text-uppercase">Tasks Pending</h6>
              <h1 className="fw-bold my-3">3</h1>
              <p className="text-muted small mb-0">View your list</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="text-muted small fw-bold text-uppercase">Study Today</h6>
              <h1 className="fw-bold text-primary my-3">{studyStats.today}</h1>
              <p className={`small mb-0 fw-bold ${studyStats.percentChange >= 0 ? 'text-success' : 'text-danger'}`}>
                {studyStats.percentChange >= 0 ? '+' : ''}{studyStats.percentChange}% vs yesterday
              </p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <h6 className="text-muted small fw-bold text-uppercase">Weekly Total</h6>
              <h1 className="fw-bold my-3 text-dark">{formatHms(barData.reduce((a,b)=>a+b.rawSeconds,0))}</h1>
              <p className="text-muted small mb-0">Total focus time</p>
            </div>
          </div>
          <div className="col-md-3 text-center">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100 d-flex flex-column justify-content-center align-items-center">
              <h6 className="text-muted small fw-bold text-uppercase mb-2">Focus Timer</h6>
              <div className="h2 fw-bold text-primary mb-3 font-monospace">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </div>
              <button className={`btn btn-lg rounded-circle shadow-sm ${timerRunning ? 'btn-danger' : 'btn-primary'}`} 
                onClick={() => timerRunning ? (setTimerRunning(false), setShowLogDialog(true)) : setTimerRunning(true)}>
                {timerRunning ? <Pause size={24}/> : <Play size={24}/>}
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-white p-4 rounded-4 shadow-sm border" style={{minHeight: '430px'}}>
              <h6 className="fw-bold mb-4">Study Activity (Rolling 7 Days)</h6>
              <div style={{width: '100%', height: 320}}>
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis 
                      dataKey="day" 
                      axisLine={false} tickLine={false} 
                      height={60}
                      tick={({x, y, payload}) => (
                        <g transform={`translate(${x},${y})`}>
                          <text x={0} y={10} dy={16} textAnchor="middle" fill="#111" fontSize={12} fontWeight="bold">{payload.value}</text>
                          <text x={0} y={30} dy={16} textAnchor="middle" fill="#6b7280" fontSize={11}>{barData[payload.index]?.date}</text>
                        </g>
                      )} 
                    />
                    <YAxis hide={true} domain={[0, 'auto']} />
                    <Tooltip cursor={{fill: '#f9fafb'}} content={({active, payload}) => active && payload && (
                      <div className="bg-white p-3 border rounded-3 shadow-sm small">
                        <div className="fw-bold text-dark">{payload[0].payload.day}, {payload[0].payload.date}</div>
                        <div className="text-primary fw-bold">{formatHms(payload[0].payload.rawSeconds)}</div>
                      </div>
                    )} />
                    <Bar dataKey="displayHours" radius={[6, 6, 0, 0]} barSize={45}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 6 ? '#8b5cf6' : '#ddd6fe'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* ... Habits section remains same ... */}
          <div className="col-lg-4">
            <div className="bg-white p-4 rounded-4 shadow-sm border h-100">
              <div className="d-flex justify-content-between mb-4 align-items-center">
                <h6 className="fw-bold mb-0">Daily Habits</h6>
                <button className="btn btn-sm btn-light rounded-circle" onClick={() => setShowHabitModal(true)}><Plus size={18}/></button>
              </div>
              <div className="d-flex flex-column gap-3">
                {habits.map(h => (
                  <div key={h._id} className="d-flex justify-content-between align-items-center p-3 border rounded-4 bg-light bg-opacity-10">
                    <div>
                      <div className="fw-bold small">{h.name}</div>
                      <div className="text-muted x-small">{h.streak} day streak</div>
                    </div>
                    <div className="d-flex gap-2">
                      <button className={`btn btn-sm rounded-circle ${h.lastCompleted && new Date(h.lastCompleted).toDateString() === new Date().toDateString() ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => fetch(`http://localhost:5000/api/habits/${h._id}/toggle`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }).then(() => fetchData())}>
                        <Check size={14}/>
                      </button>
                      <button className="btn btn-sm text-danger border-0" onClick={() => setDeleteId(h._id)}><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ... Modals (Habit Modal, Delete Modal, Log Dialog) from previous code ... */}
      {deleteId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3" style={{backdropFilter: 'blur(5px)'}}>
          <div className="bg-white p-4 rounded-4 shadow-lg text-center" style={{width: '350px'}}>
            <AlertCircle size={48} className="text-danger mb-3" />
            <h5 className="fw-bold">Delete Habit?</h5>
            <p className="text-muted small mb-4">Are you sure? This will permanently remove the habit and your streak data.</p>
            <div className="d-flex gap-2">
              <button className="btn btn-danger flex-grow-1 py-2 fw-bold rounded-3" onClick={async () => {
                await fetch(`http://localhost:5000/api/habits/${deleteId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                setDeleteId(null); fetchData();
              }}>Yes, Delete</button>
              <button className="btn btn-light py-2 rounded-3 px-3" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showHabitModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3" style={{backdropFilter: 'blur(5px)'}}>
          <div className="bg-white p-4 rounded-4 shadow-lg" style={{width: '380px'}}>
            <h5 className="fw-bold mb-4">Add New Habit</h5>
            <input className="form-control rounded-3 mb-4 py-2" placeholder="e.g., Read for 30 mins" value={newHabitName} onChange={e => setNewHabitName(e.target.value)} autoFocus />
            <div className="d-flex gap-2">
              <button className="btn btn-primary flex-grow-1 py-2 fw-bold rounded-3" onClick={async (e) => {
                e.preventDefault();
                const res = await fetch('http://localhost:5000/api/habits', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ name: newHabitName })
                });
                if (res.ok) { setNewHabitName(''); setShowHabitModal(false); fetchData(); }
              }}>Create</button>
              <button className="btn btn-light py-2 rounded-3" onClick={() => setShowHabitModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showLogDialog && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3" style={{backdropFilter: 'blur(5px)'}}>
          <div className="bg-white p-4 rounded-4 shadow-lg text-center" style={{width: '380px'}}>
            <h5 className="fw-bold mb-3">Log {formatHms(elapsedTime)}?</h5>
            <div className="d-grid gap-2">
              <button className="btn btn-primary py-2 fw-bold rounded-3" onClick={handleLogSession}><Save className="me-2" size={18}/> Log Session</button>
              <button className="btn btn-outline-secondary py-2 rounded-3" onClick={() => {setElapsedTime(0); setShowLogDialog(false); setTimerRunning(false);}}><RotateCcw className="me-2" size={18}/> Reset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
