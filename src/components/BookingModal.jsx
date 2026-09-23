import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dbPush, getUid, getUsername } from "../firebase/firebase.js";

const BookingModal = ({ listing, onClose }) => {
  const navigate = useNavigate();

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(2);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Calculate the number of nights
  let numberOfNights = 0;

  if (checkInDate && checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const difference = checkOut - checkIn;
    const oneDay = 1000 * 60 * 60 * 24;

    numberOfNights = Math.round(difference / oneDay);
  }

  const pricePerNight = Number(listing?.price) || 0;
  const totalPrice = numberOfNights * pricePerNight;
  const maxGuests = Number(listing?.maxGuests) || 10;

  const confirmBooking = async () => {
    // Check login before booking
    const userId = getUid();

    if (!userId) {
      alert("Please login before booking.");
      navigate("/login");
      return;
    }

    // Validate booking dates
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      alert("Check-out must be after check-in.");
      return;
    }

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter your address.");
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      alert("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (numberOfGuests < 1 || numberOfGuests > maxGuests) {
      alert(`Maximum ${maxGuests} guests are allowed.`);
      return;
    }

    if (pricePerNight <= 0) {
      alert("This property does not have a valid price.");
      return;
    }

    setIsLoading(true);

    // Prepare booking data
    const bookingData = {
      userId: userId,
      userName: getUsername() || "",

      customerName: fullName.trim(),
      customerAddress: address.trim(),
      customerPhone: cleanPhone,

      listingId: listing.id,
      listingName: listing.name,
      listingImage: listing.images?.[0] || "",
      listingCategory: listing.category,
      city: listing.city,

      checkIn: checkInDate,
      checkOut: checkOutDate,

      nights: numberOfNights,
      guests: numberOfGuests,

      pricePerNight: pricePerNight,
      totalPrice: totalPrice,

      status: "pending",
      bookedAt: new Date().toISOString(),
    };

    try {
      // Save booking to Firebase
      await dbPush("bookings", bookingData);

      const savedBookings = localStorage.getItem("wn_bookings");

      let bookings = [];

      if (savedBookings) {
        bookings = JSON.parse(savedBookings);
      }

      bookings.push(bookingData);

      localStorage.setItem("wn_bookings", JSON.stringify(bookings));

      alert("Booking placed! Awaiting admin approval.");

      onClose();
      navigate("/orders");
    } catch (error) {
      console.error("Booking failed:", error);

      alert("Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{
        background: "rgba(0,0,0,.6)",
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-content rounded-4 border-0">
          <div
            className="modal-header"
            style={{
              background: "#087f6d",
              color: "#fff",
            }}
          >
            <h5 className="modal-title fw-bold">
              <i className="fa-solid fa-calendar-check me-2"></i>
              Book Your Stay
            </h5>

            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Check-in Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={checkInDate}
                  onChange={(event) => setCheckInDate(event.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Check-out Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={checkOutDate}
                  onChange={(event) => setCheckOutDate(event.target.value)}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">
                  Number of Guests
                </label>

                <select
                  className="form-select"
                  value={numberOfGuests}
                  onChange={(event) =>
                    setNumberOfGuests(Number(event.target.value))
                  }
                >
                  {Array.from({ length: maxGuests }, (_, index) => {
                    const guest = index + 1;

                    return (
                      <option key={guest} value={guest}>
                        {guest} {guest === 1 ? "Guest" : "Guests"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Your Full Name</label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Your Address</label>

              <textarea
                className="form-control"
                rows="3"
                placeholder="House No., Street, City, PIN Code"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phone Number</label>

              <input
                type="tel"
                className="form-control"
                placeholder="Enter phone number"
                maxLength={10}
                value={phoneNumber}
                onChange={(event) => {
                  const value = event.target.value.replace(/\D/g, "");
                  setPhoneNumber(value);
                }}
              />

              <small className="text-muted">
                Enter 10-digit Indian mobile number
              </small>
            </div>

            {numberOfNights > 0 && (
              <div
                className="rounded-3 p-3 mt-3"
                style={{
                  background: "#f5f7f8",
                }}
              >
                <div className="d-flex justify-content-between">
                  <span>
                    ₹{pricePerNight.toLocaleString()} × {numberOfNights}{" "}
                    {numberOfNights === 1 ? "night" : "nights"}
                  </span>

                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>

                <hr className="my-2" />

                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>

                  <span style={{ color: "#087f6d" }}>
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn wn-btn-primary"
              onClick={confirmBooking}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Booking...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-circle-check me-2"></i>
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
