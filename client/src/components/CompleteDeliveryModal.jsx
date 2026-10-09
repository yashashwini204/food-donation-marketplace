import React, { useState } from 'react';
import { X, CheckCircle, Heart, Leaf, Sparkles } from 'lucide-react';

export default function CompleteDeliveryModal({
  listing,
  onClose,
  onComplete,
  isCompleting,
}) {
  const defaultCount = listing?.estimatedServings || 50;
  const [beneficiaries, setBeneficiaries] = useState(defaultCount);
  const [notes, setNotes] = useState('');

  if (!listing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete(listing._id, {
      beneficiariesServed: Number(beneficiaries) || defaultCount,
      distributionNotes: notes,
    });
  };

  const kgSaved = listing.quantityUnit === 'kg' ? listing.quantity : Math.round(listing.quantity * 0.45);
  const co2Saved = Math.round(kgSaved * 2.5);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Complete Delivery Mission</h2>
          </div>
          <button onClick={onClose} className="btn-close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                }}
              >
                <Heart size={30} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', fontWeight: 800 }}>
                Record Beneficiaries Fed
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {listing.title}
              </p>
            </div>

            {/* Live Impact Preview */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                <Leaf size={18} color="#10b981" style={{ margin: '0 auto 0.25rem' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                  {co2Saved} kg
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                  CO2e Emissions Saved
                </div>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '10px', padding: '0.85rem', textAlign: 'center' }}>
                <Heart size={18} color="#06b6d4" style={{ margin: '0 auto 0.25rem' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#06b6d4' }}>
                  {beneficiaries} People
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Nourished at Shelter
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="beneficiaries-count-input">
                Beneficiaries / Residents Served
              </label>
              <input
                id="beneficiaries-count-input"
                type="number"
                min="1"
                className="form-input"
                value={beneficiaries}
                onChange={(e) => setBeneficiaries(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="distribution-notes-input">
                <span>Distribution Log / Shelter Details</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Optional</span>
              </label>
              <textarea
                id="distribution-notes-input"
                className="form-textarea"
                rows="2"
                placeholder="e.g. Distributed at Hope Shelter evening community meal program."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              id="confirm-complete-btn"
              disabled={isCompleting}
              className="btn btn-primary"
              style={{ fontWeight: 700 }}
            >
              <Sparkles size={17} />
              <span>{isCompleting ? 'Finalizing...' : 'Complete & Update Impact'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
