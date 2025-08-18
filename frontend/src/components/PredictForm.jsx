import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PredictionContext } from '../context/PredictionContext';

const PredictForm = ({ user }) => {
  const [form, setForm] = useState({
    age: '',
    sex: '0',
    bmi: '',
    children: '',
    smoker: '1',
    region: '0'
  });

  const { setPredictionData } = useContext(PredictionContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await user.getIdToken();

      const res = await axios.post('http://127.0.0.1:5000/predict', {
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

      setPredictionData({
        result: res.data.predicted_charges,
        contributors: res.data.all_contributors || [],
        email: user.email
      });

      navigate('/result');

    } catch (err) {
      console.error(err);
      alert("❌ Prediction failed.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Insurance Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="age" type="number" placeholder="Age" required onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="sex" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="0">Male</option>
          <option value="1">Female</option>
        </select>
        <input name="bmi" type="number" step="0.1" placeholder="BMI" required onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="children" type="number" placeholder="Children" required onChange={handleChange} className="w-full p-2 border rounded" />
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Predict</button>
      </form>
    </div>
  );
};

export default PredictForm;
