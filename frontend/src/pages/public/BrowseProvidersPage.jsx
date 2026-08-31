import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { providerService } from '../../services/providerService';
import { locationService } from '../../services/locationService';
import { categoryService } from '../../services/categoryService';
import { ProviderCard } from '../../components/provider/ProviderCard';
import { MapView } from '../../components/map/MapView';
import { LoadingSpinner, EmptyState } from '../../components/common/FeedbackStates';
import {
  Columns,
  List,
  Map,
  RotateCcw,
  Search,
  ShieldCheck,
  MapPin,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  ArrowUpDown,
} from 'lucide-react';

export const BrowseProvidersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchService, setSearchService] = useState(initialSearch);
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minRating, setMinRating] = useState('0');
  const [maxPrice, setMaxPrice] = useState('2000');
  const [distanceRadius, setDistanceRadius] = useState('25');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(true);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'price_asc' | 'price_desc' | 'experience'

  // View Mode State
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
        const combinedSearch = [searchService, searchLocation].filter(Boolean).join(' ');

        const [provs, locs] = await Promise.all([
          providerService.getProviders({
            search: combinedSearch,
            category: selectedCategory,
            minRating: Number(minRating) > 0 ? minRating : undefined,
            maxPrice: Number(maxPrice) < 2000 ? maxPrice : undefined,
            onlyAvailable,
            verifiedOnly,
          }),
          locationService.getProviderLocations({
            service: selectedCategory,
            verifiedOnly,
            search: combinedSearch,
          })
        ]);

        // Client-side sorting
        let sorted = [...provs];
        if (sortBy === 'rating') {
          sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === 'price_asc') {
          sorted.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
        } else if (sortBy === 'price_desc') {
          sorted.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
        } else if (sortBy === 'experience') {
          sorted.sort((a, b) => (b.experience || 0) - (a.experience || 0));
        }

        setProviders(sorted);
        setLocations(locs);
      } finally {
        setLoading(false);
      }
    };

    fetchProvidersAndLocations();
  }, [searchService, searchLocation, selectedCategory, minRating, maxPrice, distanceRadius, onlyAvailable, verifiedOnly, sortBy]);

  const handleClearFilters = () => {
    setSearchService('');
    setSearchLocation('');
    setSelectedCategory('');
    setMinRating('0');
    setMaxPrice('2000');
    setDistanceRadius('25');
    setOnlyAvailable(false);
    setVerifiedOnly(true);
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="browse-page" style={{ padding: '2rem 0 3.5rem 0' }}>
      <div className="container">
        
        {/* Header */}
        <div className="mb-6">
          <span className="section-subtitle">Verified Service Directory</span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neutral-900)', margin: '0 0 4px 0' }}>
            Find Trusted Professionals Near You
          </h1>
          <p className="text-sm text-muted">
            Verified service providers near your location with background checks and upfront rates.
          </p>
        </div>

        {/* Top Dual Search Toolbar: What service? Where? */}
        <div className="card mb-6" style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--white)' }}>
          <div className="flex flex-wrap items-center gap-3">
            {/* What service input */}
            <div style={{ flex: '1 1 260px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)', display: 'flex', alignItems: 'center' }}>
                <Search size={16} />
              </div>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '36px' }}
                placeholder="What service? (e.g. Electrician, AC Repair)"
                value={searchService}
                onChange={(e) => setSearchService(e.target.value)}
              />
            </div>

            {/* Where input */}
            <div style={{ flex: '1 1 220px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-400)', display: 'flex', alignItems: 'center' }}>
                <MapPin size={16} />
              </div>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '36px' }}
                placeholder="Where? (e.g. Mumbai, Thane, Andheri)"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '0.625rem 1.25rem' }}
            >
              <span>Search</span>
            </button>

            <button
              type="button"
              className="btn btn-light text-xs flex items-center gap-1"
              onClick={handleClearFilters}
              title="Reset all search & filter options"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Main Content: Left Filter Sidebar + Right Results */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(250px, 280px) minmax(0, 1fr)',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="browse-layout-grid"
        >
          {/* LEFT FILTER SIDEBAR */}
          <aside className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--white)' }}>
            <div className="flex items-center justify-between pb-3 mb-4 border-bottom" style={{ borderBottom: '1px solid var(--neutral-200)' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <SlidersHorizontal size={16} color="var(--primary-700)" />
                <span>Filters</span>
              </h4>
              <button
                type="button"
                onClick={handleClearFilters}
                style={{ background: 'none', border: 'none', color: 'var(--primary-700)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {/* Service Type */}
              <div className="form-group mb-0">
                <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--neutral-500)' }}>
                  Service Type
                </label>
                <select
                  className="form-control"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Service Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Minimum Rating */}
              <div className="form-group mb-0">
                <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--neutral-500)' }}>
                  Minimum Rating
                </label>
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === '4.5'}
                      onChange={() => setMinRating('4.5')}
                    />
                    <span className="flex items-center gap-1 font-semibold">
                      <Star size={13} fill="#F59E0B" color="#F59E0B" /> 4.5+ Rating
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === '4.0'}
                      onChange={() => setMinRating('4.0')}
                    />
                    <span className="flex items-center gap-1 font-semibold">
                      <Star size={13} fill="#F59E0B" color="#F59E0B" /> 4.0+ Rating
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={minRating === '0'}
                      onChange={() => setMinRating('0')}
                    />
                    <span>Any Rating</span>
                  </label>
                </div>
              </div>

              {/* Distance Radius */}
              <div className="form-group mb-0">
                <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--neutral-500)' }}>
                  Distance Range
                </label>
                <select
                  className="form-control"
                  value={distanceRadius}
                  onChange={(e) => setDistanceRadius(e.target.value)}
                >
                  <option value="2">Within 2 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km (Metro Area)</option>
                </select>
              </div>

              {/* Price Range Slider */}
              <div className="form-group mb-0">
                <div className="flex items-center justify-between mb-1">
                  <label className="form-label mb-0" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--neutral-500)' }}>
                    Max Starting Fee
                  </label>
                  <span className="text-xs font-bold text-primary">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{ width: '100%' }}
                />
                <div className="flex justify-between text-2xs text-muted mt-1">
                  <span>₹200</span>
                  <span>₹2000+</span>
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="flex flex-col gap-2 pt-2 border-top" style={{ borderTop: '1px solid var(--neutral-200)' }}>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyAvailable}
                    onChange={(e) => setOnlyAvailable(e.target.checked)}
                  />
                  <span>Available Now</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                  />
                  <span style={{ color: 'var(--success-700)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <ShieldCheck size={13} />
                    Verified Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* RIGHT RESULTS AREA */}
          <div>
            {/* Top Toolbar: Count + Sort + View Toggles */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4 bg-white p-3 rounded-lg border" style={{ backgroundColor: 'var(--white)', border: '1px solid var(--neutral-200)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span className="text-sm font-bold" style={{ color: 'var(--neutral-900)' }}>
                  {providers.length} professionals found near you
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 text-xs">
                  <ArrowUpDown size={13} color="var(--neutral-500)" />
                  <span className="text-muted">Sort:</span>
                  <select
                    className="form-control"
                    style={{ height: '32px', fontSize: '12px', padding: '2px 8px', width: '140px' }}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="rating">Best Rated</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="experience">Experience</option>
                  </select>
                </div>

                {/* View Toggles */}
                <div className="flex items-center gap-1" style={{ borderLeft: '1px solid var(--neutral-200)', paddingLeft: '8px' }}>
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === 'split' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setViewMode('split')}
                    title="Split List and Map"
                    style={{ padding: '4px 8px' }}
                  >
                    <Columns size={13} />
                    <span className="hidden sm:inline">Split</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                    style={{ padding: '4px 8px' }}
                  >
                    <List size={13} />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-light'}`}
                    onClick={() => setViewMode('map')}
                    title="Map View"
                    style={{ padding: '4px 8px' }}
                  >
                    <Map size={13} />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Content Results */}
            {loading ? (
              <LoadingSpinner message="Locating verified professionals in your area..." />
            ) : providers.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No verified providers match your filters"
                description="Try relaxing your radius, clearing keyword filters, or choosing a different trade category."
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

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="flex flex-col gap-4">
                    {providers.map((p) => (
                      <ProviderCard
                        key={p.id}
                        provider={p}
                        onSelectOnMap={(id) => { setSelectedProviderId(id); setViewMode('split'); }}
                      />
                    ))}
                  </div>
                )}

                {/* Map View */}
                {viewMode === 'map' && (
                  <div style={{ height: '650px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--neutral-200)' }}>
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

      </div>
    </div>
  );
};
