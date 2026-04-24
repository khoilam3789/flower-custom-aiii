import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../api";

const initialStoryForm = {
  title: "",
  slug: "",
  heroImage: "",
  subtitle: "",
  storyTitle: "Câu chuyện",
  storyBody: "",
  poemTitle: "",
  poemLinesText: "",
  colorsTitle: "Các sắc màu",
  colors: [{ color: "", icon: "", desc: "" }],
  exploreTitle: "Khám phá thêm về",
  explore: [{ label: "", slug: "" }],
  isPublished: true
};

const initialHomeReviewForm = {
  sectionTitle: "ĐÁNH GIÁ TỪ HỘI YÊU HOA",
  reviews: [
    {
      name: "",
      age: "",
      role: "",
      imageUrl: "",
      content: "",
      isActive: true
    }
  ]
};

const parseMultiLine = (input) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const sanitizeColorItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => ({
      color: String(item?.color || "").trim(),
      icon: String(item?.icon || "").trim(),
      desc: String(item?.desc || "").trim()
    }))
    .filter((item) => item.color && item.icon && item.desc);

const sanitizeExploreItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .map((item) => ({
      label: String(item?.label || "").trim(),
      slug: String(item?.slug || "").trim() || String(item?.label || "").trim()
    }))
    .filter((item) => item.label);

const initialBlogForm = {
  title: "",
  slug: "",
  coverImage: "",
  date: "",
  summary: "",
  themeColor: "bg-pink-300/40",
  tableOfContentsText: "",
  sections: [],
  showOnHome: true,
  showOnStoryPage: true,
  isPublished: true
};

const blogToForm = (blog) => ({
  title: blog.title || "",
  slug: blog.slug || "",
  coverImage: blog.coverImage || "",
  date: blog.date || "",
  summary: blog.summary || "",
  themeColor: blog.themeColor || "bg-pink-300/40",
  tableOfContentsText: (blog.tableOfContents || []).join("\n"),
  sections: blog.sections || [],
  showOnHome: Boolean(blog.showOnHome),
  showOnStoryPage: Boolean(blog.showOnStoryPage),
  isPublished: Boolean(blog.isPublished)
});

const storyToForm = (story) => ({
  title: story.title || "",
  slug: story.slug || "",
  heroImage: story.heroImage || "",
  subtitle: story.subtitle || "",
  storyTitle: story.storyTitle || "Câu chuyện",
  storyBody: story.storyBody || "",
  poemTitle: story.poemTitle || "",
  poemLinesText: (story.poemLines || []).join("\n"),
  colorsTitle: story.colorsTitle || "Các sắc màu",
  colors: (story.colors || []).length > 0
    ? story.colors.map((item) => ({
        color: item.color || "",
        icon: item.icon || "",
        desc: item.desc || ""
      }))
    : [{ color: "", icon: "", desc: "" }],
  exploreTitle: story.exploreTitle || "Khám phá thêm về",
  explore: (story.explore || []).length > 0
    ? story.explore.map((item) => ({
        label: item.label || "",
        slug: item.slug || ""
      }))
    : [{ label: "", slug: "" }],
  isPublished: Boolean(story.isPublished)
});

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const backendUrl = API_BASE;

  const tabFromQuery = searchParams.get("tab");
  const allowedTabs = ["users", "orders", "products", "stories", "blogs", "ai-settings"];
  const initialTab = allowedTabs.includes(tabFromQuery) ? tabFromQuery : "users";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [stories, setStories] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [aiSettings, setAiSettings] = useState({
    imageProvider: "auto",
    geminiApiKeyInput: "",
    hasGeminiApiKey: false,
    maskedGeminiApiKey: "",
    clearGeminiApiKey: false
  });
  const [loading, setLoading] = useState(false);
  const [savingAiSettings, setSavingAiSettings] = useState(false);
  const [cleaningBase64, setCleaningBase64] = useState(false);
  const [checkingDbStats, setCheckingDbStats] = useState(false);
  const [cleanupSummary, setCleanupSummary] = useState("");
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [homeReviewForm, setHomeReviewForm] = useState(initialHomeReviewForm);
  const [savingHomeReviews, setSavingHomeReviews] = useState(false);

  // Form State cho Product
  const [formData, setFormData] = useState({
    name: '', category: 'flower', price: '', imageUrl: '', description: ''
  });
  const [storyForm, setStoryForm] = useState(initialStoryForm);

  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === "users") fetchUsers();
      else if (activeTab === "orders") fetchOrders();
      else if (activeTab === "products") fetchProducts();
      else if (activeTab === "stories") {
        fetchStories();
        fetchHomeReviews();
      }
      else if (activeTab === "blogs") fetchBlogs();
      else if (activeTab === "ai-settings") fetchAiSettings();
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

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/blogs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBlogs(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchHomeReviews = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/home-reviews/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      setHomeReviewForm({
        sectionTitle: data?.sectionTitle || initialHomeReviewForm.sectionTitle,
        reviews: Array.isArray(data?.reviews) && data.reviews.length > 0
          ? data.reviews.map((item) => ({
              name: item?.name || "",
              age: item?.age ?? "",
              role: item?.role || "",
              imageUrl: item?.imageUrl || "",
              content: item?.content || "",
              isActive: item?.isActive !== false
            }))
          : initialHomeReviewForm.reviews
      });
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAiSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAiSettings({
          imageProvider: data.imageProvider || "auto",
          geminiApiKeyInput: "",
          hasGeminiApiKey: Boolean(data.hasGeminiApiKey),
          maskedGeminiApiKey: data.maskedGeminiApiKey || "",
          clearGeminiApiKey: false
        });
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSaveAiSettings = async (e) => {
    e.preventDefault();
    setSavingAiSettings(true);
    try {
      const res = await fetch(`${backendUrl}/api/ai/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          imageProvider: aiSettings.imageProvider,
          geminiApiKey: aiSettings.geminiApiKeyInput,
          clearGeminiApiKey: aiSettings.clearGeminiApiKey
        })
      });

      if (!res.ok) {
        alert((await res.json()).message || "Lưu AI settings thất bại");
        return;
      }

      const data = await res.json();
      setAiSettings((prev) => ({
        ...prev,
        imageProvider: data.imageProvider || "auto",
        geminiApiKeyInput: "",
        hasGeminiApiKey: Boolean(data.hasGeminiApiKey),
        maskedGeminiApiKey: data.maskedGeminiApiKey || "",
        clearGeminiApiKey: false
      }));
      alert("Đã cập nhật API tạo ảnh");
    } catch (e) {
      console.error(e);
    }
    setSavingAiSettings(false);
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

  const handleCleanupLegacyBase64 = async () => {
    if (!window.confirm("Xoa toan bo du lieu anh Base64 cu trong Cart va Order? Hanh dong nay khong hoan tac.")) {
      return;
    }

    setCleaningBase64(true);
    setCleanupSummary("");

    try {
      const res = await fetch(`${backendUrl}/api/orders/admin/cleanup-base64`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      console.log("[cleanup-base64] response", data);
      if (!res.ok) {
        alert(data.message || "Cleanup that bai");
        return;
      }

      setCleanupSummary(
        `Da quet ${data.cartsScanned} cart va ${data.ordersScanned} order | cap nhat ${data.cartsUpdated} cart, ${data.ordersUpdated} order | xoa ${data.cleanedFields} truong Base64`
      );

      if ((data.cleanedFields || 0) === 0) {
        console.warn("[cleanup-base64] no fields cleaned", data?.debug || {});
      }

      await fetchOrders();
    } catch (e) {
      console.error(e);
      alert("Khong the cleanup luc nay");
    }

    setCleaningBase64(false);
  };

  const handleCheckDbStats = async () => {
    setCheckingDbStats(true);
    try {
      const res = await fetch(`${backendUrl}/api/orders/admin/db-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      console.log("[db-stats] Chi tiet DB size:", data);
      
      if (res.ok) {
        alert(`Tong dung luong: ${(data.totalDataSizeBytes / 1024 / 1024).toFixed(2)} MB. (Xem dev tools log de biet chi tiet)`);
      } else {
        alert(data.message || "Khong the lay thong ke DB");
      }
    } catch (e) {
      console.error(e);
      alert("Loi khi lay thong ke DB");
    }
    setCheckingDbStats(false);
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
    colors: sanitizeColorItems(storyForm.colors),
    exploreTitle: storyForm.exploreTitle,
    explore: sanitizeExploreItems(storyForm.explore),
    isPublished: storyForm.isPublished
  });

  const addColorRow = () => {
    setStoryForm({
      ...storyForm,
      colors: [...storyForm.colors, { color: "", icon: "", desc: "" }]
    });
  };

  const updateColorRow = (index, field, value) => {
    const nextColors = [...storyForm.colors];
    nextColors[index] = { ...nextColors[index], [field]: value };
    setStoryForm({ ...storyForm, colors: nextColors });
  };

  const removeColorRow = (index) => {
    const nextColors = storyForm.colors.filter((_, idx) => idx !== index);
    setStoryForm({
      ...storyForm,
      colors: nextColors.length > 0 ? nextColors : [{ color: "", icon: "", desc: "" }]
    });
  };

  const addExploreRow = () => {
    setStoryForm({
      ...storyForm,
      explore: [...storyForm.explore, { label: "", slug: "" }]
    });
  };

  const updateExploreRow = (index, field, value) => {
    const nextExplore = [...storyForm.explore];
    nextExplore[index] = { ...nextExplore[index], [field]: value };
    setStoryForm({ ...storyForm, explore: nextExplore });
  };

  const removeExploreRow = (index) => {
    const nextExplore = storyForm.explore.filter((_, idx) => idx !== index);
    setStoryForm({
      ...storyForm,
      explore: nextExplore.length > 0 ? nextExplore : [{ label: "", slug: "" }]
    });
  };

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

  const resetBlogForm = () => {
    setBlogForm(initialBlogForm);
    setEditingBlogId(null);
  };

  const addBlogSection = () => {
    setBlogForm((prev) => ({
      ...prev,
      sections: [...prev.sections, { type: "text", heading: "", content: "", imageUrl: "" }]
    }));
  };

  const updateBlogSection = (index, field, value) => {
    setBlogForm((prev) => {
      const nextSections = [...prev.sections];
      nextSections[index] = { ...nextSections[index], [field]: value };
      return { ...prev, sections: nextSections };
    });
  };

  const removeBlogSection = (index) => {
    setBlogForm((prev) => {
      const nextSections = prev.sections.filter((_, idx) => idx !== index);
      return { ...prev, sections: nextSections };
    });
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...blogForm,
        tableOfContents: parseMultiLine(blogForm.tableOfContentsText),
        sections: blogForm.sections.map(s => ({
          type: s.type,
          heading: String(s.heading || "").trim(),
          content: String(s.content || "").trim(),
          imageUrl: String(s.imageUrl || "").trim()
        }))
      };
      const url = editingBlogId ? `${backendUrl}/api/blogs/${editingBlogId}` : `${backendUrl}/api/blogs`;
      const method = editingBlogId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert((await res.json()).message || "Luu blog that bai");
        return;
      }

      const saved = await res.json();
      if (editingBlogId) {
        setBlogs(blogs.map((b) => (b._id === editingBlogId ? saved : b)));
      } else {
        setBlogs([saved, ...blogs]);
      }
      resetBlogForm();
      alert(editingBlogId ? "Da cap nhat blog" : "Da tao blog moi");
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditBlog = (blog) => {
    setEditingBlogId(blog._id);
    setBlogForm(blogToForm(blog));
  };

  const handleCloneBlog = async (blog) => {
    try {
      const suffix = String(Date.now()).slice(-6);
      const payload = {
        ...blog,
        title: `${blog.title} Ban sao`,
        slug: `${blog.slug}-copy-${suffix}`
      };
      delete payload._id;
      delete payload.createdAt;
      delete payload.updatedAt;

      const res = await fetch(`${backendUrl}/api/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert((await res.json()).message || "Clone blog that bai");
        return;
      }
      const cloned = await res.json();
      setBlogs([cloned, ...blogs]);
      alert("Da clone blog thanh cong");
    } catch (e) { console.error(e); }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Ban co chac chan muon xoa blog nay?")) return;
    try {
      const res = await fetch(`${backendUrl}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setBlogs(blogs.filter((item) => item._id !== id));
        if (editingBlogId === id) resetBlogForm();
      }
    } catch (e) { console.error(e); }
  };

  const addHomeReviewRow = () => {
    setHomeReviewForm((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        { name: "", age: "", role: "", imageUrl: "", content: "", isActive: true }
      ]
    }));
  };

  const updateHomeReviewRow = (index, field, value) => {
    setHomeReviewForm((prev) => {
      const nextReviews = [...prev.reviews];
      nextReviews[index] = { ...nextReviews[index], [field]: value };
      return { ...prev, reviews: nextReviews };
    });
  };

  const removeHomeReviewRow = (index) => {
    setHomeReviewForm((prev) => {
      const nextReviews = prev.reviews.filter((_, idx) => idx !== index);
      return {
        ...prev,
        reviews: nextReviews.length > 0 ? nextReviews : initialHomeReviewForm.reviews
      };
    });
  };

  const handleSaveHomeReviews = async (e) => {
    e.preventDefault();
    setSavingHomeReviews(true);

    try {
      const payload = {
        sectionTitle: String(homeReviewForm.sectionTitle || "").trim(),
        reviews: (homeReviewForm.reviews || [])
          .map((item) => ({
            name: String(item?.name || "").trim(),
            age: item?.age === "" ? null : Number(item?.age),
            role: String(item?.role || "").trim(),
            imageUrl: String(item?.imageUrl || "").trim(),
            content: String(item?.content || "").trim(),
            isActive: item?.isActive !== false
          }))
          .filter((item) => item.name && item.imageUrl && item.content)
      };

      const res = await fetch(`${backendUrl}/api/home-reviews/admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Lưu đánh giá thất bại");
        return;
      }

      setHomeReviewForm({
        sectionTitle: data?.sectionTitle || initialHomeReviewForm.sectionTitle,
        reviews: Array.isArray(data?.reviews) && data.reviews.length > 0
          ? data.reviews.map((item) => ({
              name: item?.name || "",
              age: item?.age ?? "",
              role: item?.role || "",
              imageUrl: item?.imageUrl || "",
              content: item?.content || "",
              isActive: item?.isActive !== false
            }))
          : initialHomeReviewForm.reviews
      });

      alert("Đã lưu phần đánh giá trang chủ");
    } catch (e) {
      console.error(e);
      alert("Không thể lưu phần đánh giá lúc này");
    }

    setSavingHomeReviews(false);
  };


  if (!user) {
    return (
      <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-slate-800">Bạn chưa đăng nhập</h2>
          <p className="text-slate-500 mt-2">Vui lòng đăng nhập tài khoản admin để truy cập trang quản trị.</p>
          <Link to="/login" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-rose-700 text-white font-semibold hover:bg-rose-800 transition">
            Đi tới đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center px-6">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-slate-800">Không có quyền truy cập</h2>
          <p className="text-slate-500 mt-2">Tài khoản hiện tại không có quyền admin.</p>
          <Link to="/" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-slate-700 text-white font-semibold hover:bg-slate-800 transition">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

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

      <div className="mb-6 bg-white border border-slate-200 rounded-2xl px-3 pt-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="overflow-x-auto whitespace-nowrap flex space-x-4">
            <button onClick={() => switchTab("users")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "users" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Tài Khoản</button>
            <button onClick={() => switchTab("orders")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "orders" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Đơn Hàng</button>
            <button onClick={() => switchTab("products")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "products" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Kho Sản Phẩm (Hoa/Lá)</button>
            <button onClick={() => switchTab("stories")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "stories" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Trang Story</button>
            <button onClick={() => switchTab("blogs")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "blogs" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Blogs</button>
            <button onClick={() => switchTab("home-reviews")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "home-reviews" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>Quản Lý Review</button>
            <button onClick={() => switchTab("ai-settings")} className={`pb-4 px-4 font-bold uppercase tracking-wider text-sm ${activeTab === "ai-settings" ? "text-rose-700 border-b-2 border-rose-700" : "text-slate-500 hover:text-slate-800"}`}>AI Settings</button>
          </div>


        </div>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Quan ly don hang</h2>
              <p className="text-sm text-slate-500">Bam nut Clean Base64 DB goc phai duoi va xem log trong DevTools Console.</p>
            </div>
          </div>

          {cleanupSummary && (
            <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              {cleanupSummary}
            </div>
          )}

          <div className="overflow-x-auto">
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
                        o.status === 'Hoàn thành' ? 'bg-green-50 text-green-700 border-green-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đang giao hàng">Đang giao hàng</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDeleteOrder(o._id)} className="text-red-500 font-bold hover:underline">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
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
      ) : activeTab === "stories" ? (
        <div className="space-y-8">
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
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-600">Màu sắc</label>
                  <button type="button" onClick={addColorRow} className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">+ Thêm màu</button>
                </div>
                <div className="space-y-2">
                  {storyForm.colors.map((item, index) => (
                    <div key={`color-${index}`} className="grid grid-cols-12 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                      <input
                        type="text"
                        value={item.color}
                        onChange={(e) => updateColorRow(index, "color", e.target.value)}
                        placeholder="Tên màu"
                        className="col-span-3 px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500"
                      />
                      <input
                        type="text"
                        value={item.icon}
                        onChange={(e) => updateColorRow(index, "icon", e.target.value)}
                        placeholder="Icon URL"
                        className="col-span-5 px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500"
                      />
                      <input
                        type="text"
                        value={item.desc}
                        onChange={(e) => updateColorRow(index, "desc", e.target.value)}
                        placeholder="Mô tả"
                        className="col-span-3 px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500"
                      />
                      <button type="button" onClick={() => removeColorRow(index)} className="col-span-1 px-2 py-2 rounded-md bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition flex items-center justify-center" aria-label="Xóa màu">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-600">Khám phá thêm</label>
                  <button type="button" onClick={addExploreRow} className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">+ Thêm mục</button>
                </div>
                <div className="space-y-2">
                  {storyForm.explore.map((item, index) => (
                    <div key={`explore-${index}`} className="grid grid-cols-12 gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateExploreRow(index, "label", e.target.value)}
                        placeholder="Label"
                        className="col-span-5 px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500"
                      />
                      <input
                        type="text"
                        value={item.slug}
                        onChange={(e) => updateExploreRow(index, "slug", e.target.value)}
                        placeholder="Slug"
                        className="col-span-6 px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500"
                      />
                      <button type="button" onClick={() => removeExploreRow(index)} className="col-span-1 px-2 py-2 rounded-md bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition flex items-center justify-center" aria-label="Xóa mục khám phá">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
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
                    <td className="p-4 font-semibold text-slate-800">
                      <Link
                        to={`/story/${story.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-800 hover:text-rose-700 hover:underline"
                      >
                        {story.title}
                      </Link>
                    </td>
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

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Chỉnh sửa phần Đánh giá trang chủ</h2>
              <button
                type="button"
                onClick={addHomeReviewRow}
                className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition"
              >
                + Thêm đánh giá
              </button>
            </div>

            <form onSubmit={handleSaveHomeReviews} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Tiêu đề section</label>
                <input
                  type="text"
                  value={homeReviewForm.sectionTitle}
                  onChange={(e) =>
                    setHomeReviewForm((prev) => ({ ...prev, sectionTitle: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500"
                  placeholder="ĐÁNH GIÁ TỪ HỘI YÊU HOA"
                />
              </div>

              <div className="space-y-3">
                {homeReviewForm.reviews.map((item, index) => (
                  <div key={`home-review-${index}`} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-700">Review #{index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeHomeReviewRow(index)}
                        className="text-red-600 text-sm font-semibold hover:underline"
                      >
                        Xóa
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateHomeReviewRow(index, "name", e.target.value)}
                        className="px-3 py-2 bg-white border rounded-lg outline-none focus:border-rose-500"
                        placeholder="Tên người đánh giá"
                      />
                      <input
                        type="number"
                        min="0"
                        max="120"
                        value={item.age}
                        onChange={(e) => updateHomeReviewRow(index, "age", e.target.value)}
                        className="px-3 py-2 bg-white border rounded-lg outline-none focus:border-rose-500"
                        placeholder="Tuổi"
                      />
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => updateHomeReviewRow(index, "role", e.target.value)}
                        className="px-3 py-2 bg-white border rounded-lg outline-none focus:border-rose-500"
                        placeholder="Nghề nghiệp"
                      />
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 px-2">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) => updateHomeReviewRow(index, "isActive", e.target.checked)}
                        />
                        Hiển thị ngoài trang chủ
                      </label>
                    </div>

                    <input
                      type="text"
                      value={item.imageUrl}
                      onChange={(e) => updateHomeReviewRow(index, "imageUrl", e.target.value)}
                      className="w-full px-3 py-2 bg-white border rounded-lg outline-none focus:border-rose-500"
                      placeholder="URL hình ảnh (VD: /images/anhnguoi/1.jpg)"
                    />

                    <textarea
                      value={item.content}
                      onChange={(e) => updateHomeReviewRow(index, "content", e.target.value)}
                      className="w-full px-3 py-2 bg-white border rounded-lg outline-none focus:border-rose-500 min-h-[90px]"
                      placeholder="Nội dung đánh giá"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={savingHomeReviews}
                className="px-5 py-2.5 bg-rose-700 text-white font-semibold rounded-lg hover:bg-rose-800 transition disabled:opacity-60"
              >
                {savingHomeReviews ? "Đang lưu..." : "Lưu phần đánh giá"}
              </button>
            </form>
          </div>
        </div>
      ) : activeTab === "blogs" ? (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold mb-4">{editingBlogId ? "Chỉnh sửa Blog" : "Tạo Blog mới"}</h2>
            <form onSubmit={handleSaveBlog} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Tiêu đề *</label>
                <input required type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Slug *</label>
                <input required type="text" value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="tui-hoa-tu-thiet-ke" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Ảnh bìa (Cover Image) *</label>
                <input required type="text" value={blogForm.coverImage} onChange={(e) => setBlogForm({ ...blogForm, coverImage: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Ngày (Date) *</label>
                <input required type="text" value={blogForm.date} onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="24/2/2026" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Mô tả ngắn (Summary) *</label>
                <textarea required value={blogForm.summary} onChange={(e) => setBlogForm({ ...blogForm, summary: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" rows={4}></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Màu nền chủ đề (Theme Color)</label>
                <input type="text" value={blogForm.themeColor} onChange={(e) => setBlogForm({ ...blogForm, themeColor: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="bg-pink-300/40" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Mục lục (mỗi mục 1 dòng)</label>
                <textarea value={blogForm.tableOfContentsText} onChange={(e) => setBlogForm({ ...blogForm, tableOfContentsText: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" rows={4}></textarea>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-600">Các phần nội dung (Sections)</label>
                  <button type="button" onClick={addBlogSection} className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition">+ Thêm phần</button>
                </div>
                <div className="space-y-4">
                  {blogForm.sections.map((section, index) => (
                    <div key={`section-${index}`} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-slate-700 text-sm">Phần {index + 1}</span>
                        <button type="button" onClick={() => removeBlogSection(index)} className="text-red-500 text-sm font-semibold hover:underline">Xóa</button>
                      </div>
                      <select value={section.type} onChange={(e) => updateBlogSection(index, "type", e.target.value)} className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500">
                        <option value="text">Văn bản (Text)</option>
                        <option value="image">Hình ảnh (Image)</option>
                      </select>
                      
                      {section.type === "text" && (
                        <>
                          <input type="text" value={section.heading} onChange={(e) => updateBlogSection(index, "heading", e.target.value)} placeholder="Tiêu đề phụ (Heading)" className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" />
                          <textarea value={section.content} onChange={(e) => updateBlogSection(index, "content", e.target.value)} placeholder="Nội dung" className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" rows={4}></textarea>
                        </>
                      )}

                      {section.type === "image" && (
                        <input type="text" value={section.imageUrl} onChange={(e) => updateBlogSection(index, "imageUrl", e.target.value)} placeholder="Image URL" className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={blogForm.showOnHome} onChange={(e) => setBlogForm({ ...blogForm, showOnHome: e.target.checked })} />
                  Hiển thị ở trang chủ (Home)
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={blogForm.showOnStoryPage} onChange={(e) => setBlogForm({ ...blogForm, showOnStoryPage: e.target.checked })} />
                  Hiển thị ở trang Story (phần bài viết)
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <input type="checkbox" checked={blogForm.isPublished} onChange={(e) => setBlogForm({ ...blogForm, isPublished: e.target.checked })} />
                  Public (cho hiển thị ngoài website)
                </label>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-3 bg-rose-700 text-white font-bold rounded-xl hover:bg-rose-800 transition">
                  {editingBlogId ? "Lưu chỉnh sửa" : "Tạo blog"}
                </button>
                {editingBlogId && (
                  <button type="button" onClick={resetBlogForm} className="px-5 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition">
                    Hủy sửa
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:w-1/2 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-x-auto p-2 self-start sticky top-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wider">
                  <th className="p-4">Ảnh bìa</th>
                  <th className="p-4">Tiêu đề</th>
                  <th className="p-4">Hiển thị</th>
                  <th className="p-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 align-top">
                    <td className="p-4">
                      <img src={blog.coverImage} alt={blog.title} className="w-14 h-14 rounded-md object-cover border" />
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-800 hover:text-rose-700 hover:underline"
                      >
                        {blog.title}
                      </Link>
                      <div className="text-xs text-slate-500 font-normal mt-1">{blog.slug}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 w-fit rounded text-[10px] font-bold ${blog.isPublished ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}`}>
                          {blog.isPublished ? "PUB" : "DRAFT"}
                        </span>
                        <span className={`px-2 py-0.5 w-fit rounded text-[10px] font-bold ${blog.showOnHome ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600"}`}>
                          HOME: {blog.showOnHome ? "Y" : "N"}
                        </span>
                        <span className={`px-2 py-0.5 w-fit rounded text-[10px] font-bold ${blog.showOnStoryPage ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-600"}`}>
                          STORY: {blog.showOnStoryPage ? "Y" : "N"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEditBlog(blog)} className="text-blue-600 font-semibold hover:underline">Sửa</button>
                      <button onClick={() => handleCloneBlog(blog)} className="text-emerald-600 font-semibold hover:underline">Clone</button>
                      <button onClick={() => handleDeleteBlog(blog._id)} className="text-red-600 font-semibold hover:underline">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {blogs.length === 0 && <div className="text-center py-10 text-slate-500">Chưa có blog nào</div>}
          </div>
        </div>
      ) : activeTab === "home-reviews" ? (
        <div className="max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-200 p-6 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Chỉnh sửa Review Trang Chủ</h2>
            <button type="button" onClick={addHomeReviewRow} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition">
              + Thêm Review
            </button>
          </div>

          <form onSubmit={handleSaveHomeReviews} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Tiêu đề khu vực</label>
              <input type="text" value={homeReviewForm.sectionTitle} onChange={(e) => setHomeReviewForm({ ...homeReviewForm, sectionTitle: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500" placeholder="ĐÁNH GIÁ TỪ HỘI YÊU HOA" />
            </div>

            <div className="space-y-6">
              {homeReviewForm.reviews.map((review, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 rounded-xl p-4 relative">
                  <button type="button" onClick={() => removeHomeReviewRow(index)} className="absolute top-4 right-4 text-red-500 text-sm font-bold hover:underline">
                    Xóa
                  </button>
                  <h3 className="font-semibold text-slate-700 mb-3">Review #{index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tên khách hàng *</label>
                      <input required type="text" value={review.name} onChange={(e) => updateHomeReviewRow(index, "name", e.target.value)} className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" placeholder="VD: Đỗ Thị Hà" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Tuổi</label>
                      <input type="number" value={review.age} onChange={(e) => updateHomeReviewRow(index, "age", e.target.value)} className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" placeholder="VD: 22" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Nghề nghiệp / Chức vụ</label>
                      <input type="text" value={review.role} onChange={(e) => updateHomeReviewRow(index, "role", e.target.value)} className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" placeholder="VD: Sinh viên" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">URL Ảnh đại diện *</label>
                      <input required type="text" value={review.imageUrl} onChange={(e) => updateHomeReviewRow(index, "imageUrl", e.target.value)} className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" placeholder="/images/anhnguoi/1.jpg" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 mb-1">Nội dung đánh giá *</label>
                      <textarea required value={review.content} onChange={(e) => updateHomeReviewRow(index, "content", e.target.value)} className="w-full px-3 py-2 bg-white border rounded-md outline-none focus:border-rose-500" rows={3} placeholder="Viết đánh giá..."></textarea>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <input type="checkbox" checked={review.isActive} onChange={(e) => updateHomeReviewRow(index, "isActive", e.target.checked)} />
                      <label className="text-sm font-semibold text-slate-700">Đang hoạt động (Hiển thị review này)</label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button type="submit" disabled={savingHomeReviews} className={`px-6 py-3 font-bold rounded-xl text-white transition ${savingHomeReviews ? "bg-slate-400" : "bg-rose-700 hover:bg-rose-800"}`}>
                {savingHomeReviews ? "Đang lưu..." : "Lưu tất cả thay đổi"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold mb-2">AI Image Provider</h2>
          <p className="text-slate-500 mb-6">Chọn API/model sẽ được ưu tiên khi tạo ảnh preview AI.</p>

          <form onSubmit={handleSaveAiSettings} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Nguồn tạo ảnh</label>
              <select
                value={aiSettings.imageProvider}
                onChange={(e) =>
                  setAiSettings((prev) => ({
                    ...prev,
                    imageProvider: e.target.value
                  }))
                }
                className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500"
              >
                <option value="auto">Auto (Gemini trước, Pollinations fallback)</option>
                <option value="gemini-only">Gemini only</option>
                <option value="pollinations-only">Pollinations only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-600 mb-1">Gemini API key</label>
              <input
                type="password"
                value={aiSettings.geminiApiKeyInput}
                onChange={(e) =>
                  setAiSettings((prev) => ({
                    ...prev,
                    geminiApiKeyInput: e.target.value
                  }))
                }
                placeholder="Nhập key mới để thay thế"
                className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-rose-500"
              />
              <p className="text-xs text-slate-500 mt-2">
                {aiSettings.hasGeminiApiKey
                  ? `Đã lưu key: ${aiSettings.maskedGeminiApiKey}`
                  : "Chưa có key Gemini trong cài đặt admin, hệ thống sẽ dùng biến môi trường nếu có."}
              </p>
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={aiSettings.clearGeminiApiKey}
                  onChange={(e) =>
                    setAiSettings((prev) => ({
                      ...prev,
                      clearGeminiApiKey: e.target.checked
                    }))
                  }
                />
                Xóa key đã lưu trên hệ thống
              </label>
            </div>

            <div className="text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
              {aiSettings.imageProvider === "auto" && "Auto: thử Gemini trước, nếu lỗi sẽ fallback Pollinations."}
              {aiSettings.imageProvider === "gemini-only" && "Gemini only: chỉ dùng model Gemini để tạo ảnh."}
              {aiSettings.imageProvider === "pollinations-only" && "Pollinations only: bỏ qua model image Gemini, dùng Pollinations để tạo ảnh."}
            </div>

            <button type="submit" disabled={savingAiSettings} className="px-5 py-2.5 bg-rose-700 text-white font-semibold rounded-lg hover:bg-rose-800 transition disabled:opacity-60">
              {savingAiSettings ? "Đang lưu..." : "Lưu cài đặt AI"}
            </button>
          </form>
        </div>
      )}
      </div>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        <button
          type="button"
          onClick={handleCheckDbStats}
          disabled={checkingDbStats}
          className="px-4 py-3 rounded-xl bg-orange-500 text-white text-sm font-bold shadow-lg hover:bg-orange-600 transition disabled:opacity-60"
        >
          {checkingDbStats ? "Dang check..." : "Debug DB Size"}
        </button>

        <button
          type="button"
          onClick={handleCleanupLegacyBase64}
          disabled={cleaningBase64}
          className="px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-bold shadow-lg hover:bg-red-700 transition disabled:opacity-60"
        >
          {cleaningBase64 ? "Dang cleanup DB..." : "Clean Base64 DB"}
        </button>
      </div>
    </div>
  );
}
