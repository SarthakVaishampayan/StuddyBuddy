import { FileText, Clock, CheckCircle } from 'lucide-react';

export default function Assignments() {
  const list = [
    { id: 1, title: 'Database Normalization', subject: 'DBMS', due: '2 Days', status: 'Pending' },
    { id: 2, title: 'React Hooks Essay', subject: 'Web Dev', due: 'Completed', status: 'Done' },
  ];

  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4">Assignments</h3>
      <div className="row g-3">
        {list.map(item => (
          <div className="col-12" key={item.id}>
            <div className="bg-white p-3 rounded-4 border shadow-sm d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded-3">
                  <FileText className="text-primary" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">{item.title}</h6>
                  <small className="text-muted">{item.subject}</small>
                </div>
              </div>
              <span className={`badge rounded-pill ${item.status === 'Done' ? 'bg-success' : 'bg-warning text-dark'}`}>
                {item.status === 'Done' ? <CheckCircle size={14} className="me-1"/> : <Clock size={14} className="me-1"/>}
                {item.due}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
