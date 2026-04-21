import { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE } from '../api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user, token } = useAuth();
  
  const backendUrl = API_BASE;

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

  const fetchCartFromServer = async (currentToken = token) => {
    const res = await fetch(`${backendUrl}/api/cart`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    if (!res.ok) {
      throw new Error('Không thể lấy giỏ hàng từ server');
    }

    const data = await res.json();
    return data.items || [];
  };

  const fetchUserCart = async () => {
    try {
      const serverItems = await fetchCartFromServer(token);

      // Merge giỏ hàng local vào giỏ hàng online nếu có
      const localCart = JSON.parse(localStorage.getItem('localCart') || '[]');
      if (localCart.length > 0) {
        const mergeOk = await mergeLocalCartToOnline(localCart, token);

        if (mergeOk) {
          localStorage.removeItem('localCart');
          const refreshedItems = await fetchCartFromServer(token);
          setCartItems(refreshedItems);
        } else {
          // Giữ localCart để không mất dữ liệu nếu merge thất bại.
          setCartItems(serverItems);
        }
      } else {
        setCartItems(serverItems);
      }
    } catch (error) {
      console.error('Lỗi khi fetch giỏ hàng:', error);
    }
  };

  const mergeLocalCartToOnline = async (localCart, currentToken) => {
    let mergedCount = 0;

    for (const item of localCart) {
      try {
        const res = await fetch(`${backendUrl}/api/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
          },
          body: JSON.stringify({
            customDetails: item.customDetails,
            totalQuantity: item.totalQuantity,
            itemPrice: item.itemPrice,
          }),
        });

        if (res.ok) {
          mergedCount += 1;
        }
      } catch (_error) {
        // Keep going; we only clear local cart when all items are merged.
      }
    }

    return mergedCount === localCart.length;
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
