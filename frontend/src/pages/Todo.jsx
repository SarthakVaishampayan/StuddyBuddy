import { CheckSquare, Plus } from 'lucide-react';

export default function Todo() {
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Detailed To-Do List</h3>
        <button className="btn btn-primary rounded-pill px-4"><Plus size={18} className="me-2"/> Add Task</button>
      </div>
      <div className="bg-white p-4 rounded-4 shadow-sm border">
        <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
          <input type="checkbox" className="form-check-input" />
          <span className="fw-medium">Finish Research Paper for Sociology</span>
        </div>
      </div>
    </div>
  );
}
