import React from 'react';
import {
  Heart,
  Utensils,
  Clock,
  KeyRound,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import ExpiryCountdown from './ExpiryCountdown';

export default function MyMissionsTab({
  currentUser,
  listings,
  claims,
  onVerifyOtp,
  onCompleteDelivery,
  onViewDetails,
}) {
  const isNgo = currentUser?.role === 'ngo';
  const isDonor = currentUser?.role === 'donor';

  // Filter relevant listings
  let relevantListings = [];
  if (isNgo) {
    relevantListings = listings.filter((l) => String(l.claimedBy) === String(currentUser._id));
  } else if (isDonor) {
    relevantListings = listings.filter((l) => String(l.donor) === String(currentUser._id));
  } else {
    // Volunteer or admin sees all active claims & deliveries
    relevantListings = listings.filter((l) => l.status === 'reserved' || l.status === 'picked_up' || l.status === 'delivered');
  }

  // Active vs Completed
  const activeMissions = relevantListings.filter((l) => l.status === 'reserved' || l.status === 'picked_up');
  const completedMissions = relevantListings.filter((l) => l.status === 'delivered');

  return (
    <div style={{ padding: '1.5rem 0 3rem' }}>
      <div className="container">
        {/* Header Banner */}
        <div
          className="glass-panel"
          style={{
            padding: '1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              <Sparkles size={15} /> RESCUE OPERATIONS DASHBOARD
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
              {isNgo
                ? 'Active NGO Food Pickups & Deliveries'
                : isDonor
                ? 'Your Surplus Listings & Handover Status'
                : 'All Active Food Rescue Missions'}
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Track reservation milestones, show/verify handoff OTPs, and record beneficiaries served.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.65rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                {activeMissions.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#e2e8f0', textTransform: 'uppercase', fontWeight: 700 }}>
                In Progress
              </div>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.65rem 1.25rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                {completedMissions.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#e2e8f0', textTransform: 'uppercase', fontWeight: 700 }}>
                Completed
              </div>
            </div>
          </div>
        </div>

        {/* Active Missions Section */}
        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} color="#f59e0b" />
          <span>Active In-Flight Rescue Missions ({activeMissions.length})</span>
        </h3>

        {activeMissions.length === 0 ? (
          <div
            className="glass-panel"
            style={{ padding: '3rem 2rem', textAlign: 'center', marginBottom: '2.5rem' }}
          >
            <Utensils size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              No active rescue missions in flight right now
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '460px', margin: '0 auto' }}>
              {isNgo
                ? 'Browse the Food Marketplace to claim surplus meals from local banquets, restaurants, and supermarkets.'
                : 'Post a new excess food batch to notify nearby NGOs!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {activeMissions.map((mission) => {
              const isReserved = mission.status === 'reserved';
              const isPickedUp = mission.status === 'picked_up';

              return (
                <div
                  key={mission._id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    background: 'rgba(17, 24, 39, 0.92)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge badge-amber">
                      {isReserved ? 'Step 1: Reserved & Awaiting Pickup' : 'Step 2: In Transit to Shelter'}
                    </span>
                    <ExpiryCountdown expiresAt={mission.expiresAt} compact={true} />
                  </div>

                  {/* Title & Stats */}
                  <h4 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                    {mission.title}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700, marginBottom: '1rem' }}>
                    Feeds ~{mission.estimatedServings} People • {mission.quantity} {mission.quantityUnit} ({mission.category})
                  </div>

                  {/* Progress Milestone Bar */}
                  <div style={{ marginBottom: '1.25rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.5rem' }}>
                      <span style={{ color: '#10b981' }}>✓ 1. Reserved</span>
                      <span style={{ color: isPickedUp ? '#10b981' : '#fbbf24' }}>
                        {isPickedUp ? '✓ 2. Picked Up' : '● 2. Handover OTP'}
                      </span>
                      <span style={{ color: 'var(--text-dim)' }}>3. Delivered</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: isPickedUp ? '66%' : '33%',
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981, #f59e0b)',
                          borderRadius: '999px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Secret OTP Display Card for NGO or Handover prompt for Donor */}
                  {isReserved && (
                    <div
                      style={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        border: '2px dashed #f59e0b',
                        borderRadius: '12px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '0.75rem', color: '#fbbf24', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                        {isNgo ? 'Show this OTP to Donor at Handover:' : 'Waiting for NGO with Code:'}
                      </div>
                      <div
                        style={{
                          fontSize: '2rem',
                          fontWeight: 900,
                          letterSpacing: '6px',
                          fontFamily: 'var(--font-mono)',
                          color: '#ffffff',
                          margin: '0.25rem 0',
                        }}
                      >
                        {mission.claimOtp || '----'}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {isNgo
                          ? 'Donor will type this into their terminal to verify pickup.'
                          : `Claimed by: ${mission.claimedByName || 'Verified NGO'}`}
                      </div>
                    </div>
                  )}

                  {/* Donor & Address Box */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ffffff', fontWeight: 600, marginBottom: '0.25rem' }}>
                      <MapPin size={14} color="#10b981" />
                      <span>{mission.pickupAddress?.street}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)' }}>
                      <Phone size={13} /> Contact: {mission.contactPerson} ({mission.contactPhone})
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => onViewDetails(mission)}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1 }}
                    >
                      Inspect
                    </button>

                    {isReserved && (
                      <button
                        onClick={() => onVerifyOtp(mission)}
                        className="btn btn-amber btn-sm"
                        style={{ flex: 1.5, fontWeight: 700 }}
                      >
                        <KeyRound size={15} />
                        <span>Verify OTP</span>
                      </button>
                    )}

                    {isPickedUp && (
                      <button
                        onClick={() => onCompleteDelivery(mission)}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1.5, fontWeight: 700, background: '#06b6d4' }}
                      >
                        <CheckCircle size={15} />
                        <span>Mark Delivered</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed Deliveries Audit Log */}
        {completedMissions.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={20} color="#10b981" />
              <span>Completed Rescues &amp; Beneficiaries Fed ({completedMissions.length})</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {completedMissions.map((c) => (
                <div
                  key={c._id}
                  className="glass-panel"
                  style={{
                    padding: '1.25rem',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <img
                    src={c.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
                    alt={c.title}
                    style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                      {c.title}
                    </h5>
                    <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>
                      ✓ {c.beneficiariesServed || c.estimatedServings} Shelter Residents Fed
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      Donor: {c.donorName} • Rescued by {c.claimedByName || 'NGO'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
