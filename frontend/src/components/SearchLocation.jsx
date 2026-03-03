import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
  Circle,
} from '@react-google-maps/api';
import Sidebar from './Sidebar';
import { adminLogout } from '../api';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ArrowLeft, MapPin, Bus, User, Route, AlertCircle, ChevronDown, Clock } from 'lucide-react';

const containerStyle = { width: '100%', height: '460px' };
const defaultCenter = { lat: 16.7049873, lng: 74.2432527 };
const colors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444'];
const GOOGLE_MAPS_API_KEY = 'AIzaSyDfgM0PCpUAXFIGkOt4CmlcizPpyCcdoZA';

const mapStyles = [
  { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d3748' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#374151' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1627' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#1a2332' }] },
  { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f1e' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const mapOptions = {
  styles: mapStyles,
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

const getLocationName = async (lat, lng, google) => {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        resolve('Location unavailable');
      }
    });
  });
};

const SearchLocation = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [googleInstance, setGoogleInstance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLocationName, setCurrentLocationName] = useState('');
  const routeCache = useRef({});
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/buslocation', { withCredentials: true });
      setBuses(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      setError('Failed to load bus data. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const selectedBus = buses.find(b => b.busId === selectedBusId);

  useEffect(() => {
    if (selectedBus && googleInstance && selectedBus.latest) {
      getLocationName(selectedBus.latest.latitude, selectedBus.latest.longitude, googleInstance)
        .then(setCurrentLocationName);
    }
  }, [selectedBus, googleInstance]);

  const renderMap = (bus, index, fullScreen = false) => {
    const path = routeCache.current[bus.busId] ||
      (bus.path?.length > 1 ? bus.path.map(p => ({ lat: p.latitude, lng: p.longitude })) : []);
    if (!routeCache.current[bus.busId] && path.length > 1) {
      routeCache.current[bus.busId] = path;
    }
    const color = colors[index % colors.length];
    return (
      <GoogleMap
        mapContainerStyle={fullScreen ? containerStyle : { ...containerStyle, height: '300px' }}
        center={bus.latest ? { lat: bus.latest.latitude, lng: bus.latest.longitude } : defaultCenter}
        zoom={14}
        options={mapOptions}
      >
        {path.length > 1 && googleInstance && (
          <Polyline
            path={path}
            options={{
              strokeColor: color,
              strokeOpacity: 0.9,
              strokeWeight: 4,
              geodesic: true,
            }}
          />
        )}
        {bus.stops?.map((stop, i) => (
          <React.Fragment key={`stop-${bus.busId}-${i}`}>
            <Marker
              position={{ lat: stop.latitude, lng: stop.longitude }}
              label={{ text: `${i + 1}`, color: 'white', fontSize: '12px', fontWeight: 'bold' }}
              title={stop.name}
            />
            {googleInstance && (
              <Circle
                center={{ lat: stop.latitude, lng: stop.longitude }}
                radius={50}
                options={{
                  strokeColor: '#34a853',
                  strokeOpacity: 0.6,
                  strokeWeight: 1,
                  fillColor: '#34a853',
                  fillOpacity: 0.15,
                }}
              />
            )}
          </React.Fragment>
        ))}
        {bus.latest && googleInstance && (
          <Marker
            position={{ lat: bus.latest.latitude, lng: bus.latest.longitude }}
            icon={{
              url: 'https://maps.gstatic.com/mapfiles/ms2/micons/bus.png',
              scaledSize: new googleInstance.maps.Size(40, 40),
            }}
            label={{ text: bus.name || bus.busId, color: 'white', fontWeight: 'bold', fontSize: '11px' }}
            animation={googleInstance.maps.Animation.DROP}
          />
        )}
      </GoogleMap>
    );
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
            <div className="topbar-greeting">🗺️ Live Bus Tracking</div>
            <div className="topbar-subtitle">Real-time GPS monitoring of all university buses • Auto-refreshes every 5s</div>
          </div>
          <div className="topbar-right">
            {selectedBusId && (
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedBusId(null)}>
                <ArrowLeft size={14} /> All Buses
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={fetchData}>
              <RefreshCw size={14} /> Refresh
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--green-400)' }}>
              <span className="pulse-dot"></span>
              {buses.length} buses live
            </div>
          </div>
        </div>

        <div className="page-container animate-fade-in-up">
          {error && (
            <div className="notification error" style={{ marginBottom: '16px' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {loading ? (
            <div className="glass-card">
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>Loading fleet data...</span>
              </div>
            </div>
          ) : buses.length === 0 ? (
            <div className="glass-card">
              <div className="empty-state">
                <div className="empty-state-icon">🚌</div>
                <div className="empty-state-title">No buses found</div>
                <div className="empty-state-desc">No bus location data available. Start tracking by registering buses.</div>
                <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/addbus')}>
                  + Register a Bus
                </button>
              </div>
            </div>
          ) : (
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} onLoad={() => setGoogleInstance(window.google)}>
              {selectedBusId && selectedBus ? (
                /* Single Bus Full View */
                <div className="grid-65-35" style={{ alignItems: 'start' }}>
                  <div className="glass-card" style={{ padding: '14px' }}>
                    <div className="flex justify-between items-center mb-12">
                      <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        🚌 Viewing: <span style={{ color: 'var(--blue-300)' }}>{selectedBus.busId}</span>
                      </h2>
                      <span className={`badge ${selectedBus.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {selectedBus.status === 'active' ? <><span className="pulse-dot" style={{ width: 6, height: 6 }}></span> Active</> : 'Inactive'}
                      </span>
                    </div>
                    <div className="map-container-wrapper">
                      {renderMap(selectedBus, 0, true)}
                    </div>
                  </div>

                  <div>
                    <div className="glass-card" style={{ marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px' }}>
                        📋 Bus Details
                      </h3>
                      {[
                        { label: 'Bus ID', value: selectedBus.busId, icon: <Bus size={13} /> },
                        { label: 'Bus Name', value: selectedBus.name, icon: <Bus size={13} /> },
                        { label: 'Driver', value: selectedBus.driverName || 'N/A', icon: <User size={13} /> },
                        { label: 'Route', value: selectedBus.route || 'N/A', icon: <Route size={13} /> },
                        { label: 'Total Stops', value: selectedBus.stops?.length || 0, icon: <MapPin size={13} /> },
                      ].map(({ label, value, icon }) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(59, 130, 246, 0.08)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            <span style={{ color: 'var(--blue-400)' }}>{icon}</span>
                            {label}
                          </div>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
                        </div>
                      ))}
                      {selectedBus.latest && (
                        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(59, 130, 246, 0.07)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>📍 Current Location</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {currentLocationName || `${selectedBus.latest.latitude.toFixed(5)}, ${selectedBus.latest.longitude.toFixed(5)}`}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedBus.stops?.length > 0 && (
                      <div className="glass-card">
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
                          🛑 Route Stops
                        </h3>
                        {selectedBus.stops.map((stop, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--blue-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{stop.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* All Buses Grid */
                <div>
                  {buses.sort((a, b) => a.busId.localeCompare(b.busId)).map((bus, index) => (
                    <div key={bus.busId} className="glass-card" style={{ marginBottom: '20px', padding: '0', overflow: 'hidden' }}>
                      {/* Bus Card Header */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 20px',
                        borderBottom: '1px solid rgba(59, 130, 246, 0.12)',
                        borderLeft: `4px solid ${colors[index % colors.length]}`,
                        background: 'rgba(0,0,0,0.2)',
                      }}>
                        <div className="flex items-center gap-12">
                          <div style={{ fontSize: '16px', fontWeight: 800, color: colors[index % colors.length] }}>
                            {bus.busId}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{bus.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              <User size={10} style={{ display: 'inline' }} /> {bus.driverName || 'N/A'} &nbsp;•&nbsp;
                              <MapPin size={10} style={{ display: 'inline' }} /> {bus.stops?.length || 0} stops
                            </div>
                          </div>
                          <span className={`badge ${bus.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                            {bus.status === 'active' ? <><span className="pulse-dot" style={{ width: 6, height: 6 }}></span> Active</> : 'Inactive'}
                          </span>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedBusId(bus.busId)}
                        >
                          View Live →
                        </button>
                      </div>

                      {/* Map */}
                      <div>
                        {renderMap(bus, index)}
                      </div>

                      {/* Bus Info Footer */}
                      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(59, 130, 246, 0.08)', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          <Route size={11} style={{ display: 'inline' }} /> {bus.route || 'No route set'}
                        </span>
                        {bus.latest && (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            <Clock size={11} style={{ display: 'inline', marginRight: '3px' }} />
                            {bus.latest.latitude?.toFixed(4)}, {bus.latest.longitude?.toFixed(4)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </LoadScript>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchLocation;
