import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (item.plant?.price || 0) * item.quantity;
  }, 0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/cart/${user._id}`)
      .then((res) => {
        const validItems = res.data.filter((item) => item.plant !== null);
        setCartItems(validItems);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const handleIncrease = async (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
      return item;
    });
    setCartItems(updatedCartItems);

    try {
      await axios.put(`http://localhost:5000/api/cart/${id}`, {
        quantity: updatedCartItems.find((item) => item._id === id).quantity,
      });
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  };

  const handleDecrease = async (id) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item._id === id && item.quantity > 1) {
        item.quantity -= 1;
      }
      return item;
    });
    setCartItems(updatedCartItems);

    try {
      await axios.put(`http://localhost:5000/api/cart/${id}`, {
        quantity: updatedCartItems.find((item) => item._id === id).quantity,
      });
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems,
        totalAmount,
      },
    });
  };

  return (
    <div className="page cart">
      <h2>Your Shopping Cart 🛒</h2>

      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.1rem" }}>
          Your cart is empty. Start adding some green! 🌿
        </p>
      ) : (
        <div className="cart-container">
          <div className="cart-left">
            <div className="cart-items">
              {cartItems.map((item, index) => (
                item.plant && (
                  <div className="cart-item" key={index}>
                    <img src={item.plant.image} alt={item.plant.name} />
                    <div className="cart-item-info">
                      <h4>{item.plant.name}</h4>
                      <p>Price: ₹{item.plant.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button onClick={() => handleDecrease(item._id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => handleIncrease(item._id)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-actions">
                      <button onClick={() => handleRemove(item._id)}>Remove</button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          <div className="cart-right">
            <div className="summary-box">
              <h3>Cart Summary</h3>
              <p>Total: ₹{totalAmount.toFixed(2)}</p>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
