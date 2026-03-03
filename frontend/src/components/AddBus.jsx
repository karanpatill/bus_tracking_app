import React, { useState } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from '@react-google-maps/api';
import Sidebar from './Sidebar';
import { adminLogout } from '../api';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, RotateCcw, Bus, MapPin, User, Route } from 'lucide-react';

const containerStyle = { width: '100%', height: '420px', borderRadius: '10px' };
const center = { lat: 16.7049873, lng: 74.2432527 };

const GOOGLE_MAPS_API_KEY = 'AIzaSyDfgM0PCpUAXFIGkOt4CmlcizPpyCcdoZA';

const AddBus = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    busId: '',
    name: '',
    route: '',
    driverName: '',
    status: 'active',
    cameraUrl: '',
    stops: [],
  });
  const [routePath, setRoutePath] = useState([]);
  const [stopName, setStopName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMapClick = (e) => {
    if (!stopName.trim()) {
      setError('⚠️ Please enter a stop name before clicking on the map.');
      return;
    }
    setError('');
    const newStop = {
      name: stopName.trim(),
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    };
    const updatedStops = [...formData.stops, newStop];
    setFormData({ ...formData, stops: updatedStops });
    setRoutePath([...routePath, { lat: newStop.latitude, lng: newStop.longitude }]);
    setStopName('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const deleteStop = (index) => {
    const updatedStops = formData.stops.filter((_, i) => i !== index);
    const updatedPath = routePath.filter((_, i) => i !== index);
    setFormData({ ...formData, stops: updatedStops });
    setRoutePath(updatedPath);
  };

  const editStopName = (index, newName) => {
    const updatedStops = [...formData.stops];
    updatedStops[index].name = newName;
    setFormData({ ...formData, stops: updatedStops });
  };

  const generateBusId = () => {
    const id = 'BUS-' + Math.floor(100 + Math.random() * 900);
    setFormData({ ...formData, busId: id });
  };

  const resetForm = () => {
    setFormData({ busId: '', name: '', route: '', driverName: '', status: 'active', cameraUrl: '', stops: [] });
    setRoutePath([]);
    setStopName('');
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.busId.trim()) { setError('Bus ID is required.'); return; }
    if (!formData.name.trim()) { setError('Bus name is required.'); return; }
    if (!formData.stops.length) { setError('Please add at least one stop on the map.'); return; }

    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post('http://localhost:5000/addbus', formData, { withCredentials: true });
      setMessage('✅ Bus and route saved successfully!');
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save bus. Try again.';
      setError('❌ ' + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try { await adminLogout(); navigate('/login'); window.location.reload(); } catch {}
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />

      <div className="main-content">
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-greeting">🚌 Register New Bus</div>
            <div className="topbar-subtitle">Add bus details, driver info, and configure route stops on the map</div>
          </div>
          <div className="topbar-right">
            <button className="btn btn-secondary btn-sm" onClick={resetForm}>
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        <div className="page-container animate-fade-in-up">
          {/* Breadcrumb */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', color: 'var(--blue-300)' }} onClick={() => navigate('/')}>Dashboard</span>
            <span>›</span>
            <span>Fleet Management</span>
            <span>›</span>
            <span>Add Bus</span>
          </div>

          {/* Messages */}
          {message && <div className="notification success" style={{ marginBottom: '16px' }}>{message}</div>}
          {error && <div className="notification error" style={{ marginBottom: '16px' }}><AlertCircle size={14} /> {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid-55-45">
              {/* Left - Form */}
              <div>
                {/* Bus Info */}
                <div className="glass-card" style={{ marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bus size={16} style={{ color: 'var(--blue-400)' }} />
                    Bus Information
                  </h2>
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Bus ID *</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          name="busId"
                          type="text"
                          className="form-input"
                          placeholder="e.g. BUS-01"
                          value={formData.busId}
                          onChange={handleInputChange}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={generateBusId}
                          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                        >
                          Auto
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bus Name *</label>
                      <input name="name" type="text" className="form-input" placeholder="e.g. Kolhapur Express" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Driver Name</label>
                      <input name="driverName" type="text" className="form-input" placeholder="e.g. Rajesh Kumar" value={formData.driverName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select name="status" className="form-select" value={formData.status} onChange={handleInputChange}>
                        <option value="active">🟢 Active</option>
                        <option value="inactive">🔴 Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Route Description</label>
                    <input name="route" type="text" className="form-input" placeholder="e.g. D.Y. Patil Campus → Kolhapur Station" value={formData.route} onChange={handleInputChange} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Camera Stream URL</label>
                    <input name="cameraUrl" type="url" className="form-input" placeholder="rtsp:// or http:// stream URL..." value={formData.cameraUrl} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Stops Config */}
                <div className="glass-card">
                  <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} style={{ color: 'var(--blue-400)' }} />
                    Route Stops
                    <span className="badge badge-info" style={{ marginLeft: '4px', fontSize: '11px' }}>
                      {formData.stops.length} added
                    </span>
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                    Enter stop name below, then click on the map to place it.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter stop name..."
                      value={stopName}
                      onChange={e => setStopName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-blue"
                      disabled={!stopName.trim()}
                      onClick={() => setError(stopName.trim() ? '📍 Now click on the map to place this stop.' : 'Enter a stop name first.')}
                    >
                      📍 Ready
                    </button>
                  </div>

                  {formData.stops.length > 0 && (
                    <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                      {formData.stops.map((stop, i) => (
                        <div key={i} style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px',
                          background: 'rgba(59, 130, 246, 0.05)',
                          border: '1px solid rgba(59, 130, 246, 0.15)',
                          borderRadius: '8px', marginBottom: '8px',
                        }}>
                          <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: 'var(--blue-500)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 700, flexShrink: 0,
                          }}>{i + 1}</span>
                          <input
                            className="form-input"
                            value={stop.name}
                            onChange={e => editStopName(i, e.target.value)}
                            style={{ flex: 1, padding: '5px 8px', fontSize: '13px' }}
                          />
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteStop(i)}
                            style={{ padding: '4px 8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', color: '#f87171', fontSize: '11px', cursor: 'pointer', flexShrink: 0 }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right - Map */}
              <div>
                <div className="glass-card" style={{ marginBottom: '16px', padding: '14px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Route size={16} style={{ color: 'var(--blue-400)' }} />
                    Route Map — Click to Add Stops
                  </h2>
                  <div className="map-container-wrapper">
                    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={13}
                        onClick={handleMapClick}
                        options={{
                          disableDefaultUI: false,
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: true,
                          styles: [
                            { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
                            { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
                            { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1627' }] },
                            { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
                          ],
                        }}
                      >
                        {routePath.length > 1 && (
                          <Polyline
                            path={routePath}
                            options={{ strokeColor: '#3b82f6', strokeOpacity: 1.0, strokeWeight: 4, geodesic: true }}
                          />
                        )}
                        {formData.stops.map((stop, index) => (
                          <Marker
                            key={index}
                            position={{ lat: stop.latitude, lng: stop.longitude }}
                            label={{ text: `${index + 1}`, color: 'white', fontWeight: 'bold', fontSize: '12px' }}
                            title={stop.name}
                          />
                        ))}
                      </GoogleMap>
                    </LoadScript>
                  </div>
                </div>

                {/* Submit */}
                <div className="glass-card" style={{ padding: '16px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-full"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {loading ? (
                      <>
                        <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}></span>
                        Saving...
                      </>
                    ) : (
                      '💾 Save Bus & Route'
                    )}
                  </button>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
                    Bus data will be saved to the DY Patil fleet monitoring system.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBus;
