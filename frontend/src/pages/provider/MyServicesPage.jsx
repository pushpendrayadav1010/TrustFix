import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { providerService } from '../../services/providerService';
import { categoryService } from '../../services/categoryService';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { formatCurrency } from '../../utils/formatters';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';

export const MyServicesPage = () => {
  const { user, providerProfile, updateProvider } = useAuth();
  const [services, setServices] = useState([]);
  const [catalogServices, setCatalogServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Service Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    price: '499',
    type: 'Base Visit',
    description: ''
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      let activeProfile = providerProfile;
      if (!activeProfile && user?.id) {
        activeProfile = await providerService.getProviderByUserId(user.id);
        updateProvider(activeProfile);
      }

      if (activeProfile?.id) {
        const [provServices, catalog] = await Promise.all([
          providerService.getProviderServices(activeProfile.id),
          categoryService.getServices()
        ]);
        setServices(provServices || []);
        setCatalogServices(catalog || []);
        if (catalog && catalog.length > 0) {
          setFormData(prev => ({ ...prev, serviceId: String(catalog[0].id) }));
        }
      } else {
        const catalog = await categoryService.getServices();
        setServices([]);
        setCatalogServices(catalog || []);
      }
    } catch (err) {
      console.error('Failed to fetch provider services:', err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user, providerProfile?.id]);

  const handleOpenAdd = () => {
    const defaultServiceId = catalogServices.length > 0 ? String(catalogServices[0].id) : '';
    setFormData({
      serviceId: defaultServiceId,
      price: '499',
      type: 'Base Visit',
      description: ''
    });
    setModalOpen(true);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!formData.serviceId || !formData.price) return;

    try {
      let targetId = providerProfile?.id;
      if (!targetId && user?.id) {
        const fetched = await providerService.getProviderByUserId(user.id);
        targetId = fetched?.id;
      }

      if (!targetId) {
        alert('Please complete your provider profile setup before adding services.');
        return;
      }

      await providerService.addProviderService(targetId, Number(formData.serviceId), Number(formData.price));
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Error adding provider service:', err);
      alert('Failed to add service: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteService = async (serv) => {
    if (window.confirm(`Are you sure you want to remove "${serv.item || serv.serviceName}" from your services?`)) {
      try {
        let targetId = providerProfile?.id;
        if (!targetId && user?.id) {
          const fetched = await providerService.getProviderByUserId(user.id);
          targetId = fetched?.id;
        }

        if (!targetId) return;

        const serviceIdToDelete = serv.serviceId || serv.id;
        await providerService.deleteProviderService(targetId, serviceIdToDelete);
        fetchServices();
      } catch (err) {
        console.error('Error deleting provider service:', err);
      }
    }
  };

  return (
    <div className="my-services-page">
      <DashboardHeader
        title="My Trade Services & Catalog"
        subtitle="Configure the specific jobs and installation tasks you offer to TrustFix customers."
        actions={
          <Button variant="primary" size="sm" onClick={handleOpenAdd} className="flex items-center gap-1">
            <Plus size={15} />
            <span>Add New Service</span>
          </Button>
        }
      />

      <div className="dashboard-content">
        {loading ? (
          <LoadingSpinner message="Loading your service catalog..." />
        ) : services.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No services configured"
            description="Add the tasks and repairs you specialize in to start receiving customer requests."
            action={
              <Button variant="primary" onClick={handleOpenAdd} className="flex items-center gap-1">
                <Plus size={15} />
                <span>Add First Service</span>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map((serv, idx) => (
              <div key={idx} className="card card-hoverable flex flex-col justify-between">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <span className="badge badge-confirmed">{serv.type || 'Base Visit'}</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-800)' }}>
                      {formatCurrency(serv.price)}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--neutral-900)' }}>
                    {serv.item || serv.serviceName}
                  </h4>

                  <p className="text-xs text-muted mt-2" style={{ lineHeight: 1.5 }}>
                    Standard labor charge includes arrival, diagnostics, and standard tools.
                  </p>
                </div>

                <div className="card-footer flex items-center justify-between">
                  <span className="text-xs text-muted">Status: <strong style={{ color: 'var(--success-700)' }}>Active</strong></span>
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary flex items-center gap-1"
                    style={{ color: 'var(--danger-600)' }}
                    onClick={() => handleDeleteService(serv)}
                  >
                    <Trash2 size={12} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Service Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add New Specialized Service"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAddService}>Add To Catalog</Button>
            </>
          }
        >
          <form onSubmit={handleAddService}>
            <div className="form-group mb-4">
              <label className="form-label">Select Service Category / Task</label>
              <select
                className="form-control"
                value={formData.serviceId}
                onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
                required
              >
                {catalogServices.map(cs => (
                  <option key={cs.id} value={cs.id}>
                    {cs.name} (Base: ₹{cs.basePrice || cs.startingPrice || 499})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Custom Service Price (₹)"
                type="number"
                placeholder="499"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                required
              />

              <div className="form-group">
                <label className="form-label">Pricing Type</label>
                <select
                  className="form-control"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Base Visit">Base Visit</option>
                  <option value="Per Unit">Per Unit</option>
                  <option value="Fixed">Fixed Package</option>
                  <option value="Per Hour">Per Hour</option>
                </select>
              </div>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Task Details / Inclusions</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="What is included in this standard charge..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
};
