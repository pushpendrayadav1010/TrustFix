import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { locationService } from '../../services/locationService';
import { categoryService } from '../../services/categoryService';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { MapView } from '../../components/map/MapView';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import { Columns, List, Map, RotateCcw, Search, ShieldCheck } from 'lucide-react';

export const BrowseProvidersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minRating, setMinRating] = useState('0');
  const [maxPrice, setMaxPrice] = useState('2000');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(true);

  // Map / View Mode State
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'list' | 'map'
  const [selectedProviderId, setSelectedProviderId] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      const cats = await categoryService.getCategories();
      setCategories(cats);
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchProvidersAndLocations = async () => {
      setLoading(true);
      try {
        const [provs, locs] = await Promise.all([
          providerService.getProviders({
            search,
            category: selectedCategory,
            minRating: Number(minRating) > 0 ? minRating : undefined,
            maxPrice: Number(maxPrice) < 2000 ? maxPrice : undefined,
            onlyAvailable,
            verifiedOnly,
          }),
          locationService.getProviderLocations({
            service: selectedCategory,
            verifiedOnly,
          })
        ]);
        setProviders(provs);
        setLocations(locs);
      } finally {
        setLoading(false);
      }
    };

    fetchProvidersAndLocations();
  }, [search, selectedCategory, minRating, maxPrice, onlyAvailable, verifiedOnly]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setMinRating('0');
    setMaxPrice('2000');
    setOnlyAvailable(false);
    setVerifiedOnly(false);
    setSearchParams({});
  };

  return (
    <div className="browse-page" style={{ padding: '2rem 0 3rem 0' }}>
      <div className="container">
        
        {/* Header & View Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <span className="section-subtitle">Verified Directory</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--neutral-900)', margin: 0 }}>
              Find Local Home Service Providers
            </h1>
            <p className="text-xs text-muted">
              Showing <strong>{providers.length}</strong> background-verified technicians in Mumbai & Thane
            </p>
          </div>

          {/* Toggle View Mode (List vs Map vs Split) */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-md border" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-300)', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'split' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setViewMode('split')}
              title="Split List and Map"
            >
              <Columns size={14} />
              <span>Split View</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setViewMode('list')}
              title="List Only"
            >
              <List size={14} />
              <span>List</span>
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-light'}`}
              onClick={() => setViewMode('map')}
              title="Map Only"
            >
              <Map size={14} />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="card mb-6" style={{ padding: '1rem 1.25rem' }}>
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Search */}
            <div style={{ flex: '1 1 240px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search provider, skill, locality (e.g. Thane, Rajesh)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Category Select */}
            <div style={{ flex: '1 1 180px' }}>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div style={{ flex: '1 1 140px' }}>
              <select
                className="form-control"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              >
                <option value="0">All Ratings</option>
                <option value="4.5">4.5 & Above</option>
                <option value="4.8">4.8 & Above</option>
                <option value="4.9">4.9 & Above</option>
              </select>
            </div>

            {/* Price Max */}
            <div className="flex items-center gap-2" style={{ flex: '1 1 180px' }}>
              <span className="text-xs text-muted whitespace-nowrap">Max: ₹{maxPrice}</span>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Checkbox toggles */}
            <div className="flex items-center gap-4 text-xs font-semibold" style={{ flex: '1 1 200px' }}>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                <span>Available Now</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
                <span style={{ color: 'var(--success-700)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={12} /> Verified Only
                </span>
              </label>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-light text-xs flex items-center gap-1"
              onClick={handleClearFilters}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Content Section: Split, List, or Map */}
        {loading ? (
          <LoadingSpinner message="Locating providers in your area..." />
        ) : providers.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No verified providers match your filters"
            description="Try resetting some filters or searching for another home service category."
            action={
              <button className="btn btn-primary" onClick={handleClearFilters}>
                Reset All Filters
              </button>
            }
          />
        ) : (
          <div>
            {/* Split View */}
            {viewMode === 'split' && (
              <div className="discovery-container split-view">
                <div className="discovery-list-col flex flex-col gap-4">
                  {providers.map((p) => (
                    <ProviderCard
                      key={p.id}
                      provider={p}
                      isSelected={selectedProviderId === p.id}
                      onSelectOnMap={(id) => setSelectedProviderId(id)}
                    />
                  ))}
                </div>

                <div className="discovery-map-col">
                  <MapView
                    locations={locations}
                    selectedProviderId={selectedProviderId}
                    onSelectProvider={(id) => setSelectedProviderId(id)}
                    height="100%"
                  />
                </div>
              </div>
            )}

            {/* List Only */}
            {viewMode === 'list' && (
              <div className="providers-grid">
                {providers.map((p) => (
                  <ProviderCard
                    key={p.id}
                    provider={p}
                    onSelectOnMap={(id) => { setSelectedProviderId(id); setViewMode('split'); }}
                  />
                ))}
              </div>
            )}

            {/* Map Only */}
            {viewMode === 'map' && (
              <div style={{ height: '650px' }}>
                <MapView
                  locations={locations}
                  selectedProviderId={selectedProviderId}
                  onSelectProvider={(id) => setSelectedProviderId(id)}
                  height="100%"
                />
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
