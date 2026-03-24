import React from 'react'
import NaveBar from '../../../Components/NaveBar'
import { useFrame } from '../../../logic/productFrame'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import { getAllProducts } from '../../../api/api';


function Nike() {

    const [productData, setProductData] = useState([]);
    //  search method
    const search = useSelector((state) => state.user.search);

    useEffect(() => {
        let token = localStorage.getItem("accessToken")
        if (token) token = token.replace(/^"|"$/g, '');

        getAllProducts(token, search, "Nike")
            .then((data) => {
                setProductData(data.data.results);
            })
            .catch((erorr) => {
                console.log("product fetch data erro: ", erorr.message)
            })
    }, [search])

    return (
        <div>
            <div>
                <img src="nike.jpg" alt="nike" className=' w-full mt-4' />
            </div>
            {productData.length > 0 ? (
                useFrame(productData)
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-xl">🔍 No shoes found for "{search}"</p>
                    <p className="text-sm">Try a different search term</p>
                </div>
            )}
        </div>
    )
}

export default Nike
