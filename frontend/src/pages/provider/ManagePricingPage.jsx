import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/formatters';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const ManagePricingPage = () => {
  const { providerProfile, updateProvider } = useAuth();
  const [basePrice, setBasePrice] = useState(providerProfile?.startingPrice || 299);
  const [hourlyRate, setHourlyRate] = useState(providerProfile?.hourlyRate || 350);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProvider({
      startingPrice: Number(basePrice),
      hourlyRate: Number(hourlyRate),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="manage-pricing-page">
      <DashboardHeader
        title="Manage Base Rates & Pricing Structure"
        subtitle="Set your standard visit fees, hourly labor charges, and transparent pricing policies."
      />

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '720px' }}>
          
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid var(--neutral-200)', paddingBottom: '0.75rem' }}>
              Base Pricing Configuration
            </h3>

            {saved && (
              <div className="alert alert-success mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} />
                <span>Pricing rates updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave}>
              <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                
                <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--neutral-50)' }}>
                  <span className="text-xs text-muted block uppercase font-bold mb-1">Standard Base Visit</span>
                  <Input
                    label="Inspection & First Hour Fee (₹)"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted" style={{ margin: 0 }}>
                    Displayed as your "Starting Price" on search cards. Current: <strong>{formatCurrency(basePrice)}</strong>
                  </p>
                </div>

                <div className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--neutral-50)' }}>
                  <span className="text-xs text-muted block uppercase font-bold mb-1">Extended Hourly Labor</span>
                  <Input
                    label="Hourly Rate Thereafter (₹)"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted" style={{ margin: 0 }}>
                    Applied for long-duration complex installations. Current: <strong>{formatCurrency(hourlyRate)}/hr</strong>
                  </p>
                </div>

              </div>

              {/* Policy Notes */}
              <div
                style={{
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-100)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--primary-900)',
                }}
              >
                <h5 style={{ fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--primary-700)" />
                  <span>TrustFix Fair Pricing Policy</span>
                </h5>
                <ul style={{ paddingLeft: '1.2rem', margin: 0, lineHeight: 1.6, fontSize: '0.8125rem' }}>
                  <li>All replacement hardware and materials must be billed to the customer at actual MRP with receipt.</li>
                  <li>Technicians are protected with guaranteed payout on completed bookings.</li>
                  <li>No cash advance deposits are allowed prior to technician arrival.</li>
                </ul>
              </div>

              <Button type="submit" variant="primary">
                Save & Update Rate Card
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
