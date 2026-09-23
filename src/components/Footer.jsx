import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbPush } from "../firebase/firebase.js";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const goToPage = (path) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    navigate(path);
  };

  // Validate the email and save the subscription to Firebase
  const subscribe = async () => {
    const enteredEmail = email.trim();

    if (!enteredEmail || !enteredEmail.includes("@")) {
      setMessage("❌ Please enter a valid email!");
      return;
    }

    try {
      await dbPush("subscribers", {
        email: enteredEmail,
        subscribedAt: new Date().toISOString(),
      });

      setMessage("✅ Thank you! Subscribed successfully!");
      setEmail("");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error("Subscription failed:", error);

      setMessage("❌ Subscription failed. Please try again.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  const linkStyle = {
    color: "rgba(255,255,255,.65)",
    cursor: "pointer",
    fontSize: ".88rem",
    textDecoration: "none",
  };

  return (
    <footer className="wn-footer pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <span
              onClick={() => goToPage("/")}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.3rem",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-plane-departure me-2"></i>
              TravelNest
            </span>

            <p
              style={{
                color: "rgba(255,255,255,.65)",
                fontSize: ".88rem",
                marginTop: 12,
                lineHeight: 1.7,
              }}
            >
              Discover handpicked villas, apartments & houseboats across India.
              Book direct — no hidden fees, no surprises.
            </p>

            <div className="d-flex gap-3 mt-3">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: "1.2rem",
                }}
              >
                <i className="fa-brands fa-instagram"></i>
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: "1.2rem",
                }}
              >
                <i className="fa-brands fa-facebook"></i>
              </a>

              <a
                href="https://www.twitter.com/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: "1.2rem",
                }}
              >
                <i className="fa-brands fa-twitter"></i>
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: "1.2rem",
                }}
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="col-md-2 col-6">
            <h6
              style={{
                color: "#fff",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Explore
            </h6>

            <ul
              className="list-unstyled"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <li>
                <span onClick={() => goToPage("/")} style={linkStyle}>
                  Home
                </span>
              </li>

              <li>
                <span onClick={() => goToPage("/listings")} style={linkStyle}>
                  All Stays
                </span>
              </li>

              <li>
                <span
                  onClick={() => goToPage("/listings?category=Villas")}
                  style={linkStyle}
                >
                  Villas
                </span>
              </li>

              <li>
                <span
                  onClick={() => goToPage("/listings?category=Houseboats")}
                  style={linkStyle}
                >
                  Houseboats
                </span>
              </li>

              <li>
                <span
                  onClick={() => goToPage("/listings?category=Apartments")}
                  style={linkStyle}
                >
                  Apartments
                </span>
              </li>
            </ul>
          </div>

          <div className="col-md-2 col-6">
            <h6
              style={{
                color: "#fff",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Account
            </h6>

            <ul
              className="list-unstyled"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <li>
                <span onClick={() => goToPage("/login")} style={linkStyle}>
                  Sign In
                </span>
              </li>

              <li>
                <span onClick={() => goToPage("/signup")} style={linkStyle}>
                  Register
                </span>
              </li>

              <li>
                <span onClick={() => goToPage("/orders")} style={linkStyle}>
                  My Bookings
                </span>
              </li>
            </ul>
          </div>

          <div className="col-md-4">
            <h6
              style={{
                color: "#fff",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Contact Us
            </h6>

            <ul
              className="list-unstyled"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <li
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: ".88rem",
                }}
              >
                <i
                  className="fa-solid fa-envelope me-2"
                  style={{ color: "#5ce0c6" }}
                ></i>
                support@travelnest.com
              </li>

              <li
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: ".88rem",
                }}
              >
                <i
                  className="fa-solid fa-phone me-2"
                  style={{ color: "#5ce0c6" }}
                ></i>
                +91 98765 43210
              </li>

              <li
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: ".88rem",
                }}
              >
                <i
                  className="fa-solid fa-location-dot me-2"
                  style={{ color: "#5ce0c6" }}
                ></i>
                Mumbai, Maharashtra, India
              </li>
            </ul>

            <div className="mt-3">
              <p
                style={{
                  color: "rgba(255,255,255,.65)",
                  fontSize: ".82rem",
                  marginBottom: 8,
                }}
              >
                Subscribe for best deals:
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      subscribe();
                    }
                  }}
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,.1)",
                    border: "1px solid rgba(255,255,255,.2)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: "#fff",
                    fontSize: ".83rem",
                    outline: "none",
                  }}
                />

                <button
                  type="button"
                  onClick={subscribe}
                  style={{
                    background: "#0f6b5c",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: ".83rem",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Subscribe
                </button>
              </div>

              {message && (
                <p
                  style={{
                    color: message.includes("✅") ? "#5ce0c6" : "#f87171",
                    fontSize: ".8rem",
                    marginTop: 8,
                    marginBottom: 0,
                  }}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(0,0,0,.15)",
            borderTop: "1px solid rgba(255,255,255,.18)",
            padding: "20px 15px",
            marginTop: 8,
          }}
        >
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: ".85rem",
                  margin: 0,
                }}
              >
                © 2025 TravelNest. All rights reserved.
              </p>
            </div>

            <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
              <span
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: ".85rem",
                  marginRight: 18,
                  cursor: "pointer",
                }}
              >
                Privacy Policy
              </span>

              <span
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: ".85rem",
                  marginRight: 18,
                  cursor: "pointer",
                }}
              >
                Terms of Service
              </span>

              <span
                style={{
                  color: "rgba(255,255,255,.7)",
                  fontSize: ".85rem",
                  cursor: "pointer",
                }}
              >
                Refund Policy
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
