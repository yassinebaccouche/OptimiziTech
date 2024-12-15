import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Grid, Card,Button, Typography, Box, Avatar } from '@mui/material';
import { FaCoins, FaMoneyBillWave, FaReceipt, FaPercentage, FaFileInvoiceDollar, FaExclamationCircle, FaUserTie, FaChartBar } from 'react-icons/fa';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase/Config';  // Firebase auth import
import { signOut } from 'firebase/auth';


// Sample data for charts and statistics
const data = [
  { name: 'January', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'February', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'March', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'April', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'June', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'July', uv: 3490, pv: 4300, amt: 2100 },
];

// Sample statistics data
const statsData = [
  { title: 'Total CA', value: '20000 TND', icon: <FaCoins style={{ color: "gold" }} /> },
  { title: 'Total des achats HTVA', value: '1500 TND', icon: <FaMoneyBillWave style={{ color: "green" }} /> },
  { title: 'Total des achats TTC', value: '1600 TND', icon: <FaReceipt style={{ color: "teal" }} /> },
  { title: 'TVA déductible', value: '2000 TND', icon: <FaPercentage style={{ color: "purple" }} /> },
  { title: 'TVA collectée', value: '150 TND', icon: <FaFileInvoiceDollar style={{ color: "darkorange" }} /> },
  { title: 'Factures non payées', value: '300 TND', icon: <FaExclamationCircle style={{ color: "red" }} /> },
  { title: 'Charges salariales', value: '2000 TND', icon: <FaUserTie style={{ color: "blue" }} /> },
  { title: 'Global FoodCost', value: '1020 TND', icon: <FaChartBar style={{ color: "navy" }} /> },
];

// Sample suppliers and partners data
const fournisseursData = [
  { name: 'Ben Yaghlan', status: 'Payed', image: 'assets/img/BenYaghlen.png' },
  { name: 'Monoprix', status: 'Payed', image: 'assets/img/monoprix.png' },
  { name: 'Legumes', status: '300TND Not Payed', image: 'assets/img/Tomate.png' },
  { name: 'Farine', status: 'Payed', image: 'assets/img/farine.png' },
  { name: 'Boisson', status: '30TND Not Payed', image: 'assets/img/boissons-gazeuses.jpg' },
  { name: 'Electricité', status: '3000TND Not Payed', image: 'assets/img/steg.png' },
];

const partnersData = [
  { name: 'Jumia', contribution: '5,000 TND', image: 'assets/img/Jumia.png' },
  { name: 'Sodexo', contribution: '3,000 TND', image: 'assets/img/Sodexo.png' },
  { name: 'pluxee', contribution: '2,000 TND', image: 'assets/img/Pluxee.png' },
  { name: 'Glovo', contribution: '4,000 TND', image: 'assets/img/Glovo.png' },
];

function DashboardAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user and token from storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const storedToken = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      // Sign out from Firebase authentication
      await signOut(auth);
      
      // Clear user and token data from local and session storage
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('userToken');
  
      // Redirect to the login page
      navigate('/');  
    } catch (error) {
      console.error("Logout failed: ", error.message);
    }
  };
  

  const cardStyles = {
    padding: 2,
    boxShadow: 3,
    borderRadius: 2,
    backgroundColor: '#fff',
    '&:hover': {
      boxShadow: 6,
      transform: 'scale(1.05)',
      transition: 'all 0.3s ease-in-out',
    },
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Top Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" color="text.primary" fontWeight="bold">Bonjour, {user ? user.username : 'Loading...'}!</Typography>
        <Typography variant="body1" color="text.secondary">Voici un aperçu de votre entreprise.</Typography>
      </Box>

      {/* Logout Button */}
      <Box sx={{ mb: 4 }}>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </Box>

      {/* Statistics Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={cardStyles}>
              <Box sx={{ mr: 2 }}>
                <Typography variant="h4">{stat.icon}</Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="text.primary">{stat.title}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.value}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sales Overview Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
            Aperçu des ventes <MdTrendingUp style={{ color: 'green', marginLeft: 1 }} />
          </Typography>
          <Card sx={cardStyles}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="pv" fill="#8884d8" />
                <Bar dataKey="uv" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
            Tendance des bénéfices <MdTrendingDown style={{ color: 'red', marginLeft: 1 }} />
          </Typography>
          <Card sx={cardStyles}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Suppliers Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>Fournisseurs</Typography>
        <Grid container spacing={3}>
          {fournisseursData.map((supplier, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={cardStyles}>
                <Avatar src={supplier.image} sx={{ width: 60, height: 60, marginRight: 2 }} />
                <Box>
                  <Typography variant="h6">{supplier.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{supplier.status}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Partners Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>Partenaires</Typography>
        <Grid container spacing={3}>
          {partnersData.map((partner, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={cardStyles}>
                <Avatar src={partner.image} sx={{ width: 60, height: 60, marginRight: 2 }} />
                <Box>
                  <Typography variant="h6">{partner.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{partner.contribution}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default DashboardAdmin;
