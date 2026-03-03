import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { adminLogout } from '../api';
import { RefreshCw, AlertCircle, Filter, MapPin, CheckCircle, Clock, ShieldAlert, Info, Zap, Navigation, Timer, Pause } from 'lucide-react';

const getBorderClass = (type) => {
  const map = { Emergency: 'emergency', SpeedViolation: 'speed', GeoFence: 'geofence', Delay: 'delay', Idle: 'idle' };
  return map[type] || '';
};

const getAlertMeta = (type) => {
  const map = {
    Emergency:      { label: 'Emergency',          badge: 'badge-emergency', Icon: ShieldAlert },
    SpeedViolation: { label: 'Speed Violation',    badge: 'badge-warning',   Icon: Zap },
    GeoFence:       { label: 'Geo-fence Breach',   badge: 'badge-info',      Icon: Navigation },
    Delay:          { label: 'Delay',              badge: 'badge-purple',    Icon: Timer },
    Idle:           { label: 'Idle Engine',         badge: 'badge-active',    Icon: Pause },
  };
  return map[type] || { label: type, badge: 'badge-info', Icon: Info };
};

const getSeverityMeta = (severity) => {
  const map = {
    danger:  { badge: 'badge-error',   label: 'Critical' },
    warning: { badge: 'badge-warning', label: 'Warning'  },
    info:    { badge: 'badge-info',    label: 'Info'      },
  };
  return map[severity] || { badge: 'badge-info', label: severity || '—' };
};

const AlertsPage = () => {
  const [alerts, setAlerts]           = useState([]);
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/alerts');
      setAlerts(Array.isArray(res.data) ? res.data : []);
      setError(null);
      setLastUpdated(new Date());
    } catch (_err) {
      setError('Unable to fetch alerts. Please verify the server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const id = setInterval(fetchAlerts, 10_000);
    return () => clearInterval(id);
  }, []);

  const filterTypes = ['All', 'Emergency', 'SpeedViolation', 'GeoFence', 'Delay', 'Idle'];
  const filterLabels = {
    All: 'All', Emergency: 'Emergency', SpeedViolation: 'Speed', GeoFence: 'Geo-fence', Delay: 'Delay', Idle: 'Idle',
  };

  const filteredAlerts = activeFilter === 'All'
    ? alerts
    : alerts.filter(a => a.type === activeFilter);

  const handleLogout = async () => {
    try { await adminLogout(); window.location.href = '/login'; } catch (_e) { /* noop */ }
  };

  const summaryTypes = [
    { type: 'Emergency',      label: 'Emergency',       color: 'var(--red-600)' },
    { type: 'SpeedViolation', label: 'Speed Violation', color: 'var(--amber-600)' },
    { type: 'GeoFence',       label: 'Geo-fence',       color: 'var(--brand-primary)' },
    { type: 'Delay',          label: 'Delay',           color: 'var(--purple-600)' },
    { type: 'Idle',           label: 'Idle Engine',     color: 'var(--green-600)' },
  ];

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">Alerts &amp; Notifications</div>
            <div className="topbar-subtitle">
              Real-time monitoring of fleet incidents and security events
            </div>
          </div>
          <div className="topbar-right">
            {alerts.filter(a => a.severity === 'danger').length > 0 && (
              <span className="badge badge-emergency">
                {alerts.filter(a => a.severity === 'danger').length} critical
              </span>
            )}
            <button className="btn btn-secondary btn-sm" onClick={fetchAlerts}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        <div className="page-container animate-fade-in-up">

          {/* Summary stats */}
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 20 }}>
            {[
              { label: 'Total Alerts',    value: alerts.length,                                 color: 'blue'  },
              { label: 'Critical',        value: alerts.filter(a => a.severity === 'danger').length,  color: 'red'   },
              { label: 'Warnings',        value: alerts.filter(a => a.severity === 'warning').length, color: 'amber' },
              { label: 'Informational',   value: alerts.filter(a => a.severity === 'info').length,    color: 'green' },
            ].map(({ label, value, color }) => (
              <div className={`stat-card ${color}`} key={label}>
                <div className="stat-card-title">{label}</div>
                <div className="stat-card-value" style={{ fontSize: 26 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div className="glass-card" style={{ marginBottom: 20, padding: '12px 14px' }}>
            <div className="flex items-center gap-12 flex-wrap">
              <div className="flex items-center gap-6" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                <Filter size={14} />
                <span>Filter by type:</span>
              </div>
              <div className="filter-tab-bar">
                {filterTypes.map(type => (
                  <button
                    key={type}
                    className={`filter-tab ${activeFilter === type ? 'active' : ''}`}
                    onClick={() => setActiveFilter(type)}
                  >
                    {filterLabels[type]}
                    {type !== 'All' && (
                      <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.7 }}>
                        ({alerts.filter(a => a.type === type).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {lastUpdated && (
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> Updated {lastUpdated.toLocaleTimeString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="grid-65-35" style={{ alignItems: 'start' }}>

            {/* Alert feed */}
            <div>
              {loading ? (
                <div className="glass-card">
                  <div className="loading-container">
                    <div className="loading-spinner" />
                    <span>Loading alerts...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="notification error">
                  <AlertCircle size={15} /> {error}
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="glass-card">
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <CheckCircle size={26} color="var(--green-600)" />
                    </div>
                    <div className="empty-state-title">No alerts found</div>
                    <div className="empty-state-desc">
                      {activeFilter === 'All'
                        ? 'All systems are operating normally.'
                        : `No ${filterLabels[activeFilter]} alerts at this time.`}
                    </div>
                  </div>
                </div>
              ) : (
                filteredAlerts.map((alert, i) => {
                  const { label, badge, Icon } = getAlertMeta(alert.type);
                  const sev = getSeverityMeta(alert.severity);
                  return (
                    <div key={alert._id || i} className={`alert-card ${getBorderClass(alert.type)}`}>
                      <div className="alert-header">
                        <div className="flex items-center gap-8 flex-wrap">
                          <span className={`badge ${badge}`}>
                            <Icon size={12} /> {label}
                          </span>
                          <span className={`badge ${sev.badge}`} style={{ fontSize: 11 }}>
                            {sev.label}
                          </span>
                        </div>
                        <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, paddingLeft: 8 }}>
                          <Clock size={11} />
                          {new Date(alert.timestamp).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="alert-title">Bus {alert.busId} — {label}</div>
                      <div className="alert-message">{alert.message}</div>

                      <div className="alert-meta">
                        <span>Bus: <strong>{alert.busId}</strong></span>
                        {alert.location?.latitude && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MapPin size={10} />
                            {alert.location.latitude.toFixed(4)}, {alert.location.longitude.toFixed(4)}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-8" style={{ marginTop: 12 }}>
                        <button className="btn btn-secondary btn-sm">
                          <MapPin size={12} /> View on Map
                        </button>
                        <button className="btn btn-success btn-sm">
                          <CheckCircle size={12} /> Mark Resolved
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Summary panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div className="glass-card">
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
                  Alert Breakdown
                </h3>
                {summaryTypes.map(({ type, label, color }) => {
                  const count = alerts.filter(a => a.type === type).length;
                  const pct   = alerts.length ? Math.round((count / alerts.length) * 100) : 0;
                  return (
                    <div key={type} style={{ marginBottom: 12 }}>
                      <div className="flex justify-between items-center mb-4">
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color }}>{count}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="glass-card">
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>System Health</h3>
                {[
                  { label: 'Backend API',     ok: true },
                  { label: 'GPS Tracking',    ok: true },
                  { label: 'Alert Engine',    ok: true },
                  { label: 'RFID Scanner',    ok: true },
                ].map(({ label, ok }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
                    <span className={`badge ${ok ? 'badge-active' : 'badge-error'}`} style={{ fontSize: 11 }}>
                      {ok ? 'Online' : 'Offline'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
