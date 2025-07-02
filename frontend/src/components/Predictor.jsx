// src/components/Predictor.js

import React, { useState } from 'react';
import axios from 'axios';

const Predictor = ({ user }) => {
  const [form, setForm] = useState({
    age: '',
    sex: '0',
    bmi: '',
    children: '',
    smoker: '1',
    region: '0'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const res = await axios.post('http://localhost:5000/predict', {
        age: parseInt(form.age),
        sex: parseInt(form.sex),
        bmi: parseFloat(form.bmi),
        children: parseInt(form.children),
        smoker: parseInt(form.smoker),
        region: parseInt(form.region)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResult(res.data.predicted_charges);
    } catch (err) {
      setError("⚠️ Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 text-center">Medical Insurance Predictor</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="number" name="age" placeholder="Age" onChange={handleChange} required className="w-full p-2 border rounded" />
        
        <select name="sex" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="0">Male</option>
          <option value="1">Female</option>
        </select>

        <input type="number" name="bmi" placeholder="BMI" onChange={handleChange} required step="0.1" className="w-full p-2 border rounded" />
        
        <input type="number" name="children" placeholder="Number of Children" onChange={handleChange} required className="w-full p-2 border rounded" />
        
        <select name="smoker" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="0">Yes</option>
          <option value="1">No</option>
        </select>

        <select name="region" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="0">Southeast</option>
          <option value="1">Southwest</option>
          <option value="2">Northeast</option>
          <option value="3">Northwest</option>
        </select>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Predicting..." : "Predict"}
        </button>
      </form>

      {result !== null && (
        <div className="mt-6 text-green-600 font-semibold text-center">
          Predicted Insurance Cost: ₹ {parseFloat(result).toFixed(2)}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-center">{error}</div>
      )}
    </div>
  );
};

export default Predictor;
