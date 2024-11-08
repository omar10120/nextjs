// src/Component/ProductCard.js
import React from 'react';
import { useCart } from '../context/CartContext';



function ProductCard({ product }) {
  const { addToCart } = useCart(); 

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <img
        src='https://i.ibb.co/4YvyDsZ/2.png' 
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">Product: {product.name}</h3>
        <p className="text-gray-600 mt-2">Price: ${product.price}</p>
        <hr />
        <p className="text-gray-700 mt-2 text-sm font-bold">
          Description: {product.description}
        </p>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          onClick={() => addToCart(product)} 
        >
          Add to Cart
        </button>
      </div>

    </div>
  );
}

export default ProductCard;
