import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import DomainFilter from "../components/DomainFilter";
import OpportunityCard from "../components/OpportunityCard";
import SkeletonCard from "../components/SkeletonCard";
import EmptyState from "../components/EmptyState";
import API from "../services/api";
import useDebounce from "../hooks/useDebounce";

const DEFAULT_DOMAINS = [
  "Web Development",
  "Data Science",
  "Design",
  "Marketing",
  "Cloud Computing",
  "Product Management",
];

const OpportunityList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [availableDomains, setAvailableDomains] = useState(DEFAULT_DOMAINS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("All");

  // Debounce search query by 350ms to prevent excessive API calls
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Fetch opportunities whenever debouncedSearch or selectedDomain changes
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchOpportunities = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {};
        if (debouncedSearch && debouncedSearch.trim() !== "") {
          params.search = debouncedSearch.trim();
        }
        if (selectedDomain && selectedDomain !== "All") {
          params.domain = selectedDomain;
        }

        const response = await API.get("/opportunities", {
          params,
          signal: controller.signal,
        });

        if (isMounted) {
          const data = Array.isArray(response.data) ? response.data : [];
          setOpportunities(data);

          // Dynamically collect any new domains from backend response
          if (data.length > 0) {
            setAvailableDomains((prev) => {
              const combined = new Set(prev);
              data.forEach((item) => {
                if (item.domain && item.domain.trim()) {
                  combined.add(item.domain.trim());
                }
              });
              return Array.from(combined);
            });
          }
        }
      } catch (err) {
        // Ignore aborted requests caused by fast user typing
        if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
          return;
        }
        if (isMounted) {
          const errMsg =
            err.response?.data?.message ||
            (err.code === "ERR_NETWORK"
              ? "Cannot connect to backend server on port 5000. Please ensure the backend server is running."
              : "Unable to load opportunities at this time.");
          setError(errMsg);
          setOpportunities([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchOpportunities();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [debouncedSearch, selectedDomain]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDomain("All");
  };

  const handleRetry = () => {
    // Re-trigger by toggling domain or state
    setSelectedDomain((prev) => (prev === "All" ? "All" : prev));
  };

  return (
    <div className="page-container">
      {/* Hero Section with Pastel Gradient (Lavender to Pink) */}
      <section className="hero-pastel-section" aria-labelledby="hero-title">
        <div className="hero-content">
          <div className="hero-pill-badge">
            <span role="img" aria-label="sparkles">
              ✨
            </span>
            <span>Real-time Opportunities Portal</span>
          </div>

          <h1 id="hero-title" className="hero-main-title">
            Find Your <span className="hero-gradient-text">Next Opportunity</span>
          </h1>

          <p className="hero-description-subtitle">
            Explore active internships and career opportunities directly loaded from our verified database.
          </p>

          {/* Large Rounded Search Bar with real-time debounced query */}
          <div className="hero-search-wrapper">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by job title, company, skills, or location..."
            />
          </div>
        </div>
      </section>

      {/* Domain Filter Chips + Dropdown */}
      <section aria-label="Domain Filters">
        <DomainFilter
          domains={availableDomains}
          selectedDomain={selectedDomain}
          onSelectDomain={setSelectedDomain}
        />
      </section>

      {/* Results Metadata Bar */}
      <div className="results-meta-bar">
        <div className="results-count">
          {loading ? (
            <span>Fetching opportunities...</span>
          ) : error ? (
            <span style={{ color: "var(--accent-rose)" }}>Connection error</span>
          ) : (
            <span>
              Showing <strong>{opportunities.length}</strong>{" "}
              {opportunities.length === 1 ? "opportunity" : "opportunities"}
              {selectedDomain !== "All" && ` in ${selectedDomain}`}
              {debouncedSearch && ` for "${debouncedSearch}"`}
            </span>
          )}
        </div>

        <div className="results-actions">
          {(searchQuery || selectedDomain !== "All") && (
            <button
              type="button"
              className="btn-reset-filter"
              onClick={handleResetFilters}
            >
              Reset filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <section aria-label="Opportunities Listings">
        {loading ? (
          // Skeleton Loaders while fetching
          <div
            className="opportunities-grid"
            aria-busy="true"
            aria-label="Loading opportunities from database"
          >
            {Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : error ? (
          // Friendly Error State
          <EmptyState
            icon="⚠️"
            title="Unable to load opportunities"
            message={error}
            actionText="Try Again"
            onAction={handleRetry}
          />
        ) : opportunities.length > 0 ? (
          // Responsive Grid of Opportunity Cards
          <div className="opportunities-grid">
            {opportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id || opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        ) : (
          // Friendly Empty State when search or filter returns no results
          <EmptyState
            icon="🔎"
            title="No opportunities found"
            message={
              debouncedSearch || selectedDomain !== "All"
                ? `No opportunities matched ${
                    selectedDomain !== "All" ? `domain "${selectedDomain}"` : ""
                  }${
                    debouncedSearch && selectedDomain !== "All" ? " and " : ""
                  }${
                    debouncedSearch ? `keyword "${debouncedSearch}"` : ""
                  }. Try adjusting your keywords or clearing the filters.`
                : "There are currently no active opportunities listed in the database."
            }
            actionText="Clear All Filters"
            onAction={handleResetFilters}
          />
        )}
      </section>
    </div>
  );
};

export default OpportunityList;
