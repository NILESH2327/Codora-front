import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Heart, MapPin, ChevronDown, Plus, Loader2 } from 'lucide-react';
import { CommodityCard } from '../components/CommodityCard';
import { getJSON } from '../api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

/* ---------------- Header ---------------- */
const Header = ({ searchValue, onSearchChange, searching }) => (
  <header className="bg-white shadow-sm border-b sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Commodities"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Search commodities"
          />
        </div>
      </div>
      <Link to={'create-requirement'} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Sell / Buy
      </Link>
    </div>
  </header>
);

/* ---------------- Sidebar ---------------- */
const Sidebar = ({
  filters,
  onFilterChange,
  expandedCategories,
  toggleCategory,
  t
}) => (
  <aside className="w-64 bg-white border-r p-6 overflow-y-auto">
    <h3 className="font-semibold text-lg mb-4">{t('filters.title')}</h3>

    {/* Buyer/Seller Filter */}
    <div className="mb-6">
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 text-gray-400"
          checked={filters.type === 'sell'}
          onChange={(e) => onFilterChange('type', e.target.checked ? 'sell' : '')}
        />
        <span className="text-gray-700">{t('filters.sellers')}</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-green-600"
          checked={filters.type === 'buy'}
          onChange={(e) => onFilterChange('type', e.target.checked ? 'buy' : '')}
        />
        <span className="text-gray-900 font-medium">{t('filters.buyers')}</span>
      </label>
    </div>

    {/* Category Filter */}
    <div className="mb-6">
      <h4 className="font-semibold mb-3">{t('filters.category')}</h4>
      {['Fruits', 'Grains', 'Nuts & Dry Fruits', 'Oil & Oilseeds', 'Others', 'Pulses', 'Spices', 'Sweeteners', 'Vegetables'].map((category) => (
        <button
          key={category}
          onClick={() => toggleCategory(category)}
          className="flex items-center gap-2 w-full text-left py-1.5 text-gray-700 hover:text-gray-900"
        >
          <Plus className={`w-4 h-4 transition-transform ${expandedCategories.includes(category) ? 'rotate-45' : ''}`} />
          <span>{category}</span>
        </button>
      ))}
    </div>

    {/* Verification Badges */}
    <div className="mb-6">
      <label className="flex items-center gap-2 mb-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4" />
        <span className="text-gray-700">{t('filters.kyc')}</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4" />
        <span className="text-gray-700">{t('filters.trusted')}</span>
      </label>
    </div>

    {/* Price Range */}
    <div className="mb-6">
      <h4 className="font-semibold mb-3">{t('filters.priceRange')}</h4>
      <div className="flex gap-2 mb-3">
        <input
          type="number"
          placeholder={t('filters.min')}
          className="w-20 px-2 py-1 border border-gray-300 rounded"
          value={filters.minPrice || ''}
          onChange={(e) => onFilterChange('minPrice', e.target.value || '')}
        />
        -
        <input
          type="number"
          placeholder={t('filters.max')}
          className="w-20 px-2 py-1 border border-gray-300 rounded"
          value={filters.maxPrice || ''}
          onChange={(e) => onFilterChange('maxPrice', e.target.value || '')}
        />
      </div>
    </div>
  </aside>
);

/* ---------------- Main ---------------- */
const CommodityMarketplace = () => {
  const { t } = useLanguage();

  // filters state
  const [filters, setFilters] = useState({
    type: 'buy', // default to buyers
    product: '',
    variety: '',
    location: '',
    buyingFrequency: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  const [expandedCategories, setExpandedCategories] = useState([]);
  const [sortByLocal, setSortByLocal] = useState('latest');
  const [favorites, setFavorites] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // search debounce
  const [searchInput, setSearchInput] = useState(filters.product || '');
  const searchDebounceRef = useRef(null);

  // update backend filters when sort changes
  const updateSortFilters = useCallback((sortValue) => {
    switch (sortValue) {
      case 'price-low':
        setFilters(prev => ({ ...prev, sortBy: 'price', sortOrder: 'asc' }));
        setSortByLocal('price-low');
        break;
      case 'price-high':
        setFilters(prev => ({ ...prev, sortBy: 'price', sortOrder: 'desc' }));
        setSortByLocal('price-high');
        break;
      default:
        setFilters(prev => ({ ...prev, sortBy: 'date', sortOrder: 'desc' }));
        setSortByLocal('latest');
    }
  }, []);

  // Fetch data from backend
  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const queryParams = {
        ...filters,
        page,
        limit: filters.limit,
        ...(filters.minPrice && { minPrice: Number(filters.minPrice) }),
        ...(filters.maxPrice && { maxPrice: Number(filters.maxPrice) })
      };

      const response = await getJSON('/requirements', queryParams);
      // expected response: { success, data, totalPages, page }
      if (response?.success) {
        setItems(response.data || []);
        setTotalPages(response.totalPages || 0);
        setCurrentPage(response.page || page);
      } else {
        setItems([]);
        setTotalPages(0);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch requirements:', error);
      setItems([]);
      setTotalPages(0);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Filter change handler
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  }, []);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle favorite toggle
  const handleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // debounce search input -> update filters.product
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, product: searchInput, page: 1 }));
    }, 350);

    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Fetch data on mount and whenever filters change
  useEffect(() => {
    // when filters change (including product update), fetch page 1
    fetchData(1);
  }, [fetchData]);

  // Handle pagination
  const goToPage = (page) => {
    fetchData(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searching={loading}
      />

      <div className="flex max-w-7xl mx-auto">
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          expandedCategories={expandedCategories}
          toggleCategory={toggleCategory}
          t={t}
        />

        <main className="flex-1 p-6">
          {/* Header with sorting and stats */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('leads.title')}</h1>
              <p className="text-gray-500 mt-1">
                {t('leads.showing', { count: items.length, total: Math.max(totalPages * filters.limit, items.length) })}
              </p>
            </div>
            <div className="relative">
              <select
                value={sortByLocal}
                onChange={(e) => updateSortFilters(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                disabled={loading}
              >
                <option value="latest">{t('sort.latest')}</option>
                <option value="price-low">{t('sort.priceLow')}</option>
                <option value="price-high">{t('sort.priceHigh')}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-600 mr-2" />
              <span>{t('messages.loading')}</span>
            </div>
          ) : (
            <>
              {/* Results grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {items.map((commodity) => (
                  <CommodityCard
                    key={commodity._id || commodity.id}
                    commodity={commodity}
                    onFavorite={handleFavorite}
                    isFavorite={favorites.includes(commodity._id || commodity.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => goToPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1 || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('pagination.prev')}
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    {t('pagination.pageInfo', { current: currentPage, total: totalPages })}
                  </span>
                  <button
                    onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('pagination.next')}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CommodityMarketplace;
