import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './AddPlant.css';

function EditPlant() {
  const { state } = useLocation();
  const plant = state?.plant;

  const [form, setForm] = useState({
    name: plant.name,
    price: plant.price,
    description: plant.description,
    image: plant.image,
    category: plant.category || '',
    stock: plant.stock || 0, // Adding stock with default value
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.name === 'stock' || e.target.name === 'price' 
      ? parseInt(e.target.value) || 0 
      : e.target.value;

    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/plants/${plant._id}`, form);
      setMessage('✅ Plant updated successfully!');
      setTimeout(() => {
        setMessage('');
        navigate('/plants');
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Error updating plant.');
    }
  };

  return (
    <div className="page add-plant">
      <h2 className="lo">Edit Plant 🌱</h2>

      {message && <div className="success-toast">{message}</div>}

      <form className="add-plant-form" onSubmit={handleSubmit}>
        <label>Plant Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Price (₹)</label>
        <input 
          type="number" 
          name="price" 
          value={form.price} 
          onChange={handleChange} 
          required 
          min="0"
        />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} required />

        <label>Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} required />

        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          <option value="flower">Flower</option>
    <option value="indoor">Indoor Plant</option>
    <option value="outdoor">Outdoor Plant</option>
    <option value="fruit">Fruit</option>
    <option value="medicinal">Medicinal Plant</option>
    <option value="pot">Pot</option>
    <option value="vegetable">Vegetable</option>
    <option value="herb">Herb</option>
    <option value="aquatic">Aquatic</option>
    <option value="bonsai">Bonsai</option>
    <option value="climber">Climber</option>
    <option value="tree">Tree</option>
    <option value="seedling">Seedling</option>
    <option value="seasonal">Seasonal</option>
        </select>

        <label>Stock Available</label>
        <input 
          type="number" 
          name="stock" 
          value={form.stock} 
          onChange={handleChange} 
          required 
          min="0"
          step="1"
        />

        <div className={`stock-status ${parseInt(form.stock) > 0 ? 'in-stock' : 'out-of-stock'}`}>
          {parseInt(form.stock) > 0 ? `${form.stock} units in stock` : 'Out of stock'}
        </div>

        <button type="submit">Update Plant</button>
      </form>
    </div>
  );
}

export default EditPlant;