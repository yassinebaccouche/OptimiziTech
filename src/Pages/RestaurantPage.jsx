import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/Config"; 
import Restaurant from "../Services/Restaurant"; // Import the Restaurant class
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress
} from "@mui/material";

const AddRestaurantForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [RestoPic, setRestoPic] = useState(null);
  const [RestoPicPreview, setRestoPicPreview] = useState(null); // For previewing the image
  const [locals, setLocals] = useState([]);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // Manage the current step
  const [localInput, setLocalInput] = useState(""); // State for local input

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Cleanup the subscription on unmount
    return unsubscribe;
  }, []);

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setMessage("User not authenticated.");
      return;
    }

    const newRestaurant = new Restaurant(name, address, phone, currentUser.uid, RestoPic, locals);
    
    try {
      await newRestaurant.addRestaurant();
      setMessage("Restaurant added successfully!");
      setCurrentStep(3); // Move to step 3 after successful restaurant addition

      // Update currentUser's isVerified field
      await newRestaurant.updateUserVerification(currentUser.uid);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setRestoPic(file);

    if (file) {
      setRestoPicPreview(URL.createObjectURL(file)); // Generate a temporary URL for preview
    }
  };

  const handleAddLocal = () => {
    if (localInput) {
      setLocals([...locals, localInput]);
      setLocalInput(""); // Clear the input after adding
    }
  };

  // Render the current step content dynamically
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <TextField
              label="Restaurant Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <br/>
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              fullWidth
            
            />
               <br/>
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              fullWidth
            />
          
            
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCurrentStep(2)} // Move to next step when form is filled
              sx={{ mt: 2 }}
            >
              Next
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Upload Restaurant Picture and Add Local
            </Typography>
            {/* Local input as a text field */}
            <TextField
              label="Enter Local Adresse"
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button
              variant="outlined"
              onClick={handleAddLocal}
              sx={{ mb: 2 }}
            >
              Add Local
            </Button>
            <List>
              {locals.map((local, index) => (
                <ListItem key={index}>
                  <ListItemText primary={local} />
                </ListItem>
              ))}
            </List>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddRestaurant}
              sx={{ mt: 2 }}
            >
              Add Restaurant
            </Button>
          </>
        );
      case 3:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="success.main" gutterBottom>
              Restaurant Added Successfully!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setCurrentStep(1)} // Reset to step 1 for another form submission
              sx={{ mt: 2 }}
            >
              Add Another Restaurant
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Section with Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          position: "relative",
          background: `url('./assets/images/lg_image.png') no-repeat center center`,
          backgroundSize: "cover",
          height: "100%",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to bottom right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8))",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
            px: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { xs: "24px", md: "32px" },
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Restaurant Onboarding Process
          </Typography>

          {/* Steps Indicator */}
          {[1, 2, 3].map((step) => (
            <Box
              key={step}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
                opacity: currentStep >= step ? 1 : 0.5, // Highlight completed steps
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: currentStep >= step ? "green" : "white",
                  color: currentStep >= step ? "white" : "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  mr: 2,
                }}
              >
                {step}
              </Box>
              <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "18px" }}>
                {step === 1
                  ? "Enter Restaurant Details"
                  : step === 2
                  ? "Upload Restaurant Picture"
                  : "Add Local and Confirm"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>

      {/* Right Form Section */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: 4,
          height: "100%",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <img
            src={"/assets/images/Logo.png"}
            alt="Optimizi Tech Logo"
            style={{
              height: "50px",
              marginRight: "10px",
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontSize: { xs: "36px", md: "48px" },
              fontWeight: "bold",
              fontFamily: '"Bebas Neue", sans-serif',
              color: "#344054",
            }}
          >
            OPTIMIZI TECH
          </Typography>
        </Box>

        <Typography variant="h4" align="center" gutterBottom>
          Add a Restaurant
        </Typography>

        {/* Display the current step's form */}
        <Box component="form" sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {renderStepContent()}
        </Box>

        {loading && <CircularProgress />}
      </Grid>
    </Grid>
  );
};

export default AddRestaurantForm;
