import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose }) => {
  // Store cart items in state
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  const defaultImage =
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200";

  // Load cart data when the sidebar opens
  useEffect(() => {
    if (isOpen) {
      const savedCart = localStorage.getItem("wn_cart");

      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData);
        } catch (error) {
          console.error("Cart data load failed:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    }
  }, [isOpen]);

  // Remove a property from the cart
  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);

    localStorage.setItem("wn_cart", JSON.stringify(updatedCart));

    setCartItems(updatedCart);
  };

  // Remove all properties from the cart
  const clearCart = () => {
    localStorage.setItem("wn_cart", "[]");

    setCartItems([]);
  };

  // Calculate the total price per night
  const totalPrice = cartItems.reduce((total, item) => {
    return total + (Number(item.price) || 0);
  }, 0);

  const goToListings = () => {
    onClose();
    navigate("/listings");
  };

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      <div className={`cart-sidebar${isOpen ? " open" : ""}`}>
        <div className="cart-header">
          <h5 className="mb-0">
            <i className="fa-solid fa-cart-shopping me-2"></i>
            Your Cart
            {cartItems.length > 0 && (
              <span
                style={{
                  background: "#5ce0c6",
                  color: "#1a1f2e",
                  fontSize: ".7rem",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 50,
                  marginLeft: 8,
                }}
              >
                {cartItems.length}
              </span>
            )}
          </h5>

          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onClose}
            aria-label="Close cart"
          ></button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <i
                className="fa-solid fa-cart-shopping fa-3x mb-3 d-block"
                style={{ color: "#e5e7eb" }}
              ></i>

              <h6 style={{ color: "#9ca3af" }}>Your cart is empty</h6>

              <p
                style={{
                  color: "#d1d5db",
                  fontSize: ".83rem",
                }}
              >
                Add properties to plan your trip!
              </p>

              <button
                type="button"
                onClick={goToListings}
                style={{
                  background: "var(--wn-teal)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 50,
                  padding: "8px 20px",
                  fontSize: ".85rem",
                  cursor: "pointer",
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                <i className="fa-solid fa-compass me-2"></i>
                Explore Stays
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img
                  src={item.images?.[0] || defaultImage}
                  alt={item.name || "Property"}
                  onError={(event) => {
                    event.target.src = defaultImage;
                  }}
                  style={{
                    width: 65,
                    height: 55,
                    objectFit: "cover",
                    borderRadius: 8,
                    flexShrink: 0,
                  }}
                />

                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <p
                    className="mb-0 fw-semibold small"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.name}
                  </p>

                  <small style={{ color: "#9ca3af" }}>
                    <i className="fa-solid fa-location-dot me-1"></i>
                    {item.city}
                  </small>

                  <p className="mb-0 wn-price small">
                    ₹{Number(item.price || 0).toLocaleString()}
                    /night
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name}`}
                  style={{
                    background: "#fee2e2",
                    border: "none",
                    borderRadius: 6,
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="fa-solid fa-trash"
                    style={{
                      color: "#dc2626",
                      fontSize: ".75rem",
                    }}
                  ></i>
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div
              style={{
                background: "#f9fafb",
                borderRadius: 8,
                padding: "12px 14px",
                marginBottom: 12,
              }}
            >
              <div className="d-flex justify-content-between mb-1">
                <span
                  style={{
                    fontSize: ".85rem",
                    color: "#6b7280",
                  }}
                >
                  {cartItems.length}{" "}
                  {cartItems.length > 1 ? "properties" : "property"}
                </span>

                <span
                  style={{
                    fontSize: ".85rem",
                    color: "#6b7280",
                  }}
                >
                  ₹{totalPrice.toLocaleString()}/night
                </span>
              </div>

              <div className="d-flex justify-content-between">
                <strong>Total per night</strong>

                <strong
                  style={{
                    color: "var(--wn-teal)",
                  }}
                >
                  ₹{totalPrice.toLocaleString()}
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={goToListings}
              className="btn wn-btn-primary w-100 mb-2"
            >
              <i className="fa-solid fa-compass me-2"></i>
              Browse More Stays
            </button>

            <button
              type="button"
              onClick={clearCart}
              style={{
                width: "100%",
                background: "transparent",
                border: "1.5px solid #dc2626",
                color: "#dc2626",
                borderRadius: 50,
                padding: "9px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: ".88rem",
              }}
            >
              <i className="fa-solid fa-trash me-2"></i>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
