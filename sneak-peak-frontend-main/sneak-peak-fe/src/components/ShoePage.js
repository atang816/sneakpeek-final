import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Pricing from "./Pricing";
import Search from "./Search";

function ShoePage() {
  return (
    <div className="shoepage-container">
      <div className="shoepage-header">
        <img
          src="SneakPeek-logos.jpeg"
          alt="logo"
          width="120"
          height="120"
        ></img>
        <div className="shoepage-header2">
          <h1>SneakPeek</h1>
          <Link to="/" className="search-button">
            Home
          </Link>
        </div>
      </div>
      <div className="divider">
        <hr class="solid"></hr>
      </div>
      <div className="shoe-display">
        <h1>Jordan 4 Retro</h1>
        <h3 class="colorway">Bred 2019</h3>
        <img
          src="https://images.stockx.com/images/Air-Jordan-4-Retro-Black-Cement-2019-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1606316608"
          alt="bred4"
          width="429"
          height="278"
        ></img>
      </div>
      <div className="divider">
        <hr class="solid"></hr>
      </div>
      <Pricing />
      <Footer />
    </div>
  );
}

export default ShoePage;
