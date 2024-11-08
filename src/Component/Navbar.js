// components/Navbar.js
'use client';

import React, { useEffect, useState } from 'react';
import { isAuthenticated, handleLogout } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext'; // Import useUser


export default function Navbar({ setActiveView, setIsLoggedIn }) {
  const router = useRouter();
  const [hasOrders, setHasOrders] = useState(false); // Track if user has orders
  const { userId } = useUser(); // Access userId from context
  
  const useridLocalStorge = localStorage.getItem("userid")



  useEffect(() => {
    if (useridLocalStorge) {
      const checkUserOrders = async () => {
        try {
          const response = await fetch(`/api/orders?userId=${useridLocalStorge}`);
          const orders = await response.json();
          setHasOrders(response.ok && orders.length > 0);
    
        } catch (error) {
          console.error('Error fetching user orders:', error);
          setHasOrders(false);
        }
      };

      checkUserOrders();
    }
  }, [userId]);

  const handlelogout = () => {
    handleLogout();
    setIsLoggedIn(false);
    setActiveView("Login");
  };

function fetchnavbar() {
  useEffect(() => {
    if (userId) {
      checkUserOrders(); // Fetch user orders on mount or when userId changes
    }
  }, [userId]);
}

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex ">
        <button
          onClick={() => setActiveView("dashboard")}
          className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveView("products")}
          className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
        >
          Products
        </button>
        <button
          onClick={() => setActiveView("Register")}
          className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
        >
          Register
        </button>
        <button
          onClick={() => setActiveView("Users")}
          className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
        >
          Users
        </button>

        {/* Conditionally render Payment button if the user has orders */}
        {hasOrders && (
          <button
            onClick={() => setActiveView("Payment")}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700"
          >
            Payment
          </button>
        )}

        <div className="grow flex justify-end">
          <button
            onClick={() => handlelogout()}
            className="text-white font-semibold px-4 py-2 rounded hover:bg-gray-700 bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
