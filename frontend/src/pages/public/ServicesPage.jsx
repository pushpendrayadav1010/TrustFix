import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import { ServiceCard } from '../../components/service/ServiceCard';
import { SearchBar, LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';

export const ServicesPage = () => {
  const { categorySlug } = useParams();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || 'all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cats, servs] = await Promise.all([
          categoryService.getCategories(),
          categoryService.getServices({
            categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
            search: search || undefined
          })
        ]);
        setCategories(cats);
        setServices(servs);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, search]);

  return (
    <div className="services-page" style={{ padding: '2.5rem 0 4rem 0' }}>
      <div className="container">
        {/* Page Header */}
        <div className="mb-8">
          <span className="section-subtitle">Service Catalog</span>
          <h1 className="section-title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
            Explore Verified Home Services
          </h1>
          <p className="section-desc">
            Browse guaranteed home repair solutions with background-checked specialists and transparent rates.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="card mb-8" style={{ padding: '1.25rem' }}>
          <div className="flex flex-col gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search services (e.g. Electrical inspection, leak fix, deep cleaning)..."
            />

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Services
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm ${selectedCategory === cat.slug ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <LoadingSpinner message="Fetching verified services..." />
        ) : services.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No services match your search"
            description="Try searching with different keywords or select a different category."
            action={
              <button
                className="btn btn-secondary"
                onClick={() => { setSearch(''); setSelectedCategory('all'); }}
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
