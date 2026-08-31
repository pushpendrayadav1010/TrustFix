import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { ServiceCard } from '../../components/service/ServiceCard';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { CategoryIcon } from '../../utils/categoryIcons';
import { Layers, Search, AlertCircle, RotateCcw } from 'lucide-react';

export const ServicesPage = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category');

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Categories
  useEffect(() => {
    const initCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);

        const target = categorySlug || queryCategory;
        if (target) {
          const matched = cats.find(
            c => String(c.id) === String(target) ||
                 c.slug === target.toLowerCase() ||
                 c.name.toLowerCase() === target.toLowerCase() ||
                 c.name.toLowerCase().replace(/\s+/g, '-') === target.toLowerCase()
          );
          if (matched) {
            setSelectedCategoryId(matched.id);
          } else {
            setSelectedCategoryId('all');
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    initCategories();
  }, [categorySlug, queryCategory]);

  // Fetch Services from backend based on selectedCategoryId and search
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError('');

      try {
        const targetCategoryId =
          selectedCategoryId !== 'all' && selectedCategoryId !== undefined && selectedCategoryId !== null
            ? selectedCategoryId
            : undefined;

        const servs = await categoryService.getServices({
          categoryId: targetCategoryId,
          search: search.trim() || undefined
        });

        setServices(servs);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Unable to load services from the server.');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategoryId, search]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (categoryId === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategoryId('all');
    setSearchParams({});
  };

  return (
    <div className="services-page" style={{ padding: '2.5rem 0 4rem 0', minHeight: '80vh' }}>
      <div className="container">

        {/* Page Header */}
        <div className="mb-8">
          <span className="section-subtitle">Services Catalog</span>
          <h1 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
            Find the Right Professional for Every Home Need
          </h1>
          <p className="section-desc">
            Explore verified doorstep solutions with background-checked specialists, transparent pricing, and ₹0 advance payment.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="card mb-8" style={{ padding: '1.25rem', backgroundColor: 'var(--white)' }}>
          <div className="flex flex-col gap-4">
            
            {/* Search Box */}
            <div className="search-box">
              <span className="search-icon">
                <Search size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search services (e.g. Electrical inspection, leak fix, AC jet service, deep cleaning)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm ${
                  selectedCategoryId === 'all'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                <Layers size={14} />
                <span>All Services</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm ${
                    selectedCategoryId === cat.id
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <CategoryIcon categoryName={cat.name} slug={cat.slug} size={14} />
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && !loading && (
          <EmptyState
            icon={AlertCircle}
            title="Failed to fetch services"
            description={error}
            action={
              <button className="btn btn-secondary" onClick={clearFilters}>
                <RotateCcw size={14} />
                <span>Clear Filters</span>
              </button>
            }
          />
        )}

        {/* Loading Spinner */}
        {loading && (
          <LoadingSpinner message="Loading verified services..." />
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <EmptyState
            icon={Search}
            title="No services found"
            description="Try searching with different keywords or select another category above."
            action={
              <button className="btn btn-secondary" onClick={clearFilters}>
                <RotateCcw size={14} />
                <span>Clear Filters</span>
              </button>
            }
          />
        )}

        {/* Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted font-semibold">
                Showing <strong>{services.length}</strong> verified services
              </span>
            </div>

            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};