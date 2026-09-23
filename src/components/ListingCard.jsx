import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing, index = 0 }) => {
  const navigate = useNavigate();

  const [isWished, setIsWished] = useState(false);

  const defaultImage =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600";

  const propertyImage = listing.images?.[0] || defaultImage;

  // Generate a rating based on the property ID
  const getRating = (listingId) => {
    if (!listingId || listingId.length < 2) {
      return "4.5";
    }

    const rating = 4 + (listingId.charCodeAt(1) % 10) / 10;

    return rating.toFixed(1);
  };

  const rating = getRating(listing.id);

  // Load wishlist status from localStorage
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("wn_wishlist");

      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist);

        setIsWished(wishlist.includes(listing.id));
      }
    } catch (error) {
      console.error("Wishlist load failed:", error);
      setIsWished(false);
    }
  }, [listing.id]);

  // Add or remove the property from the wishlist
  const toggleWishlist = (event) => {
    event.stopPropagation();

    try {
      const savedWishlist = localStorage.getItem("wn_wishlist");

      let wishlist = [];

      if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
      }

      let updatedWishlist;

      if (isWished) {
        updatedWishlist = wishlist.filter((id) => id !== listing.id);
      } else {
        updatedWishlist = [...wishlist, listing.id];
      }

      localStorage.setItem("wn_wishlist", JSON.stringify(updatedWishlist));

      setIsWished(!isWished);
    } catch (error) {
      console.error("Wishlist update failed:", error);
    }
  };

  const openListing = () => {
    navigate(`/listing/${listing.id}`);
  };

  return (
    <div
      className="wn-card card-animate"
      style={{
        animationDelay: `${index * 0.07}s`,
      }}
      onClick={openListing}
      role="button"
      aria-label={`View ${listing.name}`}
    >
      <div className="wn-card-img-wrap">
        <img
          src={propertyImage}
          alt={listing.name}
          className="wn-card-img"
          loading="lazy"
          onError={(event) => {
            event.target.src = defaultImage;
          }}
        />

        <span className="wn-badge-cat">{listing.category}</span>

        {listing.available === false && (
          <span className="wn-badge-na">Unavailable</span>
        )}

        <button
          onClick={toggleWishlist}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(255,255,255,.9)",
            border: "none",
            borderRadius: "50%",
            width: 34,
            height: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,.15)",
          }}
        >
          <i
            className={isWished ? "fa-solid fa-heart" : "fa-regular fa-heart"}
            style={{
              color: isWished ? "#e53e3e" : "#9ca3af",
              fontSize: ".9rem",
            }}
          ></i>
        </button>
      </div>

      <div className="wn-card-body">
        <h5 className="wn-card-title">{listing.name}</h5>

        <p className="wn-card-loc">
          <i className="fa-solid fa-location-dot me-1"></i>
          {listing.city}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div>
            <span className="wn-price">
              ₹{(Number(listing.price) || 0).toLocaleString()}
            </span>

            <span className="text-muted small"> / night</span>
          </div>

          <div style={{ fontSize: ".78rem" }}>
            {[...Array(Math.floor(parseFloat(rating)))].map((_, starIndex) => (
              <i key={starIndex} className="fa-solid fa-star text-warning"></i>
            ))}

            <span className="ms-1 small text-muted">{rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
