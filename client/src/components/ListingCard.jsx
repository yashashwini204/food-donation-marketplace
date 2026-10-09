import React from 'react';
import {
  MapPin,
  Utensils,
  Clock,
  CheckCircle,
  Truck,
  HeartHandshake,
  KeyRound,
  Thermometer,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import ExpiryCountdown from './ExpiryCountdown';

export default function ListingCard({
  listing,
  currentUser,
  onViewDetails,
  onClaim,
  onVerifyOtp,
  onCompleteDelivery,
}) {
  const isAvailable = listing.status === 'available';
  const isReserved = listing.status === 'reserved';
  const isPickedUp = listing.status === 'picked_up';
  const isDelivered = listing.status === 'delivered';

  const isUserDonor = currentUser && String(listing.donor) === String(currentUser._id);
  const isUserClaimer = currentUser && String(listing.claimedBy) === String(currentUser._id);
  const isNgo = currentUser?.role === 'ngo' || currentUser?.role === 'admin';

  // Storage temp icon/color
  const getStorageBadge = (cond) => {
    if (!cond) return null;
    if (cond.includes('Hot')) {
      return (
        <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
          🔥 Keep Hot &gt; 60°C
        </span>
      );
    }
    if (cond.includes('Cold') || cond.includes('Refrigerated')) {
      return (
        <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
          ❄️ Chilled &lt; 4°C
        </span>
      );
    }
    return (
      <span className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>
        📦 Room Temp
      </span>
    );
  };

  const imageUrl =
    listing.images && listing.images[0]
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  return (
    <div
      className="glass-panel glass-panel-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        border: isAvailable && listing.isUrgent ? '1px solid rgba(239, 68, 68, 0.45)' : undefined,
        boxShadow: isAvailable && listing.isUrgent ? '0 0 20px rgba(239, 68, 68, 0.2)' : undefined,
      }}
    >
      {/* Image Container with Badges */}
      <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={listing.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 15, 25, 0.9) 0%, rgba(11, 15, 25, 0.2) 60%, transparent 100%)',
          }}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', right: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span className="badge badge-neutral" style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', color: '#ffffff' }}>
            {listing.category}
          </span>

          {/* Expiry Timer or Status Badge */}
          {isAvailable ? (
            <ExpiryCountdown expiresAt={listing.expiresAt} />
          ) : isReserved ? (
            <span className="badge badge-amber" style={{ background: 'rgba(245, 158, 11, 0.9)', color: '#111827' }}>
              <Clock size={12} /> Claimed / Awaiting Pickup
            </span>
          ) : isPickedUp ? (
            <span className="badge badge-blue" style={{ background: 'rgba(59, 130, 246, 0.9)', color: '#ffffff' }}>
              <Truck size={12} /> In Transit to Shelter
            </span>
          ) : (
            <span className="badge badge-emerald" style={{ background: 'rgba(16, 185, 129, 0.9)', color: '#ffffff' }}>
              <CheckCircle size={12} /> Rescued &amp; Delivered
            </span>
          )}
        </div>

        {/* Bottom Banner on Image: Servings & Quantity */}
        <div style={{ position: 'absolute', bottom: '0.65rem', left: '0.75rem', right: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16, 185, 129, 0.9)', color: '#ffffff', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800 }}>
            <Utensils size={13} />
            <span>Feeds ~{listing.estimatedServings} People</span>
          </div>

          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f1f5f9', background: 'rgba(15, 23, 42, 0.8)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
            {listing.quantity} {listing.quantityUnit}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.12rem', marginBottom: '0.5rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.35 }}>
          {listing.title}
        </h3>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.85rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
          {listing.description || 'Hygienically packaged surplus food ready for immediate NGO collection.'}
        </p>

        {/* Dietary and Storage Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
            🌱 {listing.dietaryType}
          </span>
          {getStorageBadge(listing.storageCondition)}
        </div>

        {/* Donor & Location Details */}
        <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{listing.donorName}</span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>✓ Verified Donor</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-dim)' }}>
            <MapPin size={13} style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {listing.pickupAddress?.street || 'Central Square'}
            </span>
          </div>
        </div>

        {/* Claimed by info box if reserved */}
        {isReserved && (
          <div style={{ marginTop: '0.75rem', padding: '0.65rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: '8px', fontSize: '0.8rem', color: '#fbbf24' }}>
            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <HeartHandshake size={14} /> Reserved by {listing.claimedByName || 'Shelter NGO'}
            </div>
            {listing.claimOtp && (isUserClaimer || isUserDonor) && (
              <div style={{ marginTop: '0.3rem', fontSize: '0.82rem', color: '#f8fafc' }}>
                Pickup OTP: <strong style={{ color: '#fbbf24', letterSpacing: '2px', fontFamily: 'var(--font-mono)' }}>{listing.claimOtp}</strong>
              </div>
            )}
          </div>
        )}

        {/* Action Button Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          <button
            onClick={() => onViewDetails(listing)}
            className="btn btn-secondary btn-sm"
            style={{ flex: 1, padding: '0.55rem 0.75rem' }}
          >
            Details
          </button>

          {isAvailable && (
            <button
              onClick={() => onClaim(listing)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.5, padding: '0.55rem 0.75rem', fontWeight: 700 }}
              title={isNgo ? 'Claim this surplus for your NGO' : 'Switch to NGO role to claim'}
            >
              <HeartHandshake size={15} />
              <span>Claim Food</span>
            </button>
          )}

          {isReserved && (
            <>
              {/* If donor or volunteer, verify OTP */}
              <button
                onClick={() => onVerifyOtp(listing)}
                className="btn btn-amber btn-sm"
                style={{ flex: 1.5, padding: '0.55rem 0.75rem' }}
                title="Verify the NGO's 4-digit pickup code"
              >
                <KeyRound size={14} />
                <span>Verify OTP</span>
              </button>
            </>
          )}

          {isPickedUp && (
            <button
              onClick={() => onCompleteDelivery(listing)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1.5, padding: '0.55rem 0.75rem', background: '#06b6d4' }}
            >
              <CheckCircle size={14} />
              <span>Mark Delivered</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
