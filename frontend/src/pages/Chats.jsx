import { MessageCircle, Send } from 'lucide-react';

export default function Chats() {
  return (
    <div className="p-4 h-100 d-flex flex-column">
      <h3 className="fw-bold mb-4">Study Groups</h3>
      <div className="row flex-grow-1">
        <div className="col-md-4 border-end">
          <div className="list-group list-group-flush">
            <div className="list-group-item active rounded-3 border-0 mb-2">Math Finals Group</div>
            <div className="list-group-item rounded-3 border-0">Web Dev Peers</div>
          </div>
        </div>
        <div className="col-md-8 d-flex flex-column">
          <div className="flex-grow-1 bg-white rounded-4 border p-3 mb-3 shadow-sm">
            <p className="text-muted text-center small">End-to-end encrypted collaboration</p>
          </div>
          <div className="input-group">
            <input type="text" className="form-control rounded-pill-start border-0 shadow-sm px-4" placeholder="Type a message..." />
            <button className="btn btn-primary rounded-pill-end px-4"><Send size={18}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
