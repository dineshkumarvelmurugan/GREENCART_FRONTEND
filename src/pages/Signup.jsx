import { useState } from 'react';
import axios from 'axios';
import './User.css';

function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    address: '',
    mobile: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/signup', form);
      alert('Signup successful!');
    } catch (err) {
      alert('Signup failed');
      console.error(err);
    }
  };

  return (
    <div className="form-container">
      <h2>User Signup</h2>
      <form onSubmit={handleSignup}>
        <input name="username" placeholder="Username" onChange={handleChange} required />
        <input name="email" placeholder="Email" onChange={handleChange} required />
        <input name="address" placeholder="Home Address" onChange={handleChange} required />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
