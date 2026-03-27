import React from 'react'
import NaveBar from '../../../Components/NaveBar';
import { useFrame } from '../../../logic/productFrame';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { getAllProducts } from '../../../api/api';


function Adidas() {
  const [productData, setProductData] = useState([]);
  //  search method
  const search = useSelector((state) => state.user.search);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let token = localStorage.getItem("accessToken")
    if (token) token = token.replace(/^"|"$/g, '');

    getAllProducts(token, search, "Adidas")
      .then((res) => {
        setProductData(res.data.results);
        setTotalCount(res.data.count);
        setNextPage(res.data.next);
        setPrevPage(res.data.previous);
      })
      .catch((erorr) => {
        console.log("product fetch data erro: ", erorr.message)
      })
  }, [search, page])

  return (
    <div>
      <div>
        <img src="adidas.png" alt="" className=' w-full mt-4' />
      </div>
      <div id="product-section">
      {productData.length > 0 ? (
        useFrame(productData)
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl"> No shoes found for "{search}"</p>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  </div>
  )
}

export default Adidas
