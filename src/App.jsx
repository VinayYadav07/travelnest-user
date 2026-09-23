import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import Detail from "./pages/Detail.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Orders from "./pages/Orders.jsx";

// Protect pages that require user login
const ProtectedRoute = ({ children }) => {
  const loginToken = localStorage.getItem("wn_token");

  if (loginToken) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/listings" element={<Listings />} />

      <Route path="/listing/:id" element={<Detail />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
