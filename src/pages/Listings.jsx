import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ListingCard from "../components/ListingCard.jsx";

import { fetchListings, fetchCategories } from "../firebase/firebase.js";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("All");
  const [maximumPrice, setMaximumPrice] = useState(20000);
  const [sortOption, setSortOption] = useState("default");
  const [searchText, setSearchText] = useState("");

  const [searchParams] = useSearchParams();

  // Load listings and categories from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        const listingData = await fetchListings();
        const categoryData = await fetchCategories();

        setListings(listingData);
        setCategories(categoryData);
      } catch (error) {
        console.log("Data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Read category and search values from the URL
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");

    setActiveCategory(urlCategory || "All");
    setSearchText(urlSearch || "");
  }, [searchParams]);

  // Apply availability, category, price, and search filters
  let filteredListings = listings.filter((listing) => {
    if (listing.available === false) {
      return false;
    }

    if (activeCategory !== "All" && listing.category !== activeCategory) {
      return false;
    }

    const propertyPrice = Number(listing.price) || 0;

    if (propertyPrice > maximumPrice) {
      return false;
    }

    const searchValue = searchText.toLowerCase().trim();

    if (searchValue) {
      const propertyName = listing.name?.toLowerCase() || "";
      const propertyCity = listing.city?.toLowerCase() || "";

      const nameMatches = propertyName.includes(searchValue);
      const cityMatches = propertyCity.includes(searchValue);

      if (!nameMatches && !cityMatches) {
        return false;
      }
    }

    return true;
  });

  // Sort filtered properties by price or name
  if (sortOption === "price_asc") {
    filteredListings = [...filteredListings].sort(
      (firstListing, secondListing) => {
        const firstPrice = Number(firstListing.price) || 0;
        const secondPrice = Number(secondListing.price) || 0;

        return firstPrice - secondPrice;
      },
    );
  }

  if (sortOption === "price_desc") {
    filteredListings = [...filteredListings].sort(
      (firstListing, secondListing) => {
        const firstPrice = Number(firstListing.price) || 0;
        const secondPrice = Number(secondListing.price) || 0;

        return secondPrice - firstPrice;
      },
    );
  }

  if (sortOption === "name_asc") {
    filteredListings = [...filteredListings].sort(
      (firstListing, secondListing) => {
        const firstName = firstListing.name || "";
        const secondName = secondListing.name || "";

        return firstName.localeCompare(secondName);
      },
    );
  }

  const resetFilters = () => {
    setActiveCategory("All");
    setMaximumPrice(20000);
    setSortOption("default");
    setSearchText("");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div
        style={{
          background: "linear-gradient(135deg,#0a4a40,#1a4e8c)",
          color: "#fff",
          paddingTop: 90,
          paddingBottom: 32,
        }}
      >
        <div className="container">
          <h1
            style={{
              fontFamily: "'Playfair Display',serif",
            }}
          >
            Explore All Stays
          </h1>

          <p
            className="mb-0"
            style={{
              color: "rgba(255,255,255,.6)",
            }}
          >
            Discover handpicked properties across India
          </p>
        </div>
      </div>

      <div className="container py-5 flex-grow-1">
        <div className="row g-4">
          <div className="col-lg-3">
            <div
              style={{
                position: "sticky",
                top: 80,
              }}
            >
              <div className="filter-bar">
                <h6 className="fw-bold mb-3">
                  <i className="fa-solid fa-sliders me-2 text-teal"></i>
                  Filters
                </h6>

                <label className="form-label small fw-semibold">Category</label>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {["All", ...categories.map((category) => category.name)].map(
                    (categoryName) => (
                      <button
                        key={categoryName}
                        className={`wn-filter-btn ${
                          activeCategory === categoryName ? "active" : ""
                        }`}
                        onClick={() => setActiveCategory(categoryName)}
                      >
                        {categoryName}
                      </button>
                    ),
                  )}
                </div>

                <label className="form-label small fw-semibold">
                  Max Price / night
                </label>

                <input
                  type="range"
                  className="form-range"
                  min={500}
                  max={20000}
                  step={100}
                  value={maximumPrice}
                  onChange={(event) =>
                    setMaximumPrice(Number(event.target.value))
                  }
                />

                <div className="d-flex justify-content-between">
                  <small>₹500</small>

                  <small className="fw-semibold text-teal">
                    ₹{maximumPrice.toLocaleString()}
                  </small>
                </div>

                <label className="form-label small fw-semibold mt-3">
                  Sort by
                </label>

                <select
                  className="form-select form-select-sm"
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                >
                  <option value="default">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name A–Z</option>
                </select>

                {(activeCategory !== "All" ||
                  maximumPrice !== 20000 ||
                  sortOption !== "default" ||
                  searchText.trim()) && (
                  <button
                    className="btn btn-sm btn-outline-secondary w-100 mt-3"
                    onClick={resetFilters}
                  >
                    <i className="fa-solid fa-rotate-left me-1"></i>
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="d-lg-none mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or city..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </div>

            <p className="text-muted small mb-3">
              <strong>{filteredListings.length}</strong>{" "}
              {filteredListings.length === 1 ? "property" : "properties"} found
            </p>

            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border wn-spinner"></div>

                <p className="text-muted mt-3">Loading properties...</p>
              </div>
            )}

            {!loading && filteredListings.length === 0 && (
              <div className="text-center py-5 text-muted">
                <i className="fa-solid fa-face-sad-tear fa-2x mb-3 d-block"></i>

                <h5>No properties match your filters</h5>

                <p className="small">Try changing your search or filters.</p>
              </div>
            )}

            {!loading && filteredListings.length > 0 && (
              <div className="row g-4">
                {filteredListings.map((listing, index) => (
                  <div key={listing.id} className="col-md-6 col-xl-4">
                    <ListingCard listing={listing} index={index} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Listings;
