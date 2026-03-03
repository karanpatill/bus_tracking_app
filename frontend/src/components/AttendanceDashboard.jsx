import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import {
  Search, Download, RefreshCw, Users, Bus, Clock,
  ChevronLeft, ChevronRight, AlertCircle,
} from 'lucide-react';
import { adminLogout } from '../api';

const BASE = 'http://localhost:5000';

const AttendanceDashboard = () => {
  const [logs, setLogs]               = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchStudent, setSearchStudent] = useState('');
  const [searchBus, setSearchBus]     = useState('');
  const [dateRange, setDateRange]     = useState({ start: '', end: '' });
  const [rangeFilter, setRangeFilter] = useState('All');
  const [page, setPage]               = useState(1);
  const PER_PAGE = 10;
  const navigate = useNavigate();

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE}/api/attendance/logs`, { withCredentials: true });
      const data = Array.isArray(res.data) ? res.data : [];
      setLogs(data);
      setFiltered(data);
    } catch (_err) {
      setError('Failed to fetch attendance logs. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  useEffect(() => {
    let data = [...logs];
    if (searchStudent) {
      const q = searchStudent.toLowerCase();
      data = data.filter(l =>
        l.studentId?.studentId?.toLowerCase().includes(q) ||
        l.studentId?.name?.toLowerCase().includes(q)
      );
    }
    if (searchBus) {
      data = data.filter(l => l.busId?.toLowerCase().includes(searchBus.toLowerCase()));
    }
    if (dateRange.start && dateRange.end) {
      const s = new Date(dateRange.start), e = new Date(dateRange.end);
      data = data.filter(l => { const d = new Date(l.timestamp); return d >= s && d <= e; });
    }
    if (rangeFilter !== 'All') {
      const now = new Date();
      const from = rangeFilter === 'Today'
        ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
        : new Date(now.setDate(now.getDate() - 7));
      data = data.filter(l => new Date(l.timestamp) >= from);
    }
    setFiltered(data);
    setPage(1);
  }, [searchStudent, searchBus, dateRange, rangeFilter, logs]);

  const exportCSV = () => {
    const rows = [
      'Student ID,Name,Bus ID,Status,Timestamp',
      ...filtered.map(l =>
        `${l.studentId?.studentId || ''},${l.studentId?.name || ''},${l.busId || ''},${l.status},${new Date(l.timestamp).toLocaleString()}`
      ),
    ].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
    a.download = 'attendance_logs.csv';
    a.click();
  };

  const handleLogout = async () => {
    try { await adminLogout(); navigate('/login'); window.location.reload(); } catch (_e) { /* noop */ }
  };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const boarded  = filtered.filter(l => l.status === 'Check In').length;
  const alighted = filtered.length - boarded;

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">Student Attendance</div>
            <div className="topbar-subtitle">RFID-based boarding and alighting records</div>
          </div>
          <div className="topbar-right">
            <button className="btn btn-secondary btn-sm" onClick={fetchLogs}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="btn btn-primary btn-sm" onClick={exportCSV}>
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        <div className="page-container animate-fade-in-up">

          {/* Stats */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 20 }}>
            {[
              { label: 'Total Records',      value: filtered.length, icon: Users, color: 'blue'  },
              { label: 'Boarded (Check In)', value: boarded,         icon: Bus,   color: 'green' },
              { label: 'Alighted',           value: alighted,        icon: Clock, color: 'amber' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div className={`stat-card ${color}`} key={label}>
                <div className="stat-card-header">
                  <div className="stat-card-title">{label}</div>
                  <div className={`stat-card-icon ${color}`}><Icon size={17} /></div>
                </div>
                <div className="stat-card-value">{value}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="glass-card" style={{ marginBottom: 20 }}>
            <div className="flex flex-wrap gap-12 items-center">
              <div className="form-input-icon-wrapper" style={{ flex: 1, minWidth: 180 }}>
                <Search size={14} />
                <input
                  className="form-input"
                  placeholder="Search by student ID or name..."
                  value={searchStudent}
                  onChange={e => setSearchStudent(e.target.value)}
                />
              </div>
              <div className="form-input-icon-wrapper" style={{ flex: 1, minWidth: 160 }}>
                <Bus size={14} />
                <input
                  className="form-input"
                  placeholder="Filter by bus ID..."
                  value={searchBus}
                  onChange={e => setSearchBus(e.target.value)}
                />
              </div>
              <input type="date" className="form-input" style={{ width: 'auto' }} value={dateRange.start} onChange={e => setDateRange(d => ({ ...d, start: e.target.value }))} />
              <input type="date" className="form-input" style={{ width: 'auto' }} value={dateRange.end}   onChange={e => setDateRange(d => ({ ...d, end:   e.target.value }))} />
              <div className="filter-tab-bar">
                {['Today', 'Last 7 Days', 'All'].map(r => (
                  <button key={r} className={`filter-tab ${rangeFilter === r ? 'active' : ''}`} onClick={() => setRangeFilter(r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
              {filtered.length} record{filtered.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {/* Table */}
          <div className="glass-card" style={{ padding: 0 }}>
            {loading ? (
              <div className="loading-container"><div className="loading-spinner" /><span>Loading records…</span></div>
            ) : error ? (
              <div className="notification error" style={{ margin: 20 }}><AlertCircle size={15} /> {error}</div>
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Users size={24} color="var(--text-muted)" /></div>
                <div className="empty-state-title">No records found</div>
                <div className="empty-state-desc">Adjust your search filters or refresh the data.</div>
              </div>
            ) : (
              <>
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>#</th><th>Student ID</th><th>Name</th><th>Bus ID</th><th>Status</th><th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((log, i) => (
                        <tr key={log._id}>
                          <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{(page - 1) * PER_PAGE + i + 1}</td>
                          <td style={{ fontWeight: 600, color: 'var(--brand-primary)' }}>{log.studentId?.studentId || 'N/A'}</td>
                          <td>{log.studentId?.name || 'N/A'}</td>
                          <td>{log.busId || 'N/A'}</td>
                          <td>
                            <span className={`badge ${log.status === 'Check In' ? 'badge-active' : 'badge-error'}`}>
                              {log.status === 'Check In' ? 'Check In' : 'Check Out'}
                            </span>
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {new Date(log.timestamp).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="pagination">
                  <div className="pagination-info">
                    Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
                  </div>
                  <div className="pagination-pages">
                    <button className="pagination-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
                      <button key={p} className={`pagination-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                    ))}
                    {totalPages > 5 && <span className="pagination-btn" style={{ cursor: 'default', pointerEvents: 'none' }}>…</span>}
                    <button className="pagination-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
