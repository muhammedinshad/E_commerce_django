import React, { useEffect, useState } from 'react'
import { useFrame } from '../../../logic/productFrame'
import { useSelector, useDispatch } from 'react-redux'
import { setProduct } from '../../../redux/userSlice'
import { getAllProducts } from '../../../api/api'

function Product() {
    const search = useSelector((state) => state.user.search);
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

        getAllProducts(token, search, '', page)
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
    }, [search, page]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const totalPages = Math.ceil(totalCount / 20);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[40vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div>
            {productData.length > 0 ? (
                <>
                    {useFrame(productData, (data) => dispatch(setProduct(data)))}

                    {/* ← Pagination Buttons */}
                    <div className="flex justify-center items-center gap-4 mt-8 mb-6">
                        <button
                            onClick={() => setPage(p => p - 1)}
                            disabled={!prevPage}
                            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            ← Prev
                        </button>

                        {/* Page numbers */}
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`px-4 py-2 rounded-lg transition ${page === i + 1
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!nextPage}
                            className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Next →
                        </button>
                    </div>

                    {/* Page info */}
                    <p className="text-center text-gray-500 text-sm mb-6">
                        Page {page} of {totalPages} — {totalCount} products
                    </p>
                </>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">No shoes found for "{search}"</p>
                    <p className="text-sm">Try a different search term</p>
                </div>
            )}
        </div>
    );
}

export default Product