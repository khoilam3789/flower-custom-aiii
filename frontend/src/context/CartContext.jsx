import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, token } = useAuth();
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Chức năng: Lưu tạm vô Local Storage dành cho người chưa login
  useEffect(() => {
    if (!user) {
      const storedCart = localStorage.getItem('localCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      } else {
        setCartItems([]);
      }
    }
  }, [user]);

  // Chức năng: Fetch từ server nếu đã login
  useEffect(() => {
    if (user && token) {
      fetchUserCart();
    }
  }, [user, token]);

  const fetchUserCart = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        
        // Merge giỏ hàng local vào giỏ hàng online nếu có
        const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
        if (localCart.length > 0) {
          await mergeLocalCartToOnline(localCart, data, token);
          localStorage.removeItem('localCart');
        } else {
          setCartItems(data.items || []);
        }
      }
    } catch (error) {
      console.error('Lỗi khi fetch giỏ hàng:', error);
    }
  };

  const mergeLocalCartToOnline = async (localCart, onlineCartData, currentToken) => {
    for (const item of localCart) {
      await addToCart(item.customDetails, item.totalQuantity, item.itemPrice);
    }
    // Set after merge loop finishes (addToCart updates cartItems)
    // Actually, calling fetchUserCart again would be better, but we will just fetch again.
    setTimeout(fetchUserCart, 500); 
  };

  const addToCart = async (customDetails, totalQuantity = 1, itemPrice) => {
    if (user && token) {
      try {
        const res = await fetch(`${backendUrl}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ customDetails, totalQuantity, itemPrice }),
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items);
        }
      } catch (error) {
        console.error('Lỗi đăng giỏ hàng:', error);
      }
    } else {
      // Logic chưa đăng nhập
      const newItem = { customDetails, totalQuantity, itemPrice, subTotal: itemPrice * totalQuantity };
      const newCart = [...cartItems, newItem];
      setCartItems(newCart);
      localStorage.setItem('localCart', JSON.stringify(newCart));
    }
  };

  const removeFromCart = async (itemId) => {
    if (user && token) {
      try {
        const res = await fetch(`${backendUrl}/api/cart/${itemId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.items);
        }
      } catch (error) {
        console.error('Lỗi xóa mục khỏi giỏ:', error);
      }
    } else {
      // Giả lập xoá offline (dùng index thay cho _id vi offline không có _id Database)
      const newCart = cartItems.filter((_, idx) => idx !== itemId);
      setCartItems(newCart);
      localStorage.setItem('localCart', JSON.stringify(newCart));
    }
  };

  const clearCart = () => setCartItems([]);

  const subTotalCart = cartItems.reduce((acc, item) => acc + item.subTotal, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, subTotalCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
