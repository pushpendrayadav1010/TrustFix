import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { categoryService } from '../../services/categoryService';
import { ServiceCard } from '../../components/service/ServiceCard';
import {
  SearchBar,
  LoadingSpinner,
  EmptyState
} from '../../components/common/FeedbackStates';

export const ServicesPage = () => {
  const { categorySlug } = useParams();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);

  // Category state uses selectedCategoryId ('all' or numeric ID)
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // =====================================================
  // Fetch Categories & Resolve category param if passed
  // =====================================================
  useEffect(() => {
    const initCategories = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);

        if (categorySlug) {
          const matched = cats.find(
            c => String(c.id) === String(categorySlug) ||
                 c.name.toLowerCase() === categorySlug.toLowerCase() ||
                 c.name.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase()
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
  }, [categorySlug]);

  // =====================================================
  // Fetch Services from backend based on selectedCategoryId
  // =====================================================
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

  // =====================================================
  // Category Selection Handler
  // =====================================================
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // =====================================================
  // Clear Filters
  // =====================================================
  const clearFilters = () => {
    setSearch('');
    setSelectedCategoryId('all');
  };

  // =====================================================
  // Render
  // =====================================================
  return (
    <div
      className="services-page"
      style={{ padding: '2.5rem 0 4rem 0' }}
    >
      <div className="container">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <span className="section-subtitle">
            Service Catalog
          </span>

          <h1
            className="section-title"
            style={{
              fontSize: '2.25rem',
              marginBottom: '0.5rem'
            }}
          >
            Explore Verified Home Services
          </h1>

          <p className="section-desc">
            Browse guaranteed home repair solutions with
            background-checked specialists and transparent rates.
          </p>
        </div>

        {/* SEARCH & CATEGORY FILTER */}
        <div
          className="card mb-8"
          style={{ padding: '1.25rem' }}
        >
          <div className="flex flex-col gap-4">

            {/* Search */}
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search services (e.g. Electrical inspection, leak fix, deep cleaning)..."
            />

            {/* Category Buttons */}
            <div className="flex items-center gap-2 flex-wrap">

              {/* All Services */}
              <button
                type="button"
                className={`btn btn-sm ${
                  selectedCategoryId === 'all'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
                onClick={() => handleCategoryChange('all')}
              >
                All Services
              </button>

              {/* Categories */}
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`btn btn-sm ${
                    selectedCategoryId === cat.id
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  onClick={() =>
                    handleCategoryChange(cat.id)
                  }
                >
                  <span>
                    {cat.icon || '🔧'}
                  </span>

                  <span>
                    {cat.name}
                  </span>
                </button>
              ))}

            </div>
          </div>
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}
        {error && !loading && (
          <EmptyState
            icon="⚠️"
            title="Failed to fetch services"
            description={error}
            action={
              <button
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            }
          />
        )}

        {/* =================================================
            LOADING
        ================================================= */}
        {loading && (
          <LoadingSpinner
            message="Fetching verified services..."
          />
        )}

        {/* =================================================
            NO SERVICES
        ================================================= */}
        {!loading && !error && services.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No services found"
            description="Try searching with different keywords or select a different category."
            action={
              <button
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            }
          />
        )}

        {/* =================================================
            SERVICES GRID
        ================================================= */}
        {!loading && !error && services.length > 0 && (
          <div
            className="grid grid-cols-1"
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};