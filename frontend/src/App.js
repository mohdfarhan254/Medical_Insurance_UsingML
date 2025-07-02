// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthForm from './components/AuthForm';
import Predictor from './components/Predictor';
import History from './components/History';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  // 👤 Not logged in
  if (!user) return <AuthForm onLogin={setUser} />;

  return (
    <Router>
      {/* 🔷 Sticky Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold tracking-wide">💡 Insurance Predictor</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Predict</Link>
          <Link to="/history" className="hover:underline">History</Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🔷 Routes */}
      <Routes>
        <Route path="/" element={<Predictor user={user} />} />
        <Route path="/history" element={<History user={user} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

// 404 Not Found Page
const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    <h2 className="text-2xl font-bold text-red-600">404 - Page Not Found</h2>
  </div>
);

export default App;
