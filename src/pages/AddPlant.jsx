import { useState } from 'react';
import axios from 'axios';
import './AddPlant.css';

const AddPlant = () => {
  const [plant, setPlant] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
    stock: 0
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const value = e.target.name === 'stock' || e.target.name === 'price' 
      ? parseInt(e.target.value) || 0 
      : e.target.value;
      
    setPlant({ ...plant, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/plants', plant);
      setMessage("✅ Plant added successfully!");
      setPlant({ name: '', price: '', image: '', description: '', category: '', stock: 0 });

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("❌ Error adding plant:", err);
      setMessage("❌ Failed to add plant");
    }
  };

  return (
    <div className="add-plant-form">
      <h2>Add New Plant</h2>

      {message && <div className="success-message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Plant Name"
          onChange={handleChange}
          value={plant.name}
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          onChange={handleChange}
          value={plant.price}
          required
        />
        <input
          name="image"
          placeholder="Image URL"
          onChange={handleChange}
          value={plant.image}
          required
        />
        
        <select
          name="category"
          onChange={handleChange}
          value={plant.category}
          required
        >
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
        
        <input
          name="stock"
          type="number"
          placeholder="Stock Quantity"
          onChange={handleChange}
          value={plant.stock}
          required
          min="0"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={plant.description}
        />
        <button type="submit">Add Plant</button>
      </form>
    </div>
  );
};

export default AddPlant;