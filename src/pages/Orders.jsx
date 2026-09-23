import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import { getUid, dbGet } from "../firebase/firebase.js";

const BOOKING_STATUS = {
  pending: {
    label: "Pending Approval",
    className: "badge-pending",
    icon: "fa-clock",
  },
  approved: {
    label: "Confirmed",
    className: "badge-approved",
    icon: "fa-circle-check",
  },
  rejected: {
    label: "Rejected",
    className: "badge-rejected",
    icon: "fa-circle-xmark",
  },
};

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=300";

const Orders = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      const userId = getUid();

      let bookingList = [];

      try {
        const bookingData = await dbGet("bookings");

        if (bookingData) {
          bookingList = Object.entries(bookingData).map(
            ([bookingId, booking]) => ({
              id: bookingId,
              ...booking,
            }),
          );

          // Show only bookings belonging to the logged-in user.
          bookingList = bookingList.filter(
            (booking) => booking.userId === userId,
          );
        }
      } catch (error) {
        console.log("Firebase fetch failed:", error.message);

        try {
          const savedBookings = localStorage.getItem("wn_bookings");

          bookingList = savedBookings ? JSON.parse(savedBookings) : [];

          bookingList = bookingList.filter(
            (booking) => booking.userId === userId,
          );
        } catch (storageError) {
          console.log("Local bookings load failed:", storageError);

          bookingList = [];
        }
      }

      // Keep the newest booking at the top.
      bookingList.sort(
        (firstBooking, secondBooking) =>
          new Date(secondBooking.bookedAt) - new Date(firstBooking.bookedAt),
      );

      setBookings(bookingList);
      setLoading(false);
    };

    loadBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            My Bookings
          </h1>

          <p
            className="mb-0"
            style={{
              color: "rgba(255,255,255,.6)",
            }}
          >
            Track all your reservations
          </p>
        </div>
      </div>

      <div className="container py-5 flex-grow-1">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border wn-spinner"></div>

            <p className="text-muted mt-3">Loading your bookings...</p>
          </div>
        )}

        {!loading && bookings.length === 0 && (
          <div className="text-center py-5">
            <i className="fa-solid fa-calendar-xmark fa-3x text-muted mb-3 d-block"></i>

            <h5>No bookings yet</h5>

            <p className="text-muted">
              Explore properties and make your first booking!
            </p>

            <Link to="/listings" className="btn wn-btn-primary mt-2">
              <i className="fa-solid fa-plane-departure me-2"></i>
              Explore Stays
            </Link>
          </div>
        )}

        {!loading &&
          bookings.length > 0 &&
          bookings.map((booking) => {
            const bookingStatus =
              BOOKING_STATUS[booking.status] || BOOKING_STATUS.pending;

            return (
              <div key={booking.id} className="order-card">
                <div className="d-flex flex-column flex-md-row">
                  <img
                    src={booking.listingImage || FALLBACK_IMAGE}
                    alt={booking.listingName}
                    onError={(event) => {
                      event.target.src = FALLBACK_IMAGE;
                    }}
                    className="d-none d-md-block"
                    style={{
                      width: 160,
                      objectFit: "cover",
                    }}
                  />

                  <div className="p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                      <div>
                        <h5 className="mb-1">{booking.listingName}</h5>

                        <p className="text-muted small mb-1">
                          <i className="fa-solid fa-location-dot me-1"></i>
                          {booking.city}
                          &nbsp;·&nbsp;
                          <i className="fa-solid fa-tag me-1"></i>
                          {booking.listingCategory}
                        </p>
                      </div>

                      <span className={bookingStatus.className}>
                        <i
                          className={`fa-solid ${bookingStatus.icon} me-1`}
                        ></i>

                        {bookingStatus.label}
                      </span>
                    </div>

                    <div className="row g-2 mt-2">
                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Check-in</small>

                        <strong>{formatDate(booking.checkIn)}</strong>
                      </div>

                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Check-out</small>

                        <strong>{formatDate(booking.checkOut)}</strong>
                      </div>

                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Duration</small>

                        <strong>
                          {booking.nights}{" "}
                          {booking.nights > 1 ? "nights" : "night"}
                        </strong>
                      </div>

                      <div className="col-6 col-md-3">
                        <small className="text-muted d-block">Guests</small>

                        <strong>
                          {booking.guests}{" "}
                          {booking.guests === 1 ? "Guest" : "Guests"}
                        </strong>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <div>
                        <small className="text-muted">Total Paid</small>

                        <div className="wn-price fs-5">
                          ₹{Number(booking.totalPrice || 0).toLocaleString()}
                        </div>
                      </div>

                      <div className="text-end">
                        <small className="text-muted d-block">Booked on</small>

                        <small>{formatDate(booking.bookedAt)}</small>
                      </div>
                    </div>

                    {booking.status === "pending" && (
                      <div className="alert alert-warning py-2 mt-2 small mb-0">
                        <i className="fa-solid fa-info-circle me-1"></i>
                        Awaiting admin approval. We'll notify you soon.
                      </div>
                    )}

                    {booking.status === "approved" && (
                      <div className="alert alert-success py-2 mt-2 small mb-0">
                        <i className="fa-solid fa-circle-check me-1"></i>
                        Booking confirmed! Have a wonderful stay.
                      </div>
                    )}

                    {booking.status === "rejected" && (
                      <div className="alert alert-danger py-2 mt-2 small mb-0">
                        <i className="fa-solid fa-circle-xmark me-1"></i>
                        Booking was rejected. Please try another property.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <Footer />
    </div>
  );
};

export default Orders;
