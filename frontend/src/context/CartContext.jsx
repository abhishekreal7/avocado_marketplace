import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);
        if (existingItem) {
            toast.info("Item already in cart");
            return;
        }

        setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
        toast.success("Added to cart");
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
        toast.success("Removed from cart");
    };

    const clearCart = () => {
        setCart([]);
        toast.success("Cart cleared");
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price_usd || 0), 0); // Assuming USD for simplicity in total
    };

    const value = React.useMemo(() => ({
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal
    }), [cart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
