import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../api";

const initialStoryForm = {
  title: "",
  slug: "",
  heroImage: "",
  subtitle: "",
  storyTitle: "Cau chuyen",
  storyBody: "",
  poemTitle: "",
  poemLinesText: "",
  colorsTitle: "Cac sac mau",
  colorsText: "",
  exploreTitle: "Kham pha them ve",
  exploreText: "",
  isPublished: true
};

const parseMultiLine = (input) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const parseColorItems = (input) =>
  parseMultiLine(input)
    .map((line) => {
      const [color = "", icon = "", desc = ""] = line.split("|");
      return { color: color.trim(), icon: icon.trim(), desc: desc.trim() };
    })
    .filter((item) => item.color && item.icon && item.desc);

const parseExploreItems = (input) =>
  parseMultiLine(input)
    .map((line) => {
      const [label = "", slug = ""] = line.split("|");
      return { label: label.trim(), slug: slug.trim() || label.trim() };
    })
    .filter((item) => item.label);

const storyToForm = (story) => ({
  title: story.title || "",
  slug: story.slug || "",
  heroImage: story.heroImage || "",
  subtitle: story.subtitle || "",
  storyTitle: story.storyTitle || "Cau chuyen",
  storyBody: story.storyBody || "",
  poemTitle: story.poemTitle || "",
  poemLinesText: (story.poemLines || []).join("\n"),
  colorsTitle: story.colorsTitle || "Cac sac mau",
  colorsText: (story.colors || [])
    .map((item) => `${item.color}|${item.icon}|${item.desc}`)
    .join("\n"),
  exploreTitle: story.exploreTitle || "Kham pha them ve",
  exploreText: (story.explore || [])
    .map((item) => `${item.label}|${item.slug}`)
    .join("\n"),
  isPublished: Boolean(story.isPublished)
});

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const backendUrl = API_BASE;

  const tabFromQuery = searchParams.get("tab");
  const allowedTabs = ["users", "orders", "products", "stories"];
  const initialTab = allowedTabs.includes(tabFromQuery) ? tabFromQuery : "users";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingStoryId, setEditingStoryId] = useState(null);

  // Form State cho Product
  const [formData, setFormData] = useState({
    name: '', category: 'flower', price: '', imageUrl: '', description: ''
  });
  const [storyForm, setStoryForm] = useState(initialStoryForm);

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
      else if (activeTab === "stories") fetchStories();
    }
  }, [activeTab, user]);

  useEffect(() => {
    const queryTab = searchParams.get("tab");
    if (allowedTabs.includes(queryTab) && queryTab !== activeTab) {
      setActiveTab(queryTab);
    }
  }, [searchParams]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", tab);
    setSearchParams(nextParams, { replace: true });
  };

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

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/stories/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStories(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
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

  // ----- ACTIONS CHO STORIES -----
  const buildStoryPayload = () => ({
    title: storyForm.title,
    slug: storyForm.slug,
    heroImage: storyForm.heroImage,
    subtitle: storyForm.subtitle,
    storyTitle: storyForm.storyTitle,
    storyBody: storyForm.storyBody,
    poemTitle: storyForm.poemTitle,
    poemLines: parseMultiLine(storyForm.poemLinesText),
    colorsTitle: storyForm.colorsTitle,
    colors: parseColorItems(storyForm.colorsText),
    exploreTitle: storyForm.exploreTitle,
    explore: parseExploreItems(storyForm.exploreText),
    isPublished: storyForm.isPublished
  });

  const resetStoryForm = () => {
    setStoryForm(initialStoryForm);
    setEditingStoryId(null);
  };

  const handleSaveStory = async (e) => {
    e.preventDefault();
    try {
      const payload = buildStoryPayload();
      const url = editingStoryId
        ? `${backendUrl}/api/stories/${editingStoryId}`
        : `${backendUrl}/api/stories`;
      const method = editingStoryId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert((await res.json()).message || "Luu bai viet that bai");
        return;
      }

      const saved = await res.json();
      if (editingStoryId) {
        setStories(stories.map((s) => (s._id === editingStoryId ? saved : s)));
      } else {
        setStories([saved, ...stories]);
      }

      resetStoryForm();
      alert(editingStoryId ? "Da cap nhat bai viet" : "Da tao bai viet moi");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditStory = (story) => {
    setEditingStoryId(story._id);
    setStoryForm(storyToForm(story));
  };

  const handleCloneStory = async (story) => {
    try {
      const suffix = String(Date.now()).slice(-6);
      const payload = {
        ...story,
        title: `${story.title} Ban sao`,
        slug: `${story.slug}-copy-${suffix}`
      };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;

      const res = await fetch(`${backendUrl}/api/stories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert((await res.json()).message || "Clone bai viet that bai");
        return;
      }

      const cloned = await res.json();
      setStories([cloned, ...stories]);
      alert("Da clone bai viet thanh cong");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteStory = async (id) => {
    if (!window.confirm("Ban co chac chan muon xoa bai viet nay?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/stories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStories(stories.filter((item) => item._id !== id));
        if (editingStoryId === id) resetStoryForm();
      }
    } catch (e) {
      console.error(e);
    }
  };


  if (!user || user.role !== 'admin') return null;

  return (
    <div className="w-full min-h-screen bg-slate-100">
      <div className="max-w-[1440px] mx-auto px-6 md:px-8 py-8 md:py-10">
        <div className="bg-white border border-slate-200 rounded-2xl px-6 md:px-8 py-5 mb-6 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold font-['Geologica'] text-slate-800 uppercase tracking-wide">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản, đơn hàng, kho sản phẩm và nội dung story.</p>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => switchTab("stories")}
              className="px-4 py-2 rounded-lg bg-rose-700 text-white text-sm font-semibold hover:bg-rose-800 transition"
            >
              Vào Story Pages
            </button>
          </div>
        </div>

      <div className="flex space-x-4 mb-6 bg-white border border-slate-200 rounded-2xl px-3 pt-4 overflow-x-auto whitespace-nowrap shadow-sm">
        <button onClick={() => switchTab("users")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "users" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Tài Khoản</button>
        <button onClick={() => switchTab("orders")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "orders" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Đơn Hàng</button>
        <button onClick={() => switchTab("products")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "products" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Kho Sản Phẩm (Hoa/Lá)</button>
        <button onClick={() => switchTab("stories")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "stories" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Trang Story</button>
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
      ) : activeTab === "products" ? (
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
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4">{editingStoryId ? "Chỉnh sửa Story" : "Tạo Story mới"}</h2>
            <form onSubmit={handleSaveStory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Tiêu đề *</label>
                <input required type="text" value={storyForm.title} onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Slug *</label>
                <input required type="text" value={storyForm.slug} onChange={(e) => setStoryForm({ ...storyForm, slug: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="hoa-hong" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Hero image URL *</label>
                <input required type="text" value={storyForm.heroImage} onChange={(e) => setStoryForm({ ...storyForm, heroImage: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Mô tả ngắn</label>
                <textarea value={storyForm.subtitle} onChange={(e) => setStoryForm({ ...storyForm, subtitle: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" rows={2}></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Nội dung câu chuyện</label>
                <textarea value={storyForm.storyBody} onChange={(e) => setStoryForm({ ...storyForm, storyBody: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" rows={5}></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Thơ (mỗi dòng 1 dòng)</label>
                <textarea value={storyForm.poemLinesText} onChange={(e) => setStoryForm({ ...storyForm, poemLinesText: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" rows={4}></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Màu sắc (mỗi dòng: ten|iconUrl|mo ta)</label>
                <textarea value={storyForm.colorsText} onChange={(e) => setStoryForm({ ...storyForm, colorsText: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500 font-mono text-sm" rows={5}></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Khám phá thêm (mỗi dòng: label|slug)</label>
                <textarea value={storyForm.exploreText} onChange={(e) => setStoryForm({ ...storyForm, exploreText: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500 font-mono text-sm" rows={4}></textarea>
              </div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={storyForm.isPublished} onChange={(e) => setStoryForm({ ...storyForm, isPublished: e.target.checked })} />
                Public (cho hiển thị ngoài website)
              </label>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-rose-700 text-white font-bold rounded-xl hover:bg-rose-800 transition">
                  {editingStoryId ? "Lưu chỉnh sửa" : "Tạo story"}
                </button>
                {editingStoryId && (
                  <button type="button" onClick={resetStoryForm} className="px-5 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition">
                    Hủy sửa
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="p-4">Ảnh</th>
                  <th className="p-4">Tiêu đề</th>
                  <th className="p-4">Slug</th>
                  <th className="p-4">Public</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 align-top">
                    <td className="p-4">
                      <img src={story.heroImage} alt={story.title} className="w-14 h-14 rounded-md object-cover border" />
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{story.title}</td>
                    <td className="p-4 text-xs text-slate-500">{story.slug}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${story.isPublished ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                        {story.isPublished ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEditStory(story)} className="text-blue-600 font-semibold hover:underline">Sửa</button>
                      <button onClick={() => handleCloneStory(story)} className="text-emerald-600 font-semibold hover:underline">Clone</button>
                      <button onClick={() => handleDeleteStory(story._id)} className="text-red-600 font-semibold hover:underline">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {stories.length === 0 && <div className="text-center py-10 text-slate-500">Chưa có trang story nào</div>}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
