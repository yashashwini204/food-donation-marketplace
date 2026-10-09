import React from 'react';
import {
  X,
  MapPin,
  Utensils,
  Clock,
  Phone,
  User,
  ShieldCheck,
  AlertTriangle,
  HeartHandshake,
  KeyRound,
  CheckCircle,
  Truck,
  Sparkles,
} from 'lucide-react';
import ExpiryCountdown from './ExpiryCountdown';

export default function ListingDetailsModal({
  listing,
  currentUser,
  onClose,
  onClaim,
  onVerifyOtp,
  onCompleteDelivery,
}) {
  if (!listing) return null;

  const isAvailable = listing.status === 'available';
  const isReserved = listing.status === 'reserved';
  const isPickedUp = listing.status === 'picked_up';
  const isDelivered = listing.status === 'delivered';

  const imageUrl =
    listing.images && listing.images[0]
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="badge badge-emerald">{listing.category}</span>
            {isAvailable ? (
              <ExpiryCountdown expiresAt={listing.expiresAt} />
            ) : (
              <span className="badge badge-amber">{listing.status.toUpperCase()}</span>
            )}
          </div>
          <button onClick={onClose} className="btn-close" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Photo */}
          <div style={{ position: 'relative', height: '240px', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.25rem' }}>
            <img
              src={imageUrl}
              alt={listing.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', display: 'flex', gap: '0.5rem' }}>
              <span style={{ background: 'rgba(16, 185, 129, 0.95)', color: '#ffffff', padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800 }}>
                Feeds ~{listing.estimatedServings} People
              </span>
              <span style={{ background: 'rgba(15, 23, 42, 0.9)', color: '#f8fafc', padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                {listing.quantity} {listing.quantityUnit}
              </span>
            </div>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff' }}>
            {listing.title}
          </h2>

          <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {listing.description}
          </p>

          {/* Key Specifications Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Dietary Classification</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginTop: '0.2rem' }}>
                🌱 {listing.dietaryType}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Storage Condition</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginTop: '0.2rem' }}>
                {listing.storageCondition}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Pickup Window</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', marginTop: '0.2rem' }}>
                Until {new Date(listing.pickupWindowEnd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Allergen Disclosures</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171', marginTop: '0.2rem' }}>
                {listing.allergens?.join(', ') || 'None reported'}
              </div>
            </div>
          </div>

          {/* Food Safety Compliance Card */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
              <ShieldCheck size={18} />
              <span>Food Safety & Hygiene Certified</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              The donor certifies this surplus food was cooked today in a licensed facility, strictly stored within safe temperatures, and packaged in hygienic food-grade containers in compliance with Good Samaritan regulations.
            </p>
          </div>

          {/* Donor & Pickup Location */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: '12px', border: '1px solid var(--border-subtle)', padding: '1rem', marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#e2e8f0', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={15} color="#10b981" /> Pickup Location & Contact
            </h4>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
              {listing.donorName}
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              {listing.pickupAddress?.street}, {listing.pickupAddress?.city}
              {listing.pickupAddress?.landmark && ` (Landmark: ${listing.pickupAddress.landmark})`}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <User size={13} color="var(--text-dim)" /> Contact: {listing.contactPerson || 'Duty Staff'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={13} color="var(--text-dim)" /> {listing.contactPhone || 'Call via app'}
              </span>
            </div>
            {listing.handlingNotes && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', color: '#fbbf24', fontStyle: 'italic' }}>
                Note: {listing.handlingNotes}
              </div>
            )}
          </div>

          {/* Reserved Status Information */}
          {isReserved && (
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} /> Currently Reserved by {listing.claimedByName || 'NGO'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#e2e8f0', marginTop: '0.35rem' }}>
                Pickup ETA: ~{listing.etaMinutes || 30} minutes. Insulated vehicle dispatch requested.
              </div>
              {listing.claimOtp && (
                <div style={{ marginTop: '0.65rem', padding: '0.5rem 0.85rem', background: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Handoff Pickup Code:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '3px', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
                    {listing.claimOtp}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>

          {isAvailable && (
            <button
              onClick={() => {
                onClose();
                onClaim(listing);
              }}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              <HeartHandshake size={17} />
              <span>Proceed to Claim Surplus</span>
            </button>
          )}

          {isReserved && (
            <button
              onClick={() => {
                onClose();
                onVerifyOtp(listing);
              }}
              className="btn btn-amber"
              style={{ fontWeight: 700 }}
            >
              <KeyRound size={17} />
              <span>Verify Pickup OTP</span>
            </button>
          )}

          {isPickedUp && (
            <button
              onClick={() => {
                onClose();
                onCompleteDelivery(listing);
              }}
              className="btn btn-primary"
              style={{ background: '#06b6d4' }}
            >
              <CheckCircle size={17} />
              <span>Mark Delivered &amp; Fed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
