const Settings = () => (
  <div className="p-4">
    <h4 className="fw-bold mb-4">Settings</h4>
    <div className="row g-4">
      <div className="col-md-6">
        <div className="bg-white p-4 rounded-4 shadow-sm border">
          <h6 className="fw-bold mb-3">Study Preferences</h6>
          <div className="mb-3">
            <label className="form-label small fw-medium mb-1">Pomodoro Duration</label>
            <select className="form-select form-select-sm">
              <option>25 minutes</option>
              <option>30 minutes</option>
              <option>45 minutes</option>
            </select>
          </div>
          <div className="mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="notifications" />
              <label className="form-check-label small" htmlFor="notifications">
                Email notifications
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="bg-white p-4 rounded-4 shadow-sm border">
          <h6 className="fw-bold mb-3">Account</h6>
          <button className="btn btn-outline-danger btn-sm w-100 mb-2">Change Password</button>
          <button className="btn btn-outline-primary btn-sm w-100">Upgrade to Premium</button>
        </div>
      </div>
    </div>
  </div>
);

export default Settings;
