import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteProducts, updateProduct, getAllProducts } from "../../api/api";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiPackage, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

function AdminProducts() {
  const navigate = useNavigate();

  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectProduct, setSelectProduct] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const getToken = () => localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');

  useEffect(() => {
    const token = getToken();
    setLoading(true);
    getAllProducts(token, search, '', page)
      .then((res) => {
        setProductData(res.data.results);
        setTotalCount(res.data.count);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = getToken();
      await deleteProducts(id, token);
      toast.success("Product removed from inventory");
      setProductData(productData.filter((p) => p.id !== id));
    } catch (e) {
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = (product) => {
    setSelectProduct({ ...product });
    setShowEdit(true);
  };

  const handleUpdate = async (id) => {
    try {
      const token = getToken();
      await updateProduct(id, selectProduct, token);
      setProductData((prev) => prev.map((p) => (p.id === id ? selectProduct : p)));
      setShowEdit(false);
      toast.success("Product updated successfully!");
    } catch (err) {
      toast.error("Failed to update product.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 mt-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-gray-500 mt-1">Manage your products, pricing, and stock levels.</p>
          </div>
          <button
            onClick={() => navigate("/adminpage/adminaddproduct")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <FiPlus className="text-lg" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats & Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <FiPackage className="text-indigo-500" />
            <span>Total Products: {totalCount}</span>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400">Loading catalog...</td></tr>
                ) : productData.map((p) => (
                  <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover ring-1 ring-gray-200" />
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.brand}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">₹{p.price}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {p.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(p)} className="p-2 hover:bg-white rounded-lg text-blue-600 shadow-sm border border-transparent hover:border-blue-100 transition-all">
                          <FiEdit2 />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-white rounded-lg text-red-600 shadow-sm border border-transparent hover:border-red-100 transition-all">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <button
              disabled={!prevPage}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FiChevronLeft /> Previous
            </button>
            <span className="text-sm text-gray-500 font-medium">Page {page}</span>
            <button
              disabled={!nextPage}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEdit && selectProduct && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
              <button onClick={() => setShowEdit(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={selectProduct.name}
                  onChange={(e) => setSelectProduct({ ...selectProduct, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={selectProduct.price}
                    onChange={(e) => setSelectProduct({ ...selectProduct, price: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={selectProduct.stock}
                    onChange={(e) => setSelectProduct({ ...selectProduct, stock: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={selectProduct.brand}
                  onChange={(e) => setSelectProduct({ ...selectProduct, brand: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowEdit(false)}
                className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => handleUpdate(selectProduct.id)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;