import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/providerService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Button } from '../../components/common/Button';

export const AvailabilityPage = () => {
  const { user, providerProfile, updateProvider } = useAuth();
  const [isAvailable, setIsAvailable] = useState(providerProfile?.available ?? true);
  
  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [workingDays, setWorkingDays] = useState(providerProfile?.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  
  const [workingHours, setWorkingHours] = useState(providerProfile?.workingHours || "08:00 AM - 08:00 PM");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (providerProfile?.available !== undefined) {
      setIsAvailable(providerProfile.available);
    }
  }, [providerProfile?.available]);

  const handleDayToggle = (day) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let targetId = providerProfile?.id;
      if (!targetId && user?.id) {
        const fetched = await providerService.getProviderByUserId(user.id);
        targetId = fetched.id;
      }

      if (targetId) {
        const updated = await providerService.updateProviderProfile(targetId, {
          available: isAvailable,
          workingDays,
          workingHours
        });
        updateProvider(updated);
      } else {
        updateProvider({ available: isAvailable, workingDays, workingHours });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error saving availability schedule:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="availability-page">
      <DashboardHeader
        title="Working Hours & Availability Schedule"
        subtitle="Control the days, hours, and live toggle for receiving customer service requests."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '680px' }}>
          
          <div className="card" style={{ padding: '2rem' }}>
            {saved && (
              <div className="alert alert-success mb-4">
                <span>✓</span>
                <span>Availability schedule updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              {/* Master Live Availability Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                  backgroundColor: isAvailable ? 'var(--success-50)' : 'var(--neutral-100)',
                  border: isAvailable ? '1.5px solid var(--success-500)' : '1px solid var(--neutral-300)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '2rem',
                }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`status-dot ${isAvailable ? 'online' : 'offline'}`} />
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                      {isAvailable ? 'Currently Online & Accepting Jobs' : 'Currently Offline / Paused'}
                    </h4>
                  </div>
                  <p className="text-xs text-muted" style={{ margin: 0, marginTop: '4px' }}>
                    {isAvailable
                      ? 'Customers can find you in search and book appointments.'
                      : 'You will not receive new incoming booking requests.'}
                  </p>
                </div>

                <button
                  type="button"
                  className={`btn btn-sm ${isAvailable ? 'btn-danger' : 'btn-success'}`}
                  onClick={() => setIsAvailable(!isAvailable)}
                >
                  {isAvailable ? 'Go Offline' : 'Go Online'}
                </button>
              </div>

              {/* Working Days */}
              <div className="form-group mb-6">
                <label className="form-label">Active Operating Days</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {allDays.map((day) => {
                    const isChecked = workingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        className={`btn btn-sm ${isChecked ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => handleDayToggle(day)}
                        style={{ padding: '8px 12px' }}
                      >
                        <span>{isChecked ? '✓' : '+'}</span>
                        <span>{day}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Working Hours */}
              <div className="form-group mb-6">
                <label className="form-label">Daily Operational Hours</label>
                <input
                  type="text"
                  className="form-control"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                  placeholder="e.g. 08:00 AM - 08:00 PM"
                />
              </div>

              <Button type="submit" variant="primary">
                Save Working Schedule
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
