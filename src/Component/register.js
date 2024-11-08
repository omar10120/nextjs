"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserContext'; // Import useUser
export default function AuthForm({ mode = 'login', onAuthSuccess, setIsLoggedIn, setActiveView, onClearMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUserId } = useUser(); // Get setUserId from context
  const [userslist, setUsersList] = useState([]);

  // Function to get user ID based on username
  const getUserIdByUsername = (username) => {
    const user = userslist.find((user) => user.username === username);
    return user ? user.id : null;
  };

  // Fetch list of users on mount to keep userslist up to date
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/register');
      const result = await response.json();
      setUsersList(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = mode === 'login' ? '/api/auth/login/' : '/api/auth/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Success! ${mode === 'login' ? 'Logged in' : 'Registered'} successfully.`);

        if (mode === 'login') {
          localStorage.setItem('token', data.token);
          const userId = getUserIdByUsername(username);
          setUserId(userId);
          localStorage.setItem('userid', userId);
          setIsLoggedIn(true);
          setActiveView("Products");
        } else {
       

          // Fetch users list again to refresh `userslist` after registration
          fetchUsers();
        }
      } else if (response.status === 401) {
        setMessage(data.message || 'Username or Password is incorrect');
      } else {
        setMessage(data.message || 'Username already exists');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.' + error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {mode === 'login' ? 'Login to Your Account' : 'Create an Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-start">
            <label className="block text-gray-600 mb-1">Username:</label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Username"
            />
          </div>
          <div className="text-start">
            <label className="block text-gray-600 mb-1">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
          >
            {mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
