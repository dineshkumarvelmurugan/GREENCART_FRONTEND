import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">Green Cart</div>

      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/plants">Plants</Link></li>
          <li><Link to="/contact">Contact</Link></li>

          {user && !isAdmin && (
            <>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/myorders">My Orders</Link></li>
              <li><Link to="/edit-profile">Edit Profile</Link></li>
            </>
          )}

          {user && isAdmin && (
            <>
              <li><Link to="/admin-dashboard">Dashboard</Link></li> {/* ✅ Added Admin Dashboard */}
              <li><Link to="/add-plant">Add Plant</Link></li>
              <li><Link to="/myorders">All Orders</Link></li>
              <li><Link to="/user-details">User Details</Link></li>
            </>
          )}

          {!user ? (
            <li><Link to="/login">Login</Link></li>
          ) : (
            <>
              <li style={{ color: "#3b7d3b" }}>
                Hello, {isAdmin ? "Admin" : user.username} 👋
              </li>
              <li
                style={{ cursor: 'pointer', color: 'red' }}
                onClick={handleLogout}
              >
                Logout
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
