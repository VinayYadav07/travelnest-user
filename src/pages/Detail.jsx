import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import BookingModal from "../components/BookingModal.jsx";
import ListingCard from "../components/ListingCard.jsx";

import { fetchListings, isLoggedIn } from "../firebase/firebase.js";

const AMENITIES = [
  "Free WiFi",
  "Air Conditioning",
  "Kitchen",
  "Parking",
  "Hot Water",
  "24/7 Support",
];

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const listings = await fetchListings();

        // Find the property using the ID from the URL
        const property = listings.find((item) => item.id === id);

        setListing(property || null);

        if (property) {
          const sameCategory = listings.filter(
            (item) => item.id !== id && item.category === property.category,
          );

          const otherProperties = listings.filter(
            (item) => item.id !== id && item.category !== property.category,
          );

          // Show same-category properties first, then other properties
          const similarProperties = [...sameCategory, ...otherProperties];

          setSimilarListings(similarProperties.slice(0, 3));
        }
      } catch (error) {
        console.log("Property loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const addToCart = () => {
    try {
      const savedCart = localStorage.getItem("wn_cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

      // Prevent adding the same property multiple times
      const propertyAlreadyInCart = cart.find((item) => item.id === listing.id);

      if (propertyAlreadyInCart) {
        alert("Already in cart!");
        return;
      }

      cart.push(listing);

      localStorage.setItem("wn_cart", JSON.stringify(cart));

      alert(`${listing.name} added to cart!`);
    } catch (error) {
      console.error("Cart update failed:", error);
      alert("Unable to add property to cart.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <div className="text-center" style={{ paddingTop: 120 }}>
          <div className="spinner-border wn-spinner"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <div className="container text-center py-5 mt-5">
          <h4>Property not found.</h4>

          <Link to="/listings" className="btn wn-btn-primary mt-3">
            Back to Listings
          </Link>
        </div>

        <Footer />
      </div>
    );
  }

  const images = listing.images || [];

  let rating = 4.5;

  if (listing.id && listing.id.length > 1) {
    rating = 4 + (listing.id.charCodeAt(1) % 10) / 10;
  }

  const finalRating = rating.toFixed(1);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <div style={{ paddingTop: 72 }}></div>

      <div className="container py-4 flex-grow-1">
        <nav className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/listings" className="text-teal text-decoration-none">
                Listings
              </Link>
            </li>

            <li className="breadcrumb-item active">{listing.name}</li>
          </ol>
        </nav>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="detail-gallery mb-4">
              <div className="main-img">
                <img
                  src={
                    images[0] ||
                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"
                  }
                  alt={listing.name}
                  onClick={() => {
                    if (images[0]) {
                      setSelectedImage(images[0]);
                    }
                  }}
                />
              </div>

              {images[1] && (
                <div className="sub-img">
                  <img
                    src={images[1]}
                    alt={listing.name}
                    onClick={() => setSelectedImage(images[1])}
                  />
                </div>
              )}

              {images[2] && (
                <div className="sub-img">
                  <img
                    src={images[2]}
                    alt={listing.name}
                    onClick={() => setSelectedImage(images[2])}
                  />
                </div>
              )}
            </div>

            <span
              className="wn-badge-cat d-inline-block mb-2"
              style={{ position: "static" }}
            >
              {listing.category}
            </span>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {listing.name}
            </h1>

            <p className="text-muted">
              <i className="fa-solid fa-location-dot me-2"></i>
              {listing.city} – PIN: {listing.pincode}
            </p>

            <div className="mb-3">
              {Array.from({ length: Math.floor(rating) }, (_, index) => (
                <i key={index} className="fa-solid fa-star text-warning"></i>
              ))}

              <span className="ms-2 text-muted small">
                {finalRating} (42 reviews)
              </span>
            </div>

            <hr />

            <h5>About this property</h5>

            <p className="text-muted">{listing.description}</p>

            <h5 className="mt-4">Amenities</h5>

            <div className="mb-4">
              {AMENITIES.map((amenity) => (
                <span key={amenity} className="amenity-chip">
                  <i className="fa-solid fa-check text-teal me-1"></i>
                  {amenity}
                </span>
              ))}
            </div>

            <h5>Location</h5>

            <div
              className="bg-light rounded-3 d-flex align-items-center justify-content-center"
              style={{ height: 160 }}
            >
              <p className="text-muted text-center mb-0">
                <i className="fa-solid fa-map-location-dot fa-2x d-block mb-2"></i>
                {listing.city}, PIN: {listing.pincode}
              </p>
            </div>
          </div>

          <div className="col-lg-4">
            <div
              style={{
                position: "sticky",
                top: 90,
              }}
            >
              <div className="border rounded-3 p-4 shadow-sm">
                <div className="detail-price mb-1">
                  ₹{(Number(listing.price) || 0).toLocaleString()}
                  <span
                    className="text-muted fw-normal"
                    style={{ fontSize: "1rem" }}
                  >
                    /night
                  </span>
                </div>

                {listing.available === false ? (
                  <div className="alert alert-danger py-2 small mt-2">
                    Not available currently.
                  </div>
                ) : (
                  <>
                    <button
                      className="btn wn-btn-primary w-100 py-3 mt-3 mb-2"
                      onClick={() => {
                        // Require login before opening the booking modal
                        if (!isLoggedIn()) {
                          navigate("/login");
                          return;
                        }

                        setShowBooking(true);
                      }}
                    >
                      <i className="fa-solid fa-calendar-check me-2"></i>
                      Book Now
                    </button>

                    <button
                      className="btn btn-outline-secondary w-100 mb-2"
                      onClick={addToCart}
                    >
                      <i className="fa-solid fa-cart-shopping me-2"></i>
                      Add to Cart
                    </button>
                  </>
                )}

                <hr />

                <ul className="list-unstyled small text-muted mb-0">
                  <li className="mb-1">
                    <i className="fa-solid fa-shield-halved me-2 text-teal"></i>
                    Verified property
                  </li>

                  <li className="mb-1">
                    <i className="fa-solid fa-money-bill-wave me-2 text-teal"></i>
                    No hidden charges
                  </li>

                  <li>
                    <i className="fa-solid fa-headset me-2 text-teal"></i>
                    24/7 support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {similarListings.length > 0 && (
          <div className="mt-5">
            <h4
              className="mb-1"
              style={{
                fontFamily: "'Playfair Display', serif",
              }}
            >
              You Might Also Like
            </h4>

            <p className="text-muted small mb-4">
              More handpicked stays for you
            </p>

            <div className="row g-4">
              {similarListings.map((item, index) => (
                <div key={item.id} className="col-md-4">
                  <ListingCard listing={item} index={index} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />

      {showBooking && (
        <BookingModal listing={listing} onClose={() => setShowBooking(false)} />
      )}

      {selectedImage && (
        <div
          className="modal show d-block"
          style={{
            background: "rgba(0,0,0,.9)",
          }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content bg-transparent border-0">
              <div className="modal-body text-center p-2">
                <img
                  src={selectedImage}
                  alt="Property"
                  style={{
                    maxHeight: "88vh",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
