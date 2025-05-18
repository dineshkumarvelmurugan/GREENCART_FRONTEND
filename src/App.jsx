import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Plants from './pages/Plants';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import AddPlant from './pages/AddPlant';
import EditPlant from './pages/EditPlant';
import Login from './pages/Login';
import UserDetails from './components/AllUsers';
import Checkout from './components/Checkout';
import MyOrdersPage from './pages/MyOrders';
import EditProfile from './pages/EditProfile';
import AdminDashboard from './pages/AdminDashboard'; 

import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingUser(false);
  }, []);

  const isAdmin = user?.isAdmin;

  if (loadingUser) return <div>Loading...</div>;

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/myorders" element={<MyOrdersPage />} />
        <Route path="/plants" element={<Plants />} />
        <Route path="/contact" element={<Contact />} />

        {!isAdmin && user && (
          <>
            <Route path="/cart" element={<Cart />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </>
        )}

        {isAdmin && user && (
          <>
            <Route path="/add-plant" element={<AddPlant />} />
            <Route path="/edit-plant" element={<EditPlant />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ Route added */}
          </>
        )}
      </Routes>

      <Footer />
    </>
  );
}

export default App;

