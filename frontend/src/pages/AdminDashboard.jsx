import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const backendUrl = API_BASE;

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State cho Product
  const [formData, setFormData] = useState({
    name: '', category: 'flower', price: '', imageUrl: '', description: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === "users") fetchUsers();
      else if (activeTab === "orders") fetchOrders();
      else if (activeTab === "products") fetchProducts();
    }
  }, [activeTab, user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/users`, { headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setUsers(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/orders/all`, { headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setOrders(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/products`);
      if (res.ok) setProducts(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // ----- ACTIONS CHO USERS -----
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/auth/users/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setUsers(users.filter((u) => u._id !== id));
      else alert((await res.json()).message || "Xóa thất bại");
    } catch (e) { console.error(e); }
  };

  // ----- ACTIONS CHO ORDERS -----
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/orders/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setOrders(orders.filter((o) => o._id !== id));
    } catch (e) { console.error(e); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch(`${backendUrl}/api/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map((o) => (o._id === id ? updatedOrder : o)));
      }
    } catch (e) { console.error(e); }
  };

  // ----- ACTIONS CHO PRODUCTS -----
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, price: Number(formData.price) };
      const res = await fetch(`${backendUrl}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newProd = await res.json();
        setProducts([...products, newProd]);
        setFormData({ name: '', category: 'flower', price: '', imageUrl: '', description: '' });
        alert("Thêm sản phẩm thành công!");
      } else {
        alert((await res.json()).message || "Thêm thất bại");
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm/nguyên liệu này?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/products/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setProducts(products.filter((p) => p._id !== id));
    } catch (e) { console.error(e); }
  };


  if (!user || user.role !== 'admin') return null;

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-12 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold font-['Geologica'] mb-8 text-slate-800 uppercase">
        Trang Quản Trị Hệ Thống
      </h1>

      <div className="flex space-x-4 mb-8 border-b border-slate-200 overflow-x-auto whitespace-nowrap">
        <button onClick={() => setActiveTab("users")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "users" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Tài Khoản</button>
        <button onClick={() => setActiveTab("orders")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "orders" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Đơn Hàng</button>
        <button onClick={() => setActiveTab("products")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "products" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Kho Sản Phẩm (Hoa/Lá)</button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-slate-500">Đang tải dữ liệu...</div>
      ) : activeTab === "users" ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                <th className="p-4">Tên</th>
                <th className="p-4">Email</th>
                <th className="p-4">Vai Trò</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="p-4 font-semibold text-slate-800">{u.name}</td>
                  <td className="p-4 text-slate-600">{u.email}</td>
                  <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role.toUpperCase()}</span></td>
                  <td className="p-4 text-right">
                    {u.role !== 'admin' && <button onClick={() => handleDeleteUser(u._id)} className="text-red-500 font-bold hover:underline">Xóa</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : activeTab === "orders" ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách Hàng</th>
                <th className="p-4">Chi tiết</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs text-rose-700">{o._id.substring(o._id.length - 6)}</td>
                  <td className="p-4 text-slate-800 font-semibold truncate max-w-[150px]">{o.userId?.name || 'Unknown'} <br/><span className="text-xs font-normal text-slate-500">{o.userId?.email}</span></td>
                  <td className="p-4 text-slate-600 text-sm">{o.items?.length || 0} món</td>
                  <td className="p-4 font-bold text-rose-700">{o.totalPrice.toLocaleString()}₫</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-2 rounded-full border outline-none ${
                        o.status === 'Đang xử lý' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        o.status === 'Đang giao hàng' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteOrder(o._id)} className="text-red-500 font-bold hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <div className="text-center py-10 text-slate-500">Chưa có đơn hàng nào</div>}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cột Thêm Sản Phẩm */}
          <div className="lg:w-1/3 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4">Thêm Vật Liệu (Hoa, Lá...)</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Tên Hiển Thị *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="VD: Hoa Hồng Nhập" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Loại *</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500">
                  <option value="flower">Hoa (Flower)</option>
                  <option value="leaf">Lá (Leaves)</option>
                  <option value="bag">Túi (Bags)</option>
                  <option value="card">Thiệp (Cards)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Giá Tiền (VNĐ) *</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="VD: 59000" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Đường dẫn Hình Ảnh *</label>
                <input required type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="URL ảnh (VD: /images/...)" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Mô tả thông điệp</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="VD: Tượng trưng cho tình yêu..."></textarea>
              </div>
              <button type="submit" className="w-full py-3 bg-rose-700 text-white font-bold rounded-xl hover:bg-rose-800 transition">Thêm Vào Kho</button>
            </form>
          </div>

          {/* Cột Danh sách sản phẩm */}
          <div className="lg:w-2/3 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="p-4">Ảnh</th>
                  <th className="p-4">Tên & Loại</th>
                  <th className="p-4">Giá tiền</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="p-4">
                      <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-md border" />
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {p.name} <br/>
                      <span className="text-xs font-normal text-slate-400 capitalize">{p.category}</span>
                    </td>
                    <td className="p-4 font-bold text-rose-700">{p.price.toLocaleString()}₫</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteProduct(p._id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 px-3 py-1 rounded-lg">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <div className="text-center py-10 text-slate-500">Chưa có sản phẩm nào</div>}
          </div>
        </div>
      )}
    </div>
  );
}
