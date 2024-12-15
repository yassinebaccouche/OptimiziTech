import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import User from '../Controllers/AuthController';  // Import the User class
import { auth } from '../Firebase/Config';  // Firebase auth import

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is signed in
        try {
          // Fetch user data from Firestore using the current user's UID
          const data = await User.getUserData(user.uid);
          if (data) {
            setUserData(data);
          } else {
            navigate('/login');  // Redirect to login if no user data is found
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
          navigate('/login');  // Redirect to login on error
        } finally {
          setLoading(false);  // Set loading to false once data is fetched
        }
      } else {
        // No user is signed in, redirect to login
        navigate('/login');
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Grid container sx={{ padding: 4 }}>
      <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar
          alt="Profile Picture"
          src={userData?.profilePic}  // Ensure this is accessed safely
          sx={{ width: 120, height: 120 }}
        />
      </Grid>
      <Grid item xs={12} sm={8} sx={{ padding: 2 }}>
        <Typography variant="h4" gutterBottom>
          {userData?.email}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Bio:</strong> {userData?.bio}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          <strong>Role:</strong> {userData?.role}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Profile;
