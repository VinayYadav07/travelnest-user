import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, getUsername, clearSession } from "../firebase/firebase.js";
import CartSidebar from "./CartSidebar.jsx";

const Navbar = ({ transparent = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  // Change navbar style when the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Load the latest cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const savedCart = localStorage.getItem("wn_cart");
        const cart = savedCart ? JSON.parse(savedCart) : [];

        setCartCount(cart.length);
      } catch (error) {
        console.error("Cart load failed:", error);
        setCartCount(0);
      }
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, [cartOpen]);

  // Keep the login state updated across browser tabs
  useEffect(() => {
    const checkLogin = () => {
      setLoggedIn(isLoggedIn());
    };

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  // Close the dropdown when clicking outside it
  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest(".user-dropdown-wrap")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Clear the user session and cart during logout
  const logout = () => {
    clearSession();

    localStorage.removeItem("wn_cart");

    setLoggedIn(false);
    setCartCount(0);
    setDropdownOpen(false);
    setMenuOpen(false);

    navigate("/");
  };

  const handleNav = (path) => {
    setMenuOpen(false);
    setDropdownOpen(false);

    navigate(path);
  };

  // Navigate to the listings page with the search text
  const handleSearch = (event) => {
    event.preventDefault();

    const searchText = search.trim();

    if (searchText) {
      handleNav(`/listings?search=${encodeURIComponent(searchText)}`);
    }
  };

  const navClass =
    transparent && !scrolled
      ? "navbar fixed-top wn-navbar"
      : "navbar fixed-top wn-navbar scrolled";

  // Refresh the cart count after closing the cart
  const closeCart = () => {
    setCartOpen(false);

    try {
      const savedCart = localStorage.getItem("wn_cart");
      const cart = savedCart ? JSON.parse(savedCart) : [];

      setCartCount(cart.length);
    } catch (error) {
      console.error("Cart update failed:", error);
      setCartCount(0);
    }
  };

  return (
    <>
      <nav className={navClass} style={{ padding: ".75rem 0" }}>
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" className="wn-logo" onClick={() => setMenuOpen(false)}>
            <i className="fa-solid fa-plane-departure me-2"></i>
            TravelNest
          </Link>

          <form
            className="d-none d-lg-flex"
            style={{
              flex: "0 0 38%",
              maxWidth: 500,
            }}
            onSubmit={handleSearch}
          >
            <div className="wn-searchbar w-100">
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

          <div className="d-none d-lg-flex align-items-center gap-3">
            <span
              className="nav-link text-white"
              style={{ cursor: "pointer" }}
              onClick={() => handleNav("/listings")}
            >
              Explore
            </span>

            <div
              className="position-relative"
              style={{ cursor: "pointer" }}
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <i className="fa-solid fa-cart-shopping text-white fs-5"></i>

              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>

            {loggedIn ? (
              <div
                className="user-dropdown-wrap"
                style={{ position: "relative" }}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: "rgba(255,255,255,.15)",
                    border: "1px solid rgba(255,255,255,.3)",
                    borderRadius: 50,
                    padding: "6px 16px",
                    color: "#fff",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <i className="fa-solid fa-circle-user"></i>

                  <span>{getUsername()}</span>

                  <i
                    className={
                      dropdownOpen
                        ? "fa-solid fa-chevron-up"
                        : "fa-solid fa-chevron-down"
                    }
                    style={{ fontSize: ".7rem" }}
                  ></i>
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "110%",
                      right: 0,
                      background: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,.15)",
                      minWidth: 180,
                      zIndex: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => handleNav("/orders")}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        color: "#1a1f2e",
                        background: "none",
                        border: "none",
                        width: "100%",
                        fontSize: ".88rem",
                        borderBottom: "1px solid #e5e7eb",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <i className="fa-solid fa-clock-rotate-left text-teal"></i>
                      My Bookings
                    </button>

                    <button
                      onClick={logout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        color: "#dc2626",
                        background: "none",
                        border: "none",
                        width: "100%",
                        fontSize: ".88rem",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <i className="fa-solid fa-right-from-bracket"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn wn-btn-outline"
                style={{ cursor: "pointer" }}
                onClick={() => handleNav("/login")}
              >
                Sign In
              </button>
            )}
          </div>

          <div className="d-flex d-lg-none align-items-center gap-3">
            <div
              className="position-relative"
              style={{ cursor: "pointer" }}
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <i className="fa-solid fa-cart-shopping text-white fs-5"></i>

              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              style={{
                background: "rgba(255,255,255,.15)",
                border: "1px solid rgba(255,255,255,.3)",
                borderRadius: 8,
                padding: "6px 12px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              <i
                className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}
              ></i>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            style={{
              background: "var(--wn-dark)",
              borderTop: "1px solid rgba(255,255,255,.1)",
              padding: "12px 0",
            }}
          >
            <div className="container d-flex flex-column gap-1">
              <form onSubmit={handleSearch}>
                <div className="wn-searchbar mb-2">
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

              <button onClick={() => handleNav("/")} className="mobile-nav-btn">
                <i className="fa-solid fa-home me-2"></i>
                Home
              </button>

              <button
                onClick={() => handleNav("/listings")}
                className="mobile-nav-btn"
              >
                <i className="fa-solid fa-compass me-2"></i>
                Explore
              </button>

              {loggedIn ? (
                <>
                  <button
                    onClick={() => handleNav("/orders")}
                    className="mobile-nav-btn"
                  >
                    <i className="fa-solid fa-clock-rotate-left me-2"></i>
                    My Bookings
                  </button>

                  <button
                    onClick={logout}
                    className="mobile-nav-btn logout-btn"
                  >
                    <i className="fa-solid fa-right-from-bracket me-2"></i>
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav("/login")}
                  style={{
                    background: "var(--wn-teal)",
                    border: "none",
                    color: "#fff",
                    padding: "10px 16px",
                    borderRadius: 8,
                    fontSize: "1rem",
                    cursor: "pointer",
                    marginTop: 4,
                  }}
                >
                  <i className="fa-solid fa-right-to-bracket me-2"></i>
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <CartSidebar isOpen={cartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
