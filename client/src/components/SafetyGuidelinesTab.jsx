import React from 'react';
import {
  ShieldCheck,
  Thermometer,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function SafetyGuidelinesTab() {
  return (
    <div style={{ padding: '1.5rem 0 3rem' }}>
      <div className="container">
        {/* Header */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            marginBottom: '2rem',
            background: 'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.95) 70%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <ShieldCheck size={16} /> FOOD SAFETY &amp; COMPLIANCE STANDARDS
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Safe Food Donation Protocols &amp; Good Samaritan Protections
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '780px' }}>
            Ensuring every rescued meal is as safe, hygienic, and dignified as fresh restaurant service. Follow these temperature and handling guidelines to protect vulnerable shelter beneficiaries.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Temperature Danger Zone */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Thermometer size={22} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                The Danger Zone (4°C - 60°C)
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Bacteria multiply rapidly between <strong>4°C and 60°C (40°F - 140°F)</strong>. Surplus food must not sit in this zone:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>🔥 Hot Cooked Meals:</span> Keep at or above <strong>60°C (140°F)</strong> using chafing dishes or transport in insulated thermal coolers.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#06b6d4', fontWeight: 800 }}>❄️ Chilled / Dairy:</span> Keep strictly at or below <strong>4°C (40°F)</strong> in refrigerated transport or ice packed bags.
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#fbbf24', fontWeight: 800 }}>⏱️ 2-Hour Window:</span> Food kept outside temperature controls for &gt; 2 hours cannot be distributed and must be composted.
              </li>
            </ul>
          </div>

          {/* Legal Protection */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={22} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Good Samaritan Legal Protection
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
              Under the <strong>Bill Emerson Good Samaritan Food Donation Act</strong> and national surplus food guidelines:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.84rem', color: '#cbd5e1' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Liability Shield:</strong> Donors who contribute food in good faith to non-profit organizations are shielded from civil and criminal liability.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Verified Non-Profit Channel:</strong> Food must be received by registered 501(c)(3) or verified charity organizations and distributed free of charge.</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Tax Incentives:</strong> Qualifying commercial food businesses may claim enhanced tax deductions for surplus inventory donations.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Safe Transport & Handover SOP Checklist */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
            Standard Operating Procedure (SOP) for NGO Pickup
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#34d399', marginBottom: '0.5rem' }}>
                1. Pre-Pickup Preparation
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Ensure vehicles are thoroughly sanitised. Bring clean, food-grade insulated boxes, ice packs for cold items, or thermal bags for hot buffet trays.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem' }}>
                2. Physical Handover &amp; OTP
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Inspect packaging integrity. Verify that food has been sealed in stainless or food-grade containers. Provide the 4-digit OTP to the donor to record physical transfer.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '12px' }}>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#06b6d4', marginBottom: '0.5rem' }}>
                3. Immediate Distribution
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Proceed immediately to the destination soup kitchen or shelter. Reheat hot meals to 75°C (165°F) before portioning and serving. Record resident count fed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
