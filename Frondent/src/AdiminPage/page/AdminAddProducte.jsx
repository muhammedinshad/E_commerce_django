import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addProducts, getBrands } from "../../api/api";
import { FiPlus, FiBox, FiImage, FiTag, FiDollarSign, FiLayers, FiX, FiArrowLeft } from "react-icons/fi";

function AddProduct() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    image: "",
    stock: "",
    sizes: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, "");
    getBrands(token)
      .then((res) => setBrands(res.data))
      .catch((e) => console.log(e));
  }, []);

  const handleAddSize = () => {
    const size = parseInt(sizeInput);
    if (!sizeInput || isNaN(size)) {
      toast.warn("Enter a valid size!");
      return;
    }
    if (formData.sizes.includes(size)) {
      toast.warn("Size already exists");
      return;
    }
    setFormData({ ...formData, sizes: [...formData.sizes, size] });
    setSizeInput("");
  };

  const handleRemoveSize = (size) => {
    setFormData({ ...formData, sizes: formData.sizes.filter((s) => s !== size) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.sizes.length === 0) {
      toast.warn("Add at least one size!");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, "");
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      await addProducts(token, payload);
      toast.success("New product launched!");
      navigate("/adminpage/adminproducts");
    } catch (err) {
      toast.error("Failed to sync product");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 mt-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation Header */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
        >
          <FiArrowLeft /> Back to Inventory
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image Preview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-24">
              <div className="aspect-square bg-slate-100 rounded-2rem overflow-hidden relative flex items-center justify-center border-2 border-dashed border-slate-200">
                {formData.image ? (
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/400?text=Invalid+URL" }}
                  />
                ) : (
                  <div className="text-center p-6">
                    <FiImage className="mx-auto text-slate-300 mb-2" size={48} />
                    <p className="text-slate-400 text-sm font-medium">Image preview will appear here</p>
                  </div>
                )}
              </div>
              <div className="mt-6 p-2">
                <h3 className="font-bold text-slate-800 truncate">{formData.name || "Product Name"}</h3>
                <p className="text-indigo-600 font-bold text-lg">₹{formData.price || "0.00"}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="mb-8">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Product</h2>
                <p className="text-slate-500 mt-1">List a new item in your digital storefront.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Product Name */}
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Product Identity</label>
                  <div className="relative">
                    <FiTag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Air Max 270"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">The Details</label>
                  <textarea
                    name="description"
                    placeholder="Tell your customers about this product..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    required
                  />
                </div>

                {/* Price & Stock Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Pricing</label>
                    <div className="relative">
                      <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        name="price"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Initial Inventory</label>
                    <div className="relative">
                      <FiBox className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        name="stock"
                        placeholder="Quantity"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Brand & Image URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Brand Selection</label>
                    <select
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Choose Brand</option>
                      {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="relative group">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Direct Image Link</label>
                    <div className="relative">
                      <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="image"
                        placeholder="https://images.com/..."
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sizes Management */}
                <div className="bg-slate-50 p-6 rounded-2rem border border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-3 block">Available Sizes</label>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="number"
                      placeholder="Size (e.g. 42)"
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSize())}
                      className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="bg-slate-900 text-white px-6 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes.map((size) => (
                      <span key={size} className="bg-white text-indigo-600 pl-4 pr-2 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 border border-indigo-50 animate-in fade-in zoom-in duration-200">
                        {size}
                        <button type="button" onClick={() => handleRemoveSize(size)} className="p-1 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors">
                          <FiX size={14} />
                        </button>
                      </span>
                    ))}
                    {formData.sizes.length === 0 && <p className="text-slate-400 text-xs italic p-1">No sizes specified yet</p>}
                  </div>
                </div>

                {/* Final Submit */}
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-1.5rem shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
                >
                  Confirm & Upload Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;