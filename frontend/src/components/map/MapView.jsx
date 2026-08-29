import React, { useState, useRef } from 'react';
import { RatingStars } from '../common/RatingStars';
import { VerificationBadge } from '../common/VerificationBadge';
import { CategoryIcon } from '../../utils/categoryIcons';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { MapPin, Home, Crosshair, Plus, Minus, X } from 'lucide-react';

export const MapView = ({
  locations = [],
  selectedProviderId = null,
  onSelectProvider,
  height = '420px',
  center = { latitude: 19.1136, longitude: 72.8697, city: 'Mumbai Metropolitan Region' },
  showServiceRadius = true,
  customerLocation = null,
  interactive = true,
  title = 'Interactive Provider Map'
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activePopup, setActivePopup] = useState(() => {
    if (selectedProviderId) {
      return locations.find(l => l.providerId === Number(selectedProviderId)) || null;
    }
    return null;
  });

  const mapRef = useRef(null);

  // Map geographic bounding box (Mumbai/Thane area approx: Lat 18.9 to 19.3, Lon 72.75 to 73.05)
  const minLat = 18.95;
  const maxLat = 19.30;
  const minLon = 72.75;
  const maxLon = 73.05;

  const latToPercent = (lat) => {
    const clamped = Math.max(minLat, Math.min(maxLat, lat));
    return ((maxLat - clamped) / (maxLat - minLat)) * 80 + 10;
  };

  const lonToPercent = (lon) => {
    const clamped = Math.max(minLon, Math.min(maxLon, lon));
    return ((clamped - minLon) / (maxLon - minLon)) * 80 + 10;
  };

  const handleMouseDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !interactive) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMarkerClick = (loc, e) => {
    e.stopPropagation();
    setActivePopup(loc);
    if (onSelectProvider) {
      onSelectProvider(loc.providerId);
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const selectedLocation = locations.find(l => l.providerId === Number(selectedProviderId)) || activePopup;

  return (
    <div
      className="map-container"
      style={{ height }}
      ref={mapRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Map Header Overlay */}
      <div className="map-header-overlay">
        <div className="location-title">
          <MapPin size={16} color="var(--primary-700)" />
          <span>{center.city || 'Service Area Map'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="mock-pill" style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: 'var(--primary-900)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={12} color="var(--primary-700)" />
            Mumbai / Thane Service Radius
          </span>
        </div>
      </div>

      {/* Floating Zoom & Pan Controls */}
      {interactive && (
        <div className="map-controls">
          <button type="button" className="map-control-btn" onClick={handleZoomIn} title="Zoom in">
            <Plus size={14} strokeWidth={2.5} />
          </button>
          <button type="button" className="map-control-btn" onClick={handleZoomOut} title="Zoom out">
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <button type="button" className="map-control-btn" onClick={handleReset} title="Recenter map">
            <Crosshair size={14} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Vector Map Canvas */}
      <div
        className="map-canvas-wrapper"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
          transition: isDragging ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* Background Grid & Simulated Geography */}
        <div className="mock-map-bg" />
        <div className="map-water-feature" />
        <div className="map-park-feature" />
        <div className="map-expressway-h" />
        <div className="map-expressway-v" />

        {/* Optional Customer Location Pin */}
        {customerLocation && (
          <div
            className="map-marker"
            style={{
              top: `${latToPercent(customerLocation.latitude || 19.1294)}%`,
              left: `${lonToPercent(customerLocation.longitude || 72.8752)}%`,
              zIndex: 35
            }}
            title="Your Location"
          >
            <div className="marker-pin customer-pin">
              <Home size={14} strokeWidth={2} color="#fff" />
            </div>
          </div>
        )}

        {/* Selected Provider Service Radius Circle */}
        {showServiceRadius && selectedLocation && (
          <div
            className="service-area-circle"
            style={{
              top: `${latToPercent(selectedLocation.latitude)}%`,
              left: `${lonToPercent(selectedLocation.longitude)}%`,
              width: `${(selectedLocation.serviceRadiusKm || 10) * 16}px`,
              height: `${(selectedLocation.serviceRadiusKm || 10) * 16}px`,
            }}
          />
        )}

        {/* Provider Markers */}
        {locations.map((loc) => {
          const isSelected = (selectedProviderId && loc.providerId === Number(selectedProviderId)) || (activePopup?.providerId === loc.providerId);
          const topPercent = latToPercent(loc.latitude);
          const leftPercent = lonToPercent(loc.longitude);

          return (
            <div
              key={loc.id || loc.providerId}
              className={`map-marker ${isSelected ? 'active' : ''}`}
              style={{
                top: `${topPercent}%`,
                left: `${leftPercent}%`,
              }}
              onClick={(e) => handleMarkerClick(loc, e)}
            >
              {loc.verified && <div className="marker-radar" />}
              <div className={`marker-pin ${loc.verified ? 'verified' : ''}`}>
                <CategoryIcon categoryName={loc.service} size={14} strokeWidth={2} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Provider Popup Card */}
      {activePopup && (
        <div className="map-popup-card">
          <button
            type="button"
            className="map-popup-close"
            onClick={() => setActivePopup(null)}
            aria-label="Close popup"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-3">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--primary-800)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CategoryIcon categoryName={activePopup.service} size={22} strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-bold text-sm text-truncate" style={{ margin: 0 }}>
                  {activePopup.name}
                </h5>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <VerificationBadge status={activePopup.verified ? 'VERIFIED' : 'PENDING'} />
                <span className="text-xs text-muted">• {activePopup.service}</span>
              </div>

              {activePopup.rating && (
                <div className="mb-2">
                  <RatingStars rating={activePopup.rating} showScore={true} size="sm" />
                </div>
              )}

              {activePopup.serviceArea && (
                <p className="text-xs text-muted mb-2 flex items-center gap-1">
                  <MapPin size={12} color="var(--neutral-400)" />
                  <span>Area: <strong>{activePopup.serviceArea}</strong></span>
                </p>
              )}

              <div className="flex items-center justify-between mt-3 pt-2" style={{ borderTop: '1px solid var(--neutral-200)' }}>
                <div>
                  <span className="text-xs text-muted block">Starts at</span>
                  <span className="font-bold text-sm" style={{ color: 'var(--primary-800)' }}>
                    {formatCurrency(activePopup.startingPrice || 299)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/providers/${activePopup.providerId}`}
                    className="btn btn-sm btn-primary"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
