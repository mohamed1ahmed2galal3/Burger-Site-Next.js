"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Clock,
  Truck,
  CheckCircle,
  Link2,
  Upload,
  X,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getProducts } from "@/lib/api/products.js";
import { getOrders, updateOrderStatus, addProduct, updateProduct, deleteProduct } from "@/lib/api/admin.js";

const statusOptions = [
  { key: "pending", label: "قيد الانتظار", icon: <Clock size={14} /> },
  { key: "preparing", label: "جاري التحضير", icon: <Package size={14} /> },
  { key: "out_for_delivery", label: "خرج للتوصيل", icon: <Truck size={14} /> },
  { key: "delivered", label: "تم التوصيل", icon: <CheckCircle size={14} /> },
];

const categories = [
  { id: "chicken", label: "تشكن 🍗" },
  { id: "beef", label: "بيف 🥩" },
  { id: "addons", label: "إضافات ➕" },
];

function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "chicken",
    featured: false,
  });
  const [imageMode, setImageMode] = useState("link"); // "link" أو "upload"
  const [imageError, setImageError] = useState("");
  const [fullPreview, setFullPreview] = useState(null); // { src, source: "add" | "edit" }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [editTarget, setEditTarget] = useState(null); // المنتج اللي بيتعدل دلوقتي (أو null)
  const [editForm, setEditForm] = useState(null);
  const [editImageMode, setEditImageMode] = useState("link");
  const [editImageError, setEditImageError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (!savedToken) {
      router.push("/admin");
      return;
    }
    setToken(savedToken);
    loadData(savedToken);
  }, []);

  function loadData(authToken) {
    setLoading(true);
    Promise.all([getOrders(authToken), getProducts()])
      .then(([ordersRes, productsRes]) => {
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        router.push("/admin");
      })
      .finally(() => setLoading(false));
  }

  function handleLogout() {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  }

  function handleStatusChange(orderId, status) {
    updateOrderStatus(orderId, status, token)
      .then(() => {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
        toast.success("تم تحديث الحالة ✅");
      })
      .catch(() => toast.error("في مشكلة، حاول تاني"));
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("الملف ده لازم يكون صورة");
      return;
    }
    // حد أقصى 2 ميجا (بعد التحويل لـ base64 الحجم بيزيد ~33%، فلازم نسيب مساحة)
    if (file.size > 2 * 1024 * 1024) {
      setImageError("الصورة كبيرة، حاول صورة أصغر من 2 ميجا");
      return;
    }

    setImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      setNewProduct((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleAddProduct() {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      toast.error("كمل البيانات الأساسية");
      return;
    }
    setSubmitting(true);
    addProduct({ ...newProduct, price: Number(newProduct.price) }, token)
      .then((res) => {
        setProducts((prev) => [...prev, res.data]);
        setNewProduct({ name: "", description: "", price: "", image: "", category: "chicken", featured: false });
        setImageMode("link");
        toast.success("المنتج اتضاف ✅");
      })
      .catch(() => toast.error("في مشكلة، حاول تاني"))
      .finally(() => setSubmitting(false));
  }

  function handleDeleteProduct(id) {
    deleteProduct(id, token)
      .then(() => {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("تم الحذف 🗑️");
      })
      .catch(() => toast.error("في مشكلة، حاول تاني"))
      .finally(() => setDeleteTarget(null));
  }

  function openEditModal(product) {
    setEditTarget(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      featured: product.featured,
    });
    // لو الصورة base64 (مرفوعة من قبل) نفتحها في وضع "رفع"، لو رابط عادي نفتحها في وضع "رابط"
    setEditImageMode(product.image?.startsWith("data:") ? "upload" : "link");
    setEditImageError("");
  }

  function closeEditModal() {
    setEditTarget(null);
    setEditForm(null);
  }

  function handleEditImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditImageError("الملف ده لازم يكون صورة");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setEditImageError("الصورة كبيرة، حاول صورة أصغر من 2 ميجا");
      return;
    }

    setEditImageError("");
    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function handleUpdateProduct() {
    if (!editForm.name || !editForm.price || !editForm.image) {
      toast.error("كمل البيانات الأساسية");
      return;
    }
    setEditSubmitting(true);
    updateProduct(editTarget._id, { ...editForm, price: Number(editForm.price) }, token)
      .then((res) => {
        setProducts((prev) => prev.map((p) => (p._id === editTarget._id ? res.data : p)));
        toast.success("تم تعديل المنتج ✅");
        closeEditModal();
      })
      .catch(() => toast.error("في مشكلة، حاول تاني"))
      .finally(() => setEditSubmitting(false));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-400 font-black text-lg">
            <img src="/logo.png" alt="Last Burger" className="w-9 h-9 rounded-lg object-cover" />
            <span className="tracking-wide" style={{ fontFamily: "'Bangers', cursive" }}>LAST BURGER ADMIN</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm font-medium transition-colors"
          >
            <LogOut size={16} />
            خروج
          </motion.button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${
              tab === "orders" ? "bg-orange-500 text-white" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
            }`}
          >
            <ShoppingBag size={16} />
            الأوردرات ({orders.length})
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-colors ${
              tab === "products" ? "bg-orange-500 text-white" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
            }`}
          >
            <Package size={16} />
            المنتجات ({products.length})
          </motion.button>
        </div>

        <AnimatePresence mode="wait">
          {tab === "orders" ? (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {orders.length === 0 ? (
                <p className="text-zinc-500 text-center py-16">لسه مفيش أوردرات</p>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order._id}
                    layout
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-bold">{order.customerName}</p>
                        <p className="text-zinc-500 text-sm">{order.phone}</p>
                        {order.altPhone && (
                          <p className="text-zinc-500 text-sm">رقم بديل: {order.altPhone}</p>
                        )}
                      </div>
                      <p className="text-orange-400 font-black">{order.totalPrice} جنيه</p>
                    </div>

                    <p className="text-zinc-500 text-sm mb-3">{order.address}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {order.items.map((item, i) => (
                        <span key={i} className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full">
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status.key}
                          onClick={() => handleStatusChange(order._id, status.key)}
                          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                            order.status === status.key
                              ? "bg-orange-500 text-white"
                              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                          }`}
                        >
                          {status.icon}
                          {status.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Add Product Form */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-orange-400" />
                  ضيف منتج جديد
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="اسم المنتج"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-right"
                  />
                  <input
                    type="number"
                    placeholder="السعر"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-right"
                  />
                </div>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setImageMode("link")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      imageMode === "link" ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Link2 size={13} />
                    رابط الصورة
                  </button>
                  <button
                    onClick={() => setImageMode("upload")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      imageMode === "upload" ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    <Upload size={13} />
                    رفع من الجهاز
                  </button>
                </div>

                {imageMode === "link" ? (
                  <input
                    type="text"
                    placeholder="رابط الصورة"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 mb-3 focus:outline-none focus:border-orange-500 text-right"
                  />
                ) : (
                  <div className="mb-3">
                    <label className="flex items-center justify-center gap-2 w-full bg-zinc-950 border border-dashed border-zinc-700 text-zinc-400 rounded-xl py-4 px-4 cursor-pointer hover:border-orange-500/50 hover:text-orange-400 transition-colors">
                      <Upload size={16} />
                      <span className="text-sm">اضغط لرفع صورة من التليفون أو الجهاز</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {imageError && <p className="text-red-400 text-xs mt-2">{imageError}</p>}
                    {newProduct.image && imageMode === "upload" && (
                      <div className="relative mt-3">
                        <img
                          src={newProduct.image}
                          alt="معاينة"
                          onClick={() => setFullPreview({ src: newProduct.image, source: "add" })}
                          className="w-full h-32 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        <button
                          onClick={() => setNewProduct((prev) => ({ ...prev, image: "" }))}
                          className="absolute top-2 left-2 bg-zinc-950/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                          title="مسح الصورة"
                        >
                          <X size={14} />
                        </button>
                        <p className="text-zinc-500 text-xs mt-1.5 text-center">دوس على الصورة عشان تشوفها كبيرة</p>
                      </div>
                    )}
                  </div>
                )}
                <textarea
                  placeholder="الوصف"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 mb-3 focus:outline-none focus:border-orange-500 text-right resize-none"
                />
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.featured}
                      onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                      className="accent-orange-500"
                    />
                    منتج مميز ⭐
                  </label>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddProduct}
                  disabled={submitting}
                  className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
                >
                  {submitting ? "بيتم الإضافة..." : "ضيف المنتج"}
                </motion.button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    layout
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
                  >
                    <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-bold">{product.name}</p>
                        {product.featured && <span className="text-yellow-400 text-sm">⭐</span>}
                      </div>
                      <p className="text-orange-400 font-black mb-3">{product.price} جنيه</p>
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openEditModal(product)}
                          className="flex items-center gap-1.5 text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors"
                        >
                          <Pencil size={14} />
                          تعديل
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setDeleteTarget(product)}
                          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                        >
                          <Trash2 size={14} />
                          حذف
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Image Preview */}
      <AnimatePresence>
        {fullPreview && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullPreview(null)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={fullPreview?.src} alt="معاينة كاملة" className="w-full max-h-[75vh] object-contain rounded-2xl" />
              <div className="flex gap-3 mt-4 justify-center">
                <button
                  onClick={() => setFullPreview(null)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-2.5 rounded-full transition-colors"
                >
                  تمام، سيبها
                </button>
                <button
                  onClick={() => {
                    if (fullPreview.source === "edit") {
                      setEditForm((prev) => ({ ...prev, image: "" }));
                    } else {
                      setNewProduct((prev) => ({ ...prev, image: "" }));
                    }
                    setFullPreview(null);
                  }}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium px-6 py-2.5 rounded-full transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  مسحها
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editTarget && editForm && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center px-4 py-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditModal}
          >
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full my-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Pencil size={18} className="text-orange-400" />
                  تعديل المنتج
                </h3>
                <button onClick={closeEditModal} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="اسم المنتج"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-right"
                />
                <input
                  type="number"
                  placeholder="السعر"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500 text-right"
                />
              </div>

              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setEditImageMode("link")}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    editImageMode === "link" ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <Link2 size={13} />
                  رابط الصورة
                </button>
                <button
                  onClick={() => setEditImageMode("upload")}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    editImageMode === "upload" ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <Upload size={13} />
                  رفع من الجهاز
                </button>
              </div>

              {editImageMode === "link" ? (
                <input
                  type="text"
                  placeholder="رابط الصورة"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 mb-3 focus:outline-none focus:border-orange-500 text-right"
                />
              ) : (
                <div className="mb-3">
                  <label className="flex items-center justify-center gap-2 w-full bg-zinc-950 border border-dashed border-zinc-700 text-zinc-400 rounded-xl py-4 px-4 cursor-pointer hover:border-orange-500/50 hover:text-orange-400 transition-colors">
                    <Upload size={16} />
                    <span className="text-sm">اضغط لرفع صورة من التليفون أو الجهاز</span>
                    <input type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden" />
                  </label>
                  {editImageError && <p className="text-red-400 text-xs mt-2">{editImageError}</p>}
                </div>
              )}

              {editForm.image && (
                <div className="relative mb-3">
                  <img
                    src={editForm.image}
                    alt="معاينة"
                    onClick={() => setFullPreview({ src: editForm.image, source: "edit" })}
                    className="w-full h-32 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <button
                    onClick={() => setEditForm((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-2 left-2 bg-zinc-950/80 hover:bg-red-500 text-white rounded-full p-1.5 transition-colors"
                    title="مسح الصورة"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <textarea
                placeholder="الوصف"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-2.5 px-4 mb-3 focus:outline-none focus:border-orange-500 text-right resize-none"
              />

              <div className="flex flex-wrap items-center gap-3 mb-5">
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 text-white rounded-xl py-2.5 px-4 focus:outline-none focus:border-orange-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-2 text-zinc-400 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.featured}
                    onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                    className="accent-orange-500"
                  />
                  منتج مميز ⭐
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeEditModal}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2.5 rounded-full transition-colors"
                >
                  إلغاء
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpdateProduct}
                  disabled={editSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-2.5 rounded-full transition-colors"
                >
                  {editSubmitting ? "بيتم الحفظ..." : "حفظ التعديل"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-red-500/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-400" size={24} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">متأكد إنك عايز تحذف؟</h3>
              <p className="text-zinc-400 text-sm mb-6">
                "{deleteTarget.name}" هتمسح من المنيو نهائيًا ومش هترجع.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-6 py-2.5 rounded-full transition-colors"
                >
                  لا، رجعني
                </button>
                <button
                  onClick={() => handleDeleteProduct(deleteTarget._id)}
                  className="bg-red-500 hover:bg-red-400 text-white font-medium px-6 py-2.5 rounded-full transition-colors"
                >
                  أيوة، احذفها
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
