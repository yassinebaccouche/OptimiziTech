import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase/Config"; // Ensure that you import your Firebase config
import Auth from "./Pages/Auth";
import Profile from "./Pages/UserProfile";
import DashboardAdmin from "./Pages/HomePage";
import AddRestaurantForm from "./Pages/RestaurantPage";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup the subscription on unmount
    return unsubscribe;
  }, []);

  // If loading, show a loading message or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Routes>
          {/* Authentication Page */}
          <Route path="/" element={currentUser ? <Navigate to="/AddResto" /> : <Auth />} />
          
          {/* Dashboard Page, protected route */}
          <Route
            path="/Home"
            element={currentUser ? <DashboardAdmin /> : <Navigate to="/" />}
          />
        <Route
            path="/AddResto"
            element={currentUser ? <AddRestaurantForm /> : <Navigate to="/" />}
          />
          {/* Profile Page, another protected route */}
          <Route
            path="/profile"
            element={currentUser ? <Profile /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
