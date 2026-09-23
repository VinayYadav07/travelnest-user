import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import ListingCard from "../components/ListingCard.jsx";

import { fetchListings, fetchCategories } from "../firebase/firebase.js";

const CATEGORY_ICONS = {
  Villa: "fa-house",
  Houseboat: "fa-sailboat",
  Apartment: "fa-building",
  Cottage: "fa-tree",
  Camp: "fa-campground",
};

const CATEGORY_COLORS = {
  Villa: "#1a6b5c",
  Houseboat: "#0e4d7c",
  Apartment: "#5c3d7c",
  Cottage: "#7c4a1e",
  Camp: "#7c6b1e",
};

const CITIES = [
  {
    name: "Goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400",
    properties: 12,
  },
  {
    name: "Mumbai",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400",
    properties: 8,
  },
  {
    name: "Manali",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    properties: 6,
  },
  {
    name: "Udaipur",
    image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=400",
    properties: 9,
  },
  {
    name: "Alleppey",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400",
    properties: 5,
  },
  {
    name: "Jaisalmer",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400",
    properties: 4,
  },
];

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    city: "Mumbai",
    rating: 5,
    text: "Amazing experience! The villa in Goa was exactly as described. Booked directly, no hidden charges. Will definitely use TravelNest again!",
    avatar: "RS",
  },
  {
    name: "Priya Nair",
    city: "Bangalore",
    rating: 5,
    text: "The houseboat in Alleppey was a dream come true. Easy booking process and the admin approved our booking within minutes!",
    avatar: "PN",
  },
  {
    name: "Amit Verma",
    city: "Delhi",
    rating: 4,
    text: "Great platform! Found a beautiful cottage in Manali at the best price. The booking modal is super easy to use.",
    avatar: "AV",
  },
  {
    name: "Sneha Patel",
    city: "Ahmedabad",
    rating: 5,
    text: "TravelNest is my go-to for travel stays. The filter options helped me find exactly what I wanted within my budget.",
    avatar: "SP",
  },
];

const Home = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [propertyCount, setPropertyCount] = useState(1);
  const [showTopButton, setShowTopButton] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let countTimer;

    const loadData = async () => {
      try {
        const listingData = await fetchListings();
        const categoryData = await fetchCategories();

        setListings(listingData);
        setCategories(categoryData);

        // Animate the property count from 1 to the actual listing count
        let currentCount = 1;
        const targetCount = Math.max(listingData.length, 1);

        countTimer = setInterval(() => {
          currentCount = Math.min(
            currentCount + Math.ceil(targetCount / 40),
            targetCount,
          );

          setPropertyCount(currentCount);

          if (currentCount >= targetCount) {
            clearInterval(countTimer);
          }
        }, 120);
      } catch (error) {
        console.log("Data loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Show the scroll-to-top button after scrolling down
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (countTimer) {
        clearInterval(countTimer);
      }
    };
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();

    const searchValue = search.trim();

    if (searchValue) {
      navigate(`/listings?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar transparent />

      <section className="wn-hero d-flex align-items-center">
        <div className="hero-overlay"></div>

        <div
          className="container position-relative text-center text-white"
          style={{ zIndex: 2 }}
        >
          <p
            style={{
              letterSpacing: ".18em",
              fontSize: ".78rem",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.75)",
            }}
          >
            Curated Stays Worldwide
          </p>

          <h1 className="hero-title">
            Find a Place
            <br />
            That Feels Like <span className="hero-accent">Home</span>
          </h1>

          <p className="hero-sub mx-auto mt-2" style={{ maxWidth: 540 }}>
            Handpicked villas, apartments & houseboats — book direct, no hidden
            fees.
          </p>

          <form
            className="d-lg-none mx-auto mt-4"
            style={{ maxWidth: 460 }}
            onSubmit={handleSearch}
          >
            <div className="wn-searchbar">
              <i className="fa-solid fa-magnifying-glass me-2"></i>

              <input
                type="text"
                placeholder="Where do you want to go?"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <button type="submit">Search</button>
            </div>
          </form>

          <div className="d-flex justify-content-center gap-5 mt-5">
            <div>
              <span className="stat-num">{propertyCount}+</span>
              <span className="stat-label">Properties</span>
            </div>

            <div>
              <span className="stat-num">50+</span>
              <span className="stat-label">Cities</span>
            </div>

            <div>
              <span className="stat-num">4.9★</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 wn-bg-sand">
        <div className="container">
          <h2 className="section-heading">Browse by Category</h2>

          <div className="categories-track">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/listings?category=${encodeURIComponent(category.name)}`}
                className="cat-chip"
              >
                <div
                  className="cat-chip-icon"
                  style={{
                    background: CATEGORY_COLORS[category.name] || "#1a6b5c",
                  }}
                >
                  <i
                    className={`fa-solid ${
                      CATEGORY_ICONS[category.name] || "fa-bed"
                    }`}
                  ></i>
                </div>

                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <h2 className="section-heading mb-1">Popular Cities</h2>

          <p className="text-muted mb-4">
            Explore top destinations across India
          </p>

          <div className="row g-3">
            {CITIES.map((city, index) => (
              <div
                key={city.name}
                className={`col-6 ${index < 2 ? "col-md-4" : "col-md-2"}`}
              >
                <div
                  onClick={() =>
                    navigate(
                      `/listings?search=${encodeURIComponent(city.name)}`,
                    )
                  }
                  style={{
                    position: "relative",
                    borderRadius: 12,
                    overflow: "hidden",
                    height: index < 2 ? 200 : 140,
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 60%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: 12,
                    }}
                  >
                    <h6
                      style={{
                        color: "#fff",
                        margin: 0,
                        fontWeight: 700,
                      }}
                    >
                      {city.name}
                    </h6>

                    <small
                      style={{
                        color: "rgba(255,255,255,.7)",
                      }}
                    >
                      {city.properties} properties
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 wn-bg-sand">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-heading mb-0">Featured Stays</h2>

            <Link
              to="/listings"
              className="text-teal text-decoration-none fw-semibold"
            >
              View all
              <i className="fa-solid fa-arrow-right ms-1"></i>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border wn-spinner"></div>
            </div>
          ) : (
            <div className="row g-4">
              {listings
                .filter((listing) => listing.available !== false)
                .slice(0, 6)
                .map((listing, index) => (
                  <div key={listing.id} className="col-md-6 col-xl-4">
                    <ListingCard listing={listing} index={index} />
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-5" style={{ background: "#f8f9fa" }}>
        <div className="container">
          <h2 className="section-heading text-center mb-5">Why TravelNest?</h2>

          <div className="row g-4">
            {[
              {
                icon: "fa-shield-halved",
                title: "Verified Properties",
                description:
                  "Every listing is manually reviewed before going live.",
              },
              {
                icon: "fa-tags",
                title: "Best Price Guarantee",
                description: "Book direct — no markups, no hidden charges.",
              },
              {
                icon: "fa-headset",
                title: "24/7 Support",
                description: "Our team is always a message away.",
              },
            ].map((feature) => (
              <div key={feature.title} className="col-md-4 text-center">
                <div className="why-icon">
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>

                <h5 className="mt-3 fw-semibold">{feature.title}</h5>

                <p className="text-muted small">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 wn-bg-sand">
        <div className="container">
          <h2 className="section-heading text-center mb-1">
            What Our Guests Say
          </h2>

          <p className="text-muted text-center mb-5">
            Real experiences from real travellers
          </p>

          <div className="row g-4">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.name} className="col-md-6 col-xl-3">
                <div
                  style={{
                    background: "#fff",
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: "0 4px 24px rgba(0,0,0,.07)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  <div>
                    {Array.from(
                      {
                        length: testimonial.rating,
                      },
                      (_, index) => (
                        <i
                          key={index}
                          className="fa-solid fa-star text-warning me-1"
                          style={{
                            fontSize: ".85rem",
                          }}
                        ></i>
                      ),
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: ".88rem",
                      color: "#4b5563",
                      lineHeight: 1.7,
                      flex: 1,
                    }}
                  >
                    "{testimonial.text}"
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--wn-teal)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: ".85rem",
                      }}
                    >
                      {testimonial.avatar}
                    </div>

                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 700,
                          fontSize: ".88rem",
                        }}
                      >
                        {testimonial.name}
                      </p>

                      <small
                        style={{
                          color: "#9ca3af",
                        }}
                      >
                        {testimonial.city}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {showTopButton && (
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--wn-teal)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,.2)",
            fontSize: "1.1rem",
            zIndex: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className="fa-solid fa-arrow-up"></i>
        </button>
      )}
    </div>
  );
};

export default Home;
