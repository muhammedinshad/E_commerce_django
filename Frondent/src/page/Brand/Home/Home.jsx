import React, { useState } from 'react';
import Product from './Product';
import Footer from "../../../Components/Footer";

function Home() {
    return (
        <div>
            <video
                src="/intro2.mp4"
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", display: "block" }}
            />
            <Product />
            <Footer />
        </div>
    );
}
export default Home;