import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (plant) => {
        const exists = cartItems.find(item => item._id === plant._id);
        if (exists) {
            setCartItems(prev =>
                prev.map(item =>
                    item._id === plant._id ? { ...item, quantity: item.quantity + 1 } : item
                )
            );
        } else {
            setCartItems(prev => [...prev, { ...plant, quantity: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item._id !== id));
    };

    const getTotalAmount = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const increaseQuantity = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item._id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (id) => {
        setCartItems(prev =>
            prev.map(item =>
                item._id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };


    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
