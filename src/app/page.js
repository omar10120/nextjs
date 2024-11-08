// src/pages/index.js
"use client";
import { useState, useEffect, useRef } from 'react';
import FetchData from '../Component/FetchData';
import Products from '../Component/Products';
import Navbar from '../Component/Navbar';
import Register from '../Component/register';
import Users from '../Component/Users';
import Cart from '../Component/Cart';
import { isAuthenticated, handleLogout } from '../lib/auth';
import { CartProvider } from '../context/CartContext'; // Import CartProvider
import Payment from '@/Component/Payment';
import Confirmation from '@/Component/confirmation';
import { UserProvider } from '../context/UserContext';





export default function Home(Component ,pageProps ) {
  const [activeView, setActiveView] = useState("products");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const clearMessageRef = useRef(null);

  const handleSetClearMessage = (clearFn) => {
    clearMessageRef.current = clearFn;
  };

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setActiveView("dashboard");
  };

  return (
    <CartProvider> {/* Wrap the app with CartProvider */}
    <UserProvider>
        {/* <Component {...pageProps} /> */}



      {isLoggedIn ? (
        <Navbar setActiveView={setActiveView} setIsLoggedIn={setIsLoggedIn} />
      ) : null}

      <div className="container mx-auto px-4 w-10/12 bg-gray-200 my-10 h-full">
        {isLoggedIn ? (
          activeView === "dashboard" ? (
            <FetchData />
          ) : activeView === "Register" ? (
            <Register mode="Registered" />
          ) : activeView === "Login" && !isLoggedIn ? (
            <Register mode="login" setIsLoggedIn={setIsLoggedIn} setActiveView={setActiveView} />
          ) : activeView === "Users" ? (
            <Users />
          )  : activeView === "Payment" ?  <Payment/> : (
            [<Products/> ,<Cart/>]
          )
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl mb-4">Welcome! Please log in or register to access the dashboard.</h2>
            {activeView === "register" ? (
              <Register
                mode="register"
                onAuthSuccess={handleAuthSuccess}
                onClearMessage={handleSetClearMessage}
              />
            ) : (
              <Register
                mode="login"
                onAuthSuccess={handleAuthSuccess}
                setIsLoggedIn={setIsLoggedIn}
                setActiveView={setActiveView}
                onClearMessage={handleSetClearMessage}
              />
            )}
            <button
              onClick={() => {
                if (clearMessageRef.current) clearMessageRef.current();
                setActiveView(activeView === "register" ? "login" : "register");
              }}
              className="mt-4 text-blue-500 underline"
            >
              {activeView === "register" ? "Already have an account? Log in" : "Don't have an account? Register"}
            </button>
          </div>
        )}
      </div>
      </UserProvider>
 
    </CartProvider>
    
  );
}
