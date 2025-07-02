import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AuthForm from './components/AuthForm';
import PredictForm from './components/PredictForm';
import ResultScreen from './components/ResultScreen';
import History from './components/History'; // ✅ import if you already had it
import { PredictionProvider } from './context/PredictionContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  if (!user) return <AuthForm onLogin={setUser} />;

  return (
    <PredictionProvider>
      <Router>
        {/* ✅ NAVBAR */}
        <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center">
          <h1 className="font-bold text-lg">💡 Insurance Predictor</h1>
          <div className="space-x-4">
            <Link to="/" className="hover:underline">Predict</Link>
            <Link to="/history" className="hover:underline">History</Link>
            <button
              onClick={() => signOut(auth)}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* ✅ ROUTES */}
        <Routes>
          <Route path="/" element={<PredictForm user={user} />} />
          <Route path="/result" element={<ResultScreen />} />
          <Route path="/history" element={<History user={user} />} />
        </Routes>
      </Router>
    </PredictionProvider>
  );
}

export default App;
