import React, { useState } from 'react';
import {
  MapPin,
  Utensils,
  Clock,
  HeartHandshake,
  Navigation,
  Compass,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';
import ExpiryCountdown from './ExpiryCountdown';

export default function InteractiveMap({
  listings,
  currentUser,
  onSelectListing,
  onClaimListing,
}) {
  const [selectedListing, setSelectedListing] = useState(listings[0] || null);
  const [filterUrgentOnly, setFilterUrgentOnly] = useState(false);
  const [maxRadiusKm, setMaxRadiusKm] = useState(15);

  // Map district centers for visual rendering
  const districts = [
    { name: 'Central Food District', x: 50, y: 45, radius: 'Downtown & Hotels' },
    { name: 'West Commercial Strip', x: 28, y: 60, radius: 'Bakeries & Cafes' },
    { name: 'North Tech Campus', x: 70, y: 25, radius: 'Corporate Cafeterias' },
    { name: 'East Mission & Shelters', x: 75, y: 70, radius: 'NGO Food Hubs' },
    { name: 'South Produce Terminals', x: 35, y: 80, radius: 'Supermarket Logistics' },
  ];

  // Helper to map lat/lng into percentage coordinates on map canvas
  const getMapCoordinates = (listing, index) => {
    // Generate well-distributed, stable visual positions on the stylized map grid
    const seed = (index * 47) % 100;
    const baseCoords = [
      { x: 48, y: 42 },
      { x: 26, y: 55 },
      { x: 68, y: 28 },
      { x: 45, y: 38 },
      { x: 72, y: 65 },
      { x: 30, y: 68 },
      { x: 55, y: 52 },
      { x: 78, y: 32 },
      { x: 38, y: 22 },
      { x: 62, y: 78 },
    ];
    return baseCoords[index % baseCoords.length] || { x: 50 + (seed - 50) * 0.6, y: 50 + (seed - 50) * 0.6 };
  };

  const filteredListings = listings.filter((item) => {
    if (filterUrgentOnly && !item.isUrgent) return false;
    return true;
  });

  return (
    <div style={{ padding: '1rem 0' }}>
      <div className="container">
        {/* Map Header Toolbar */}
        <div
          className="glass-panel"
          style={{
            padding: '1rem 1.5rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Navigation size={20} color="#06b6d4" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Food Rescue Radar (Live Geolocation Map)
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Real-time active excess food locations &amp; dispatch routes across Metro City
              </p>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterUrgentOnly(!filterUrgentOnly)}
              className="btn btn-sm"
              style={{
                background: filterUrgentOnly ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: filterUrgentOnly ? '#f87171' : 'var(--text-muted)',
                border: filterUrgentOnly ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                fontWeight: 700,
              }}
            >
              <AlertTriangle size={14} />
              <span>{filterUrgentOnly ? 'Urgent Pins Only (Active)' : 'Filter Urgent (<3h)'}</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>Search Radius:</span>
              <select
                className="form-select"
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
                style={{ width: '110px', padding: '0.35rem 1.5rem 0.35rem 0.65rem', fontSize: '0.82rem' }}
              >
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={15}>15 km</option>
                <option value={25}>25 km (Citywide)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive Map Layout: Grid View with Map on Left, Selected Preview on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
            gap: '1.25rem',
            alignItems: 'start',
          }}
        >
          {/* Stylized Interactive Map Canvas */}
          <div
            className="glass-panel"
            style={{
              height: '560px',
              position: 'relative',
              overflow: 'hidden',
              background: '#0a101d',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '20px',
              userSelect: 'none',
            }}
          >
            {/* SVG Background Grid & City Vector Aesthetics */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* City River / Artery Line */}
              <path
                d="M -10 180 Q 250 240, 480 320 T 1100 480"
                fill="none"
                stroke="rgba(6, 182, 212, 0.4)"
                strokeWidth="24"
                strokeLinecap="round"
              />

              {/* Highway Arteries */}
              <line x1="0" y1="280" x2="1000" y2="280" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="6,6" />
              <line x1="500" y1="0" x2="500" y2="600" stroke="rgba(255,255,255,0.1)" strokeWidth="3" strokeDasharray="6,6" />
              <circle cx="50%" cy="45%" r="180" fill="none" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="2" strokeDasharray="4,8" />
            </svg>

            {/* Metro District Labels */}
            {districts.map((d, idx) => (
              <div
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.25)',
                    display: 'block',
                  }}
                >
                  {d.name}
                </span>
                <span style={{ fontSize: '0.62rem', color: 'rgba(255, 255, 255, 0.18)' }}>
                  {d.radius}
                </span>
              </div>
            ))}

            {/* Radar Sweep Effect */}
            <div
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                width: '360px',
                height: '360px',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                pointerEvents: 'none',
              }}
            />

            {/* Food Surplus Pins on Map */}
            {filteredListings.map((item, idx) => {
              const coords = getMapCoordinates(item, idx);
              const isSelected = selectedListing?._id === item._id;
              const isUrgent = item.isUrgent && item.status === 'available';
              const isReserved = item.status === 'reserved';
              const isDelivered = item.status === 'delivered';

              let pinColor = '#10b981';
              if (isUrgent) pinColor = '#ef4444';
              else if (isReserved) pinColor = '#f59e0b';
              else if (isDelivered) pinColor = '#3b82f6';

              return (
                <div
                  key={item._id}
                  onClick={() => setSelectedListing(item)}
                  style={{
                    position: 'absolute',
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -100%)',
                    cursor: 'pointer',
                    zIndex: isSelected ? 30 : 10,
                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {/* Outer pulse wave if urgent */}
                  {isUrgent && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.4)',
                        transform: 'translate(-50%, -50%)',
                        animation: 'pulseSlow 1.5s infinite',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Marker Pin Box */}
                  <div
                    style={{
                      background: isSelected ? '#ffffff' : pinColor,
                      color: isSelected ? '#0f172a' : '#ffffff',
                      padding: '0.35rem 0.65rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: `0 4px 16px ${pinColor}88`,
                      transform: isSelected ? 'scale(1.15) translateY(-6px)' : 'scale(1)',
                      border: '2px solid rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <Utensils size={13} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                      ~{item.estimatedServings}
                    </span>
                  </div>

                  {/* Pin Pointer Tip */}
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: `6px solid ${isSelected ? '#ffffff' : pinColor}`,
                      margin: '0 auto',
                    }}
                  />
                </div>
              );
            })}

            {/* Map Legend */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '0.6rem 0.85rem',
                display: 'flex',
                gap: '0.85rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#cbd5e1',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                <span>Urgent (&lt;3h)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                <span>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                <span>Claimed (OTP Active)</span>
              </div>
            </div>
          </div>

          {/* Selected Pin Focus Card (Right Panel) */}
          {selectedListing ? (
            <div
              className="glass-panel"
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border-card)',
                borderRadius: '20px',
                background: 'rgba(17, 24, 39, 0.92)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span className="badge badge-emerald">{selectedListing.category}</span>
                <ExpiryCountdown expiresAt={selectedListing.expiresAt} />
              </div>

              <img
                src={selectedListing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
                alt={selectedListing.title}
                style={{ width: '100%', height: '160px', borderRadius: '12px', objectFit: 'cover', marginBottom: '1rem' }}
              />

              <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                {selectedListing.title}
              </h3>

              <div style={{ fontSize: '0.84rem', color: '#34d399', fontWeight: 700, marginBottom: '0.75rem' }}>
                Feeds ~{selectedListing.estimatedServings} People • {selectedListing.quantity} {selectedListing.quantityUnit}
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem', color: '#ffffff', fontWeight: 600 }}>
                  <MapPin size={14} color="#10b981" /> {selectedListing.donorName}
                </div>
                <div>{selectedListing.pickupAddress?.street}</div>
                <div style={{ fontSize: '0.78rem', color: '#06b6d4', marginTop: '0.2rem' }}>
                  Distance: ~1.8 km from City Hope Shelter
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                <button
                  onClick={() => onSelectListing(selectedListing)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Full Specs
                </button>

                {selectedListing.status === 'available' ? (
                  <button
                    onClick={() => onClaimListing(selectedListing)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1.5, fontWeight: 700 }}
                  >
                    <HeartHandshake size={15} />
                    <span>Claim Surplus</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectListing(selectedListing)}
                    className="btn btn-amber btn-sm"
                    style={{ flex: 1.5 }}
                  >
                    <span>Inspect Status</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              className="glass-panel"
              style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}
            >
              Click any pin on the radar map to view surplus food details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
