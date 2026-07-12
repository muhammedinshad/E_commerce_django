import React, { useEffect, useState } from 'react'
import { useFrame } from '../../../logic/productFrame'
import { useSelector, useDispatch } from 'react-redux'
import { setProduct, setSearch,setBrand } from '../../../redux/userSlice' 
import { getAllProducts } from '../../../api/api'


function Product() {
    const search = useSelector((state) => state.user.search);
    const brand = useSelector((state) => state.user.brand);
    const dispatch = useDispatch();
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const token = localStorage.getItem("accessToken")?.replace(/^"|"$/g, '');
        setLoading(true);

        getAllProducts(token, search, brand, page)
            .then((res) => {
                setProductData(res.data.results);
                setTotalCount(res.data.count);
                setNextPage(res.data.next);
                setPrevPage(res.data.previous);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Fetch products error:", err);
                setLoading(false);
            });

        // return () => {
        //     dispatch(setSearch("")); 
        //     dispatch(setBrand(""));  
        // };
    }, [search, page, brand]);

    useEffect(() => {
    return () => {
        dispatch(setSearch(""));
        dispatch(setBrand(""));
    };
    }, []);

    useEffect(() => {
        setPage(1);
    }, [search, brand]);

    const brands = ["Nike", "Adidas", "Puma", "New Balance"];

    const handleSearch = (e) => {
        dispatch(setSearch(e.target.value));
    };

    const totalPages = Math.ceil(totalCount / 20);

    return (
        <div id="product-section" className="bg-white min-h-screen">
            
            {/* Section Title */}
            <div className="flex justify-center mt-32 md:mt-40">
                <h2 className="text-3xl font-light tracking-[0.3em] uppercase text-black">Sale</h2>
            </div>

            {/* Right: Search and Filter Container */}
            {/* Added px-10 for side gap */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col items-end gap-3 mt-10 mb-8">
                
                {/* 1. Search Bar */}
                {/* border radius changed to rounded-lg */}
                <div className="flex items-center px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 focus-within:border-blue-400 transition-all w-full md:w-64 shadow-sm">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search} 
                        onChange={handleSearch}
                        className="bg-transparent border-none text-sm focus:outline-none w-full text-black placeholder:text-gray-400"
                    />
                </div>

                {/* 2. Brand Filter Dropdown */}
                {/* border radius changed to rounded-lg */}
                <div className="relative w-full md:w-48">
                    <select 
                        value={brand}
                        onChange={(e)=>dispatch(setBrand(e.target.value))}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-lg text-xs focus:outline-none focus:border-blue-400 cursor-pointer transition-all shadow-sm"
                    >
                        <option value="">All Brands</option>
                        {brands.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 7.293 8.172 5.858 9.617l3.435 3.333z"/>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Content Logic */}
            {loading ? (
                <div className="flex justify-center items-center min-h-[40vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            ) : productData.length > 0 ? (
                <>
                    {useFrame(productData, (data) => dispatch(setProduct(data)))}

                    {/* Pagination Buttons */}
                    <div className="flex justify-center items-center gap-4 mt-12 mb-6">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={!prevPage}
                            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
                        >
                            ← Prev
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg transition text-sm ${page === i + 1
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!nextPage}
                            className="px-5 py-2 bg-black text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition text-sm"
                        >
                            Next →
                        </button>
                    </div>

                    <p className="text-center text-gray-400 text-xs mb-10 uppercase tracking-widest">
                        Page {page} of {totalPages} — {totalCount} items
                    </p>
                </>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl font-light tracking-wider">No shoes found for "{search}"</p>
                    <p className="text-sm mt-2">Try a different search term or brand</p>
                </div>
            )}
        </div>
    );
}

export default Product;