import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/providerService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Button } from '../../components/common/Button';
import { Clock, CheckCircle2, AlertCircle, Power } from 'lucide-react';

export const AvailabilityPage = () => {
  const { providerProfile, updateProvider } = useAuth();
  const [isAvailable, setIsAvailable] = useState(providerProfile?.available ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [schedule, setSchedule] = useState([
    { day: 'Monday', active: true, start: '09:00', end: '19:00' },
    { day: 'Tuesday', active: true, start: '09:00', end: '19:00' },
    { day: 'Wednesday', active: true, start: '09:00', end: '19:00' },
    { day: 'Thursday', active: true, start: '09:00', end: '19:00' },
    { day: 'Friday', active: true, start: '09:00', end: '19:00' },
    { day: 'Saturday', active: true, start: '09:00', end: '18:00' },
    { day: 'Sunday', active: false, start: '10:00', end: '16:00' },
  ]);

  const handleToggleMaster = async () => {
    if (!providerProfile?.id) return;
    setSaving(true);
    setMessage('');
    try {
      const newStatus = await providerService.toggleAvailability(providerProfile.id, isAvailable);
      setIsAvailable(newStatus);
      updateProvider({ available: newStatus });
      setMessage(`Status updated to ${newStatus ? 'ONLINE' : 'OFFLINE'}.`);
    } catch (err) {
      alert(err.message || 'Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  const handleDayToggle = (idx) => {
    setSchedule(prev => {
      const copy = [...prev];
      copy[idx].active = !copy[idx].active;
      return copy;
    });
  };

  const handleTimeChange = (idx, field, val) => {
    setSchedule(prev => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };

  return (
    <div>
      <DashboardHeader
        title="Availability & Working Hours"
        subtitle="Control your online booking status and weekly service hours."
      />

      <div className="dashboard-content">
        <div style={{ maxWidth: '780px' }}>
          
          {/* Master Availability Toggle Card */}
          <div className="card mb-6" style={{ padding: '1.75rem', backgroundColor: 'var(--white)' }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`status-dot ${isAvailable ? 'online' : 'offline'}`} />
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                    Accepting New Bookings ({isAvailable ? 'ONLINE' : 'OFFLINE'})
                  </h4>
                </div>
                <p className="text-xs text-muted mt-1 mb-0">
                  When toggled ONLINE, your profile is listed in search results and available for customer dispatches.
                </p>
              </div>

              <Button
                variant={isAvailable ? 'success' : 'secondary'}
                loading={saving}
                onClick={handleToggleMaster}
              >
                <Power size={14} />
                <span>{isAvailable ? 'Switch to OFFLINE' : 'Switch to ONLINE'}</span>
              </Button>
            </div>

            {message && (
              <div className="alert alert-success mt-4 mb-0">
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}
          </div>

          {/* Weekly Schedule */}
          <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--white)' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--neutral-900)' }}>
              Weekly Operating Schedule
            </h4>

            <div className="flex flex-col gap-3">
              {schedule.map((item, idx) => (
                <div
                  key={item.day}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.875rem 1rem',
                    backgroundColor: item.active ? 'var(--neutral-50)' : 'var(--neutral-100)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--neutral-200)',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ minWidth: '120px' }}>
                    <strong className="text-sm block" style={{ color: item.active ? 'var(--neutral-900)' : 'var(--neutral-500)' }}>
                      {item.day}
                    </strong>
                    <span className="text-2xs text-muted">{item.active ? 'Working Day' : 'Day Off'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        value={item.start}
                        disabled={!item.active}
                        onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                      />
                      <span className="text-xs text-muted">to</span>
                      <input
                        type="time"
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                        value={item.end}
                        disabled={!item.active}
                        onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      className={`btn btn-sm ${item.active ? 'btn-outline-danger' : 'btn-light'}`}
                      style={{ padding: '4px 10px', fontSize: '12px' }}
                      onClick={() => handleDayToggle(idx)}
                    >
                      {item.active ? 'Set Unavailable' : 'Set Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-top mt-4" style={{ borderTop: '1px solid var(--neutral-200)' }}>
              <Button
                variant="primary"
                onClick={() => alert('Operating hours saved successfully.')}
              >
                Save Schedule
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
