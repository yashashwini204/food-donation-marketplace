import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  Clock,
  Truck,
  ShieldCheck,
  KeyRound,
  CheckCircle,
  Copy,
  AlertCircle,
} from 'lucide-react';

export default function ClaimModal({
  listing,
  currentUser,
  onClose,
  onSubmitClaim,
  claimResult,
  isSubmitting,
}) {
  const [etaMinutes, setEtaMinutes] = useState(30);
  const [transportType, setTransportType] = useState('Cargo Van');
  const [notes, setNotes] = useState('');
  const [safetyAgreed, setSafetyAgreed] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!listing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!safetyAgreed) return;
    onSubmitClaim(listing._id, {
      etaMinutes: Number(etaMinutes),
      transportType,
      notes,
    });
  };

  const handleCopyOtp = (otp) => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If claim was successful, show the success confirmation & OTP card
  if (claimResult && claimResult.pickupOtp) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px', textAlign: 'center' }}>
          <div className="modal-body" style={{ padding: '2.5rem 2rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <CheckCircle size={36} color="#10b981" />
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#ffffff' }}>
              Surplus Food Reserved!
            </h2>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You have successfully reserved <strong>{listing.estimatedServings} servings</strong> of surplus food from <strong>{listing.donorName}</strong>.
            </p>

            {/* OTP Secret Card */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '2px dashed #f59e0b',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Your Secure Physical Handover OTP
              </div>

              <div
                style={{
                  fontSize: '2.75rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '8px',
                  color: '#ffffff',
                  marginBottom: '0.5rem',
                  textShadow: '0 0 16px rgba(245, 158, 11, 0.5)',
                }}
              >
                {claimResult.pickupOtp}
              </div>

              <button
                type="button"
                onClick={() => handleCopyOtp(claimResult.pickupOtp)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.8rem' }}
              >
                <Copy size={13} />
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Pickup Code'}</span>
              </button>

              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.85rem', marginBottom: 0 }}>
                Present this 4-digit code to the donor at <strong>{listing.pickupAddress?.street}</strong> to complete food handover.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={onClose} className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                Done &amp; View Mission
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HeartHandshake size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Reserve Surplus Food</h2>
          </div>
          <button onClick={onClose} className="btn-close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Listing Summary Box */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <img
                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80'}
                alt={listing.title}
                style={{ width: '70px', height: '70px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                  {listing.title}
                </h4>
                <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
                  Feeds ~{listing.estimatedServings} People ({listing.quantity} {listing.quantityUnit})
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                  Pickup from: {listing.donorName} • {listing.pickupAddress?.street}
                </div>
              </div>
            </div>

            {/* Estimated Arrival Time Picker */}
            <div className="form-group">
              <label className="form-label" htmlFor="claim-eta">
                <span>Estimated Pickup Arrival Time (ETA)</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>~{etaMinutes} minutes</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEtaMinutes(mins)}
                    className="btn"
                    style={{
                      background: etaMinutes === mins ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                      color: etaMinutes === mins ? '#ffffff' : 'var(--text-main)',
                      border: etaMinutes === mins ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      fontWeight: 700,
                      padding: '0.55rem',
                    }}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Vehicle Selection */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label" htmlFor="claim-transport">
                Dispatch Transport Vehicle
              </label>
              <select
                id="claim-transport"
                className="form-select"
                value={transportType}
                onChange={(e) => setTransportType(e.target.value)}
              >
                <option value="Cargo Van">Cargo Van / Minivan (With Insulated Coolers)</option>
                <option value="Refrigerated Vehicle">Refrigerated Truck / Van (&lt; 4°C)</option>
                <option value="Car">Passenger Car / SUV</option>
                <option value="Motorbike">Motorbike with Thermal Food Box</option>
                <option value="Bicycle with Carrier">Bicycle / Cart (Short Distance)</option>
              </select>
            </div>

            {/* Dispatch Notes */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label" htmlFor="claim-notes">
                <span>Dispatcher Notes for Donor</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Optional</span>
              </label>
              <textarea
                id="claim-notes"
                className="form-textarea"
                rows="2"
                placeholder="e.g. Volunteer driver Alex will arrive in a blue van. We have clean insulated containers."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Safety Commitment Checklist */}
            <div
              style={{
                marginTop: '1.25rem',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px',
                padding: '0.85rem',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  id="claim-safety-checkbox"
                  checked={safetyAgreed}
                  onChange={(e) => setSafetyAgreed(e.target.checked)}
                  style={{ marginTop: '0.2rem', accentColor: '#10b981' }}
                />
                <span style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  Our NGO guarantees hygienic food handling, immediate transport at safe temperatures, and distribution to verified shelter beneficiaries before expiry.
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-claim-submit-btn"
              disabled={isSubmitting || !safetyAgreed}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              <HeartHandshake size={18} />
              <span>{isSubmitting ? 'Reserving Surplus...' : 'Confirm & Generate OTP'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
