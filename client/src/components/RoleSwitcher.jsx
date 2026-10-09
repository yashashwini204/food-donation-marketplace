import React from 'react';
import { Utensils, HeartHandshake, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export default function RoleSwitcher({ currentUser, onSwitchRole, isLoading }) {
  const roles = [
    {
      id: 'ngo',
      name: 'NGO / Charity',
      desc: 'Claim excess food, get pickup OTP, distribute to shelters',
      icon: HeartHandshake,
      color: '#10b981',
      badgeClass: 'badge-emerald',
    },
    {
      id: 'donor',
      name: 'Food Donor',
      desc: 'List buffet & fresh surplus, verify handover OTPs',
      icon: Utensils,
      color: '#f59e0b',
      badgeClass: 'badge-amber',
    },
    {
      id: 'volunteer',
      name: 'Volunteer Courier',
      desc: 'Deliver food from donors to NGOs, assist with transport',
      icon: Truck,
      color: '#06b6d4',
      badgeClass: 'badge-blue',
    },
    {
      id: 'admin',
      name: 'Platform Admin',
      desc: 'System monitoring, food safety compliance & audit stats',
      icon: ShieldCheck,
      color: '#8b5cf6',
      badgeClass: 'badge-neutral',
    },
  ];

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.85)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(10px)',
        padding: '0.65rem 1rem',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', fontWeight: 700 }}>
            Active Perspective:
          </span>
          <span
            className="badge badge-emerald"
            style={{
              padding: '0.25rem 0.65rem',
              background: 'rgba(16, 185, 129, 0.2)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {currentUser?.organizationName || currentUser?.name || 'NGO Partner'} ({currentUser?.role?.toUpperCase()})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.2rem' }}>
            Switch Role:
          </span>
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = currentUser?.role === r.id;
            return (
              <button
                key={r.id}
                id={`role-btn-${r.id}`}
                onClick={() => onSwitchRole(r.id)}
                disabled={isLoading}
                title={r.desc}
                className="btn btn-sm"
                style={{
                  background: isActive ? r.color : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#0f172a' : 'var(--text-main)',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? `1px solid ${r.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive ? `0 2px 10px ${r.color}55` : 'none',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                }}
              >
                <Icon size={14} />
                <span>{r.name}</span>
                {isActive && <span style={{ fontSize: '0.65rem', marginLeft: '2px' }}>●</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
