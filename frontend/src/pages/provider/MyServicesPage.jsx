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
import { ClipboardList, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const MyServicesPage = () => {
  const { providerProfile } = useAuth();
  const [providerServices, setProviderServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Service Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [adding, setAdding] = useState(false);

  const fetchServices = async () => {
    if (!providerProfile?.id) return;
    setLoading(true);
    try {
      const [pServices, allServs] = await Promise.all([
        providerService.getProviderServices(providerProfile.id),
        categoryService.getServices()
      ]);
      setProviderServices(pServices);
      setAllServices(allServs);
      if (allServs.length > 0) {
        setSelectedServiceId(allServs[0].id);
        setCustomPrice(allServs[0].basePrice || 499);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [providerProfile?.id]);

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) return;
    setAdding(true);
    try {
      await providerService.addProviderService(
        providerProfile.id,
        selectedServiceId,
        parseFloat(customPrice) || 499
      );
      setModalOpen(false);
      await fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to add service');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to remove this service from your catalog?')) return;
    try {
      await providerService.deleteProviderService(providerProfile.id, serviceId);
      await fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to remove service');
    }
  };

  return (
    <div>
      <DashboardHeader
        title="My Service Catalog"
        subtitle="Manage the home service offerings visible on your public provider profile."
        actions={
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={14} />
            <span>Add Service</span>
          </button>
        }
      />

      <div className="dashboard-content">
        
        {loading ? (
          <LoadingSpinner message="Loading your service catalog..." />
        ) : providerServices.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No services added yet"
            description="Add services from our platform catalog to start accepting bookings in your trade specialty."
            action={
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                <Plus size={14} />
                <span>Add Your First Service</span>
              </Button>
            }
          />
        ) : (
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Category</th>
                    <th>Your Rate</th>
                    <th>Status</th>
                    <th className="text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {providerServices.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <strong className="text-sm block">{s.serviceName || s.name}</strong>
                      </td>
                      <td>
                        <span className="badge badge-confirmed" style={{ fontSize: '11px' }}>
                          {s.categoryName || 'General'}
                        </span>
                      </td>
                      <td>
                        <strong className="text-sm text-primary">
                          {formatCurrency(s.customPrice || s.price || 499)}
                        </strong>
                      </td>
                      <td>
                        <span className="badge badge-verified" style={{ fontSize: '11px' }}>
                          Active Offering
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          style={{ padding: '4px 8px' }}
                          onClick={() => handleRemoveService(s.serviceId || s.id)}
                          title="Remove Service"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Service Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Add Service to Your Catalog"
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" loading={adding} onClick={handleAddService}>
                Add Service
              </Button>
            </>
          }
        >
          <form onSubmit={handleAddService}>
            <div className="form-group mb-4">
              <label className="form-label font-bold">Select Standard Service</label>
              <select
                className="form-control"
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  const serv = allServices.find(s => String(s.id) === String(e.target.value));
                  if (serv) setCustomPrice(serv.basePrice || 499);
                }}
              >
                {allServices.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.categoryName}) - Base: {formatCurrency(s.basePrice || 499)}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Your Custom Doorstep Rate (₹)"
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              required
            />
          </form>
        </Modal>

      </div>
    </div>
  );
};
