// Plants.js
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import './Plants.css';

function Plants() {
    const [plants, setPlants] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryQuery, setCategoryQuery] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = () => {
        axios.get('http://localhost:5000/api/plants')
            .then(res => setPlants(res.data))
            .catch(err => console.error(err));
    };

  
    const handleAddToCart = async (plant) => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (plant.stock <= 0) {
            setSuccessMessage(`❌ ${plant.name} is out of stock!`);
            setTimeout(() => setSuccessMessage(''), 2000);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/cart', {
                userId: user._id,
                plantId: plant._id
            });

            setPlants(prevPlants =>
                prevPlants.map(p =>
                    p._id === plant._id ? { ...p, stock: p.stock - 1 } : p
                )
            );

            setSuccessMessage(`✅ ${plant.name} added to cart successfully!`);
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart');
        }
    };

    const handleEdit = (plant) => {
        navigate('/edit-plant', { state: { plant } });
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setShowModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/plants/${deleteId}`);
            setPlants(plants.filter(p => p._id !== deleteId));
            setSuccessMessage('✅ Plant deleted successfully!');
        } catch (err) {
            console.error('Delete failed:', err);
            setSuccessMessage('❌ Failed to delete plant');
        } finally {
            setShowModal(false);
            setTimeout(() => setSuccessMessage(''), 2000);
        }
    };

    const filteredPlants = plants.filter(plant =>
        plant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (categoryQuery === '' || plant.category === categoryQuery)
    );

    const categories = Array.from(new Set(plants.map(p => p.category)));

    return (
        <div className="page plants">
            <h2>Available Plants 🌱</h2>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />

                <select
                    className="category-dropdown"
                    value={categoryQuery}
                    onChange={(e) => setCategoryQuery(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {successMessage && (
                <div className="success-toast">{successMessage}</div>
            )}

            <div className="plant-list">
                {filteredPlants.length > 0 ? (
                    filteredPlants.map(plant => (
                        <div key={plant._id} className="plant-card">
                            <img src={plant.image} alt={plant.name} className="plant-image" />
                            <h3>{plant.name}</h3>
                            <p className="price">₹{plant.price}</p>
                            <p className="description">{plant.description}</p>

                            <div className={`stock-badge ${plant.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {plant.stock > 0 ? `In stock` : 'Out of stock'}
                            </div>

                            <div className="plant-actions">
                                {user && !user.isAdmin && (
                                    <button
                                        onClick={() => handleAddToCart(plant)}
                                        disabled={plant.stock <= 0}
                                        className={plant.stock <= 0 ? 'disabled-button' : ''}
                                    >
                                        {plant.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                )}

                                {user && user.isAdmin && (
                                    <>
                                        <button onClick={() => handleEdit(plant)}>Edit</button>
                                        <button onClick={() => confirmDelete(plant._id)}>Delete</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>No plants found 🌼</p>
                )}
            </div>

            <ConfirmationModal
                isOpen={showModal}
                title="Confirm Delete"
                message="Are you sure you want to delete this plant?"
                onConfirm={handleDelete}
                onCancel={() => setShowModal(false)}
            />
        </div>
    );
}

export default Plants;