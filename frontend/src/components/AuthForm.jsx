import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      onLogin(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required className="w-full p-2 border rounded" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required className="w-full p-2 border rounded" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        <div className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="text-blue-600 ml-1" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
