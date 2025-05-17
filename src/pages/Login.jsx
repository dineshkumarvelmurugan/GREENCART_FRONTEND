import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    address: '',
    mobile: '',
    password: ''
  });

  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning('');
    setSuccess('');

    if (isSignup) {
      try {
        const res = await axios.post('http://localhost:5000/api/users/signup', formData);
        setSuccess('✅ Signup successful! Please login.');
        setTimeout(() => setSuccess(''), 3000);
        setIsSignup(false);
        setFormData({ username: '', email: '', address: '', mobile: '', password: '' });
      } catch (err) {
        if (err.response && err.response.data?.message) {
          setWarning(`⚠️ ${err.response.data.message}`);
        } else {
          setWarning('⚠️ Signup failed. Please try again.');
        }
      }
    } else {
      try {
        const res = await axios.post('http://localhost:5000/api/users/login', {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate('/');
      } catch (err) {
        console.error(err);
        setWarning(
          err.response?.data?.message
            ? `⚠️ ${err.response.data.message}`
            : '⚠️ Login failed. Please check your credentials.'
        );
      }
    }
  };

  return (
    <div className="login-page">
      <h2>{isSignup ? 'Sign Up' : 'Login'} 🌿</h2>

      {success && <div className="success-message">{success}</div>}
      {warning && <div className="warning-message">{warning}</div>}

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        {isSignup && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Home Address"
              required
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              required
              value={formData.mobile}
              onChange={handleChange}
            />
          </>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
      </form>

      <p className="toggle-auth">
        {isSignup ? 'Already have an account?' : 'Don’t have an account?'}{' '}
        <span
          onClick={() => {
            setWarning('');
            setSuccess('');
            setIsSignup(!isSignup);
          }}
        >
          {isSignup ? 'Login here' : 'Sign up here'}
        </span>
      </p>
      
    </div>
  );
}

export default Login;
