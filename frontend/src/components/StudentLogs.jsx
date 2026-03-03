import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { adminLogout } from '../api';
import {
  Search, User, Bus, QrCode, AlertCircle, Clock,
  CheckCircle, XCircle, ArrowRight,
} from 'lucide-react';

const StudentLogs = () => {
  const [rfid, setRfid]         = useState('');
  const [student, setStudent]   = useState(null);
  const [logs, setLogs]         = useState([]);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!rfid.trim()) { setError('Please enter an RFID UID to search.'); return; }
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/attendance/student/${rfid.trim()}`, { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : [];
      if (data.length > 0) {
        setStudent(data[0].studentId || null);
        setLogs(data);
      } else {
        setStudent(null);
        setLogs([]);
        setError('No records found for this RFID UID. The student may not be registered.');
      }
    } catch (_err) {
      setError('Failed to retrieve records. Check the RFID UID and server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await adminLogout(); navigate('/login'); window.location.reload(); }
    catch (_e) { /* noop */ }
  };

  const lastSeen = logs.length > 0
    ? new Date(logs[logs.length - 1].timestamp).toLocaleString('en-IN')
    : 'N/A';

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">Student Lookup</div>
            <div className="topbar-subtitle">Search attendance history by RFID card UID</div>
          </div>
        </div>

        <div className="page-container animate-fade-in-up">

          {/* Search box */}
          <div className="glass-card" style={{ maxWidth: 620, marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
              RFID Card Search
            </h2>
            <div style={{ display: 'flex', gap: 10 }}>
              <div className="form-input-icon-wrapper" style={{ flex: 1 }}>
                <QrCode size={14} />
                <input
                  className="form-input"
                  placeholder="Enter RFID UID (e.g. 04A3B12C)"
                  value={rfid}
                  onChange={e => { setRfid(e.target.value); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSearch}
                disabled={loading || !rfid.trim()}
              >
                {loading ? 'Searching…' : (
                  <><Search size={14} /> Search</>
                )}
              </button>
            </div>

            {error && (
              <div className="notification error" style={{ marginTop: 12 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </div>

          {/* Results */}
          {searched && !loading && !error && student && (
            <div className="animate-fade-in">

              {/* Student profile card */}
              <div className="glass-card" style={{ maxWidth: 620, marginBottom: 20 }}>
                <div className="flex items-center gap-16">
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'var(--blue-50)', border: '2px solid var(--blue-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={22} color="var(--brand-primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {student.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                      <span>Student ID: <strong style={{ color: 'var(--text-secondary)' }}>{student.studentId}</strong></span>
                      <span>Bus: <strong style={{ color: 'var(--text-secondary)' }}>{student.busId || 'N/A'}</strong></span>
                      <span>RFID: <strong style={{ color: 'var(--text-secondary)' }}>{student.rfidUid || rfid}</strong></span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total records</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-primary)' }}>{logs.length}</div>
                  </div>
                </div>
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle size={12} color="var(--green-600)" />
                    Check-ins: <strong style={{ color: 'var(--text-secondary)', marginLeft: 2 }}>
                      {logs.filter(l => l.status === 'Check In').length}
                    </strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <XCircle size={12} color="var(--red-600)" />
                    Check-outs: <strong style={{ color: 'var(--text-secondary)', marginLeft: 2 }}>
                      {logs.filter(l => l.status !== 'Check In').length}
                    </strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} />
                    Last activity: <strong style={{ color: 'var(--text-secondary)', marginLeft: 2 }}>{lastSeen}</strong>
                  </span>
                </div>
              </div>

              {/* Logs table */}
              <div className="glass-card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Attendance History</h3>
                </div>
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Bus ID</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, i) => (
                        <tr key={log._id}>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{i + 1}</td>
                          <td>
                            <span className={`badge ${log.status === 'Check In' ? 'badge-active' : 'badge-error'}`}>
                              {log.status === 'Check In' ? (
                                <CheckCircle size={11} />
                              ) : (
                                <XCircle size={11} />
                              )}
                              {log.status}
                            </span>
                          </td>
                          <td>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                              <Bus size={12} color="var(--text-muted)" />
                              {log.busId || 'N/A'}
                            </span>
                          </td>
                          <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                            {new Date(log.timestamp).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* How it works */}
          {!searched && (
            <div className="glass-card" style={{ maxWidth: 620 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>
                How RFID Student Lookup Works
              </h3>
              {[
                { step: '01', text: 'Student taps their RFID card on the bus scanner' },
                { step: '02', text: 'System records a Check In or Check Out event' },
                { step: '03', text: 'Enter the RFID UID above to view full attendance history' },
              ].map(({ step, text }) => (
                <div key={step} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--blue-50)', border: '1px solid var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-primary)' }}>{step}</span>
                  </div>
                  <div style={{ flex: 1, fontSize: 13.5, color: 'var(--text-secondary)', paddingTop: 5 }}>{text}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentLogs;
