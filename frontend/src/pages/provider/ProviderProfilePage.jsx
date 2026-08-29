import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/providerService';
import { locationService } from '../../services/locationService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { MapView } from '../../components/map/MapView';
import { LoadingSpinner } from '../../components/common/FeedbackStates';
import { CheckCircle2, Lock, MapPin, Globe, FileText } from 'lucide-react';

export const ProviderProfilePage = () => {
  const { user, providerProfile, updateProvider } = useAuth();
  const [providerLoc, setProviderLoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: providerProfile?.name || user?.name || '',
    companyName: providerProfile?.companyName || providerProfile?.businessName || '',
    phone: providerProfile?.phone || user?.phone || '',
    experience: providerProfile?.experience || providerProfile?.experienceYears || 0,
    service: providerProfile?.service || 'Home Service',
    city: providerProfile?.city || 'Mumbai',
    state: providerProfile?.state || 'Maharashtra',
    postalCode: providerProfile?.postalCode || '400053',
    serviceArea: providerProfile?.serviceArea || 'Mumbai, Maharashtra',
    bio: providerProfile?.bio || ''
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let activeProfile = providerProfile;
        if (!activeProfile && user?.id) {
          activeProfile = await providerService.getProviderByUserId(user.id);
          updateProvider(activeProfile);
        }

        if (activeProfile) {
          setFormData({
            name: activeProfile.name || user?.name || '',
            companyName: activeProfile.companyName || activeProfile.businessName || '',
            phone: activeProfile.phone || user?.phone || '',
            experience: activeProfile.experience || activeProfile.experienceYears || 0,
            service: activeProfile.service || 'Home Service',
            city: activeProfile.city || 'Mumbai',
            state: activeProfile.state || 'Maharashtra',
            postalCode: activeProfile.postalCode || '400053',
            serviceArea: activeProfile.serviceArea || `${activeProfile.city || 'Mumbai'}, ${activeProfile.state || ''}`,
            bio: activeProfile.bio || ''
          });
        }

        if (activeProfile?.id) {
          const loc = await locationService.getLocationByProviderId(activeProfile.id).catch(() => null);
          setProviderLoc(loc);
        } else {
          setProviderLoc(null);
        }
      } catch (err) {
        console.error('Failed to load provider profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, providerProfile?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let targetId = providerProfile?.id;
      if (!targetId && user?.id) {
        const fetched = await providerService.getProviderByUserId(user.id);
        targetId = fetched.id;
      }

      if (!targetId) {
        throw new Error('Provider Profile ID missing');
      }

      const updated = await providerService.updateProviderProfile(targetId, formData);
      updateProvider(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update provider profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="provider-profile-page">
      <DashboardHeader
        title="Business Profile & Service Area"
        subtitle="Manage your public provider listing, service area boundaries, and trade credentials."
      />

      <div className="dashboard-content">
        {loading ? (
          <LoadingSpinner message="Loading profile..." />
        ) : (
          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Left Column: Edit Form */}
            <div className="card" style={{ padding: '2rem' }}>
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Profile Information
                </h3>
                <VerificationBadge status={providerProfile?.verificationStatus} />
              </div>

              {saveSuccess && (
                <div className="alert alert-success mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {/* Read-Only Verification Status Note */}
              <div
                style={{
                  backgroundColor: 'var(--neutral-100)',
                  border: '1px solid var(--neutral-300)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  marginBottom: '1.5rem',
                  fontSize: '12px',
                  color: 'var(--neutral-700)',
                }}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Lock size={14} color="var(--neutral-600)" />
                  <span>Verification Status:</span>
                  <VerificationBadge status={providerProfile?.verificationStatus} size="sm" />
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--neutral-500)' }}>
                  Verification badges are issued exclusively by TrustFix Admin review following physical identity and trade license audits.
                </p>
              </div>

              <form onSubmit={handleSaveProfile}>
                <Input
                  label="Contact Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Business / Enterprise Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <Input
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                  <Input
                    label="Years of Experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  label="Primary Service Category"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Service Area (Localities Covered)"
                  name="serviceArea"
                  placeholder="e.g. Thane, Mulund, Bhandup, Ghatkopar"
                  value={formData.serviceArea}
                  onChange={handleChange}
                  hint="Separate cities/suburbs with commas."
                  required
                />

                <div className="form-group">
                  <label className="form-label">Professional Bio / Overview</label>
                  <textarea
                    name="bio"
                    className="form-control"
                    rows="4"
                    value={formData.bio}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" variant="primary" loading={saving} style={{ marginTop: '0.5rem' }}>
                  Save Profile Changes
                </Button>
              </form>
            </div>

            {/* Right Column: Location & Service Area Map */}
            <div className="flex flex-col gap-6">
              
              <div className="card" style={{ padding: '1.75rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Operational Radius & Service Map
                </h4>
                <p className="text-xs text-muted mb-4">
                  Visual representation of the geographical territory you cover on TrustFix. Customers in this radius see your profile in search.
                </p>

                <div style={{ height: '300px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1rem' }}>
                  <MapView
                    locations={providerLoc ? [providerLoc] : []}
                    selectedProviderId={providerProfile?.id}
                    height="300px"
                    showServiceRadius={true}
                    interactive={true}
                  />
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <div>
                    <span className="text-muted block">Primary Operating Base:</span>
                    <strong className="flex items-center gap-1">
                      <MapPin size={12} color="var(--primary-700)" />
                      <span>{providerLoc?.address || 'Teen Hath Naka, Thane West'}</span>
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted block">Coverage Radius:</span>
                    <strong className="flex items-center gap-1">
                      <Globe size={12} color="var(--primary-700)" />
                      <span>~{providerLoc?.serviceRadiusKm || 12} km radius</span>
                    </strong>
                  </div>
                </div>
              </div>

              {/* Verified Documents on Record */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                  Submitted Verification Documents
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(providerProfile?.documentsVerified || ['Govt Electrical Trade License', 'Aadhaar Identity Card', 'Police Clearance Certificate']).map((doc, idx) => (
                    <li key={idx} className="flex items-center justify-between text-xs p-2 bg-neutral-50 rounded border" style={{ backgroundColor: 'var(--neutral-50)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-sm)' }}>
                      <span className="flex items-center gap-2">
                        <FileText size={13} color="var(--primary-700)" />
                        <span>{doc}</span>
                      </span>
                      <span className="badge badge-verified" style={{ fontSize: '10px' }}>
                        <CheckCircle2 size={10} />
                        Approved
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};
