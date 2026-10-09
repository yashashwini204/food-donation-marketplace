import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

export default function ExpiryCountdown({ expiresAt, compact = false }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) {
      return { expired: true, hours: 0, minutes: 0, seconds: 0, totalDiff: 0 };
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { expired: false, hours, minutes, seconds, totalDiff: diff };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  if (timeLeft.expired) {
    return (
      <span className="badge badge-neutral" style={{ color: '#94a3b8' }}>
        <Clock size={13} /> Expired
      </span>
    );
  }

  const isUrgent = timeLeft.totalDiff <= 3 * 3600 * 1000;
  const isModerate = timeLeft.totalDiff <= 6 * 3600 * 1000;

  let badgeClass = 'badge-emerald';
  let icon = <Clock size={13} />;

  if (isUrgent) {
    badgeClass = 'badge-red';
    icon = <AlertTriangle size={13} />;
  } else if (isModerate) {
    badgeClass = 'badge-amber';
  }

  const formatted = `${timeLeft.hours}h ${String(timeLeft.minutes).padStart(2, '0')}m ${compact ? '' : `${String(timeLeft.seconds).padStart(2, '0')}s`}`;

  return (
    <span className={`badge ${badgeClass}`} title={`Expires at ${new Date(expiresAt).toLocaleTimeString()}`}>
      {icon}
      <span>{isUrgent ? 'URGENT: ' : ''}{formatted.trim()}</span>
    </span>
  );
}
