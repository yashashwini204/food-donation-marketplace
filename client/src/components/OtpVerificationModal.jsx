import React, { useState } from 'react';
import { X, KeyRound, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function OtpVerificationModal({
  listing,
  onClose,
  onVerify,
  isVerifying,
  errorMessage,
}) {
  const [otp, setOtp] = useState('');

  if (!listing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otp.trim()) return;
    onVerify(listing._id, otp.trim());
  };

  const fillDemoOtp = () => {
    if (listing.claimOtp) {
      setOtp(listing.claimOtp);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={20} color="#f59e0b" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Verify Handover OTP</h2>
          </div>
          <button onClick={onClose} className="btn-close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Ask the NGO representative from <strong>{listing.claimedByName || 'the NGO'}</strong> for their 4-digit verification code.
            </p>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '0.85rem',
                marginBottom: '1.5rem',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ffffff' }}>
                {listing.title}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#10b981', marginTop: '0.2rem' }}>
                Feeds ~{listing.estimatedServings} People • {listing.quantity} {listing.quantityUnit}
              </div>
            </div>

            {/* OTP Input Field */}
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <input
                id="otp-input-field"
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="• • • •"
                autoFocus
                style={{
                  width: '200px',
                  margin: '0 auto',
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  letterSpacing: '12px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '2px solid rgba(245, 158, 11, 0.5)',
                  borderRadius: '12px',
                  color: '#ffffff',
                }}
              />
            </div>

            {errorMessage && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Demo Helper */}
            {listing.claimOtp && (
              <div style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={fillDemoOtp}
                  style={{
                    fontSize: '0.8rem',
                    color: '#fbbf24',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px dashed rgba(245, 158, 11, 0.4)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Demo Quick Fill: <strong>{listing.claimOtp}</strong>
                </button>
              </div>
            )}

            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
              Verifying this OTP confirms physical custody transfer of the food in compliance with food safety protocols.
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'center' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              id="submit-otp-verify-btn"
              disabled={isVerifying || otp.length < 4}
              className="btn btn-amber"
              style={{ fontWeight: 700, padding: '0.65rem 1.75rem' }}
            >
              <CheckCircle size={17} />
              <span>{isVerifying ? 'Verifying...' : 'Confirm Handover'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
