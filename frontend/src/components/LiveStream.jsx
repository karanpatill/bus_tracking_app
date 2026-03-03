import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { adminLogout } from '../api';
import { useNavigate } from 'react-router-dom';
import { Video, Camera, AlertCircle, RefreshCw, ExternalLink, PlusCircle } from 'lucide-react';

const LiveStream = () => {
  const [buses, setBuses]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const res = await axios.get('http://localhost:5000/allbusstreams', { withCredentials: true });
        setBuses(Array.isArray(res.data) ? res.data : []);
        setError(null);
      } catch (_err) {
        setError('Unable to load camera streams. Please verify the server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchStreams();
  }, []);

  const handleLogout = async () => {
    try { await adminLogout(); navigate('/login'); window.location.reload(); }
    catch (_e) { /* noop */ }
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">Live Camera Feeds</div>
            <div className="topbar-subtitle">Real-time video monitoring from onboard bus cameras</div>
          </div>
          <div className="topbar-right">
            <button className="btn btn-secondary btn-sm" onClick={() => window.location.reload()}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        <div className="page-container animate-fade-in-up">

          {loading ? (
            <div className="glass-card">
              <div className="loading-container">
                <div className="loading-spinner" />
                <span>Loading camera feeds…</span>
              </div>
            </div>
          ) : error ? (
            <div className="notification error" style={{ marginBottom: 16 }}>
              <AlertCircle size={14} /> {error}
            </div>
          ) : buses.length === 0 ? (
            <div className="glass-card">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Camera size={26} />
                </div>
                <div className="empty-state-title">No camera streams configured</div>
                <div className="empty-state-desc">
                  Add a stream URL when registering a bus to enable live monitoring here.
                </div>
                <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/addbus')}>
                  <PlusCircle size={14} /> Add Bus with Camera
                </button>
              </div>
            </div>
          ) : (
            <div className="grid-3">
              {buses.map((bus) => (
                <div
                  key={bus.busId}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {/* Camera viewport */}
                  <div style={{ background: '#0f172a', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {bus.streamUrl ? (
                      <iframe
                        src={bus.streamUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title={`Camera feed — ${bus.busId}`}
                        allowFullScreen
                      />
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <Camera size={32} color="#475569" style={{ marginBottom: 8 }} />
                        <p style={{ fontSize: 12, color: '#475569' }}>No stream URL configured</p>
                      </div>
                    )}

                    {/* Live indicator */}
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      background: 'rgba(220,38,38,0.9)',
                      color: '#fff', fontSize: 10, fontWeight: 700,
                      padding: '3px 8px', borderRadius: 4,
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
                      LIVE
                    </div>
                  </div>

                  {/* Bus info */}
                  <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{bus.busId}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{bus.name || 'Bus Camera'}</div>
                    </div>
                    {bus.streamUrl && (
                      <a href={bus.streamUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                        <ExternalLink size={12} /> Open
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Integration guide */}
          <div className="glass-card" style={{ marginTop: 24 }}>
            <div className="flex items-center gap-12">
              <div className="stat-card-icon blue" style={{ width: 38, height: 38, flexShrink: 0 }}>
                <Video size={16} />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                  Camera Integration
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  To enable live streaming, add an RTSP or HTTP stream URL during bus registration.
                  Compatible with IP cameras, DVRs, and OBS streaming software.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
