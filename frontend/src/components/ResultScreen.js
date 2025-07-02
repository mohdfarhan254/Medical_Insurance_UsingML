import React, { useContext } from 'react';
import { PredictionContext } from '../context/PredictionContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ResultScreen = () => {
  const { predictionData } = useContext(PredictionContext);

  if (!predictionData) return <div className="p-4 text-red-500">No prediction data found.</div>;

  const { result, contributors, email } = predictionData;

  const getAdvice = (feature, value) => {
    if (Math.abs(value) < 100) return null;
    switch (feature) {
      case "smoker":
        return value > 0 ? "🚭 Quit smoking to reduce cost." : "✅ Not smoking helps.";
      case "bmi":
        return value > 0 ? "🥗 Try lowering BMI." : "✅ Healthy BMI!";
      default:
        return null;
    }
  };

  const sendReminder = async () => {
    try {
      await axios.post('http://localhost:5000/send-reminder', { email });
      alert("📩 Email sent!");
    } catch (err) {
      alert("⚠️ Failed to send email.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
        💰 Estimated Premium: ₹{result}
      </h2>

      {/* 🔹 Main Flex Section: Graph + Contributors */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* 📊 Graph on the Left */}
        <div className="md:w-2/3">
          <h3 className="font-semibold mb-2">📊 Visual Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contributors}>
              <XAxis dataKey="feature" />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v.toFixed(2)}`} />
              <Bar dataKey="contribution" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🔍 Top Contributors on the Right */}
        <div className="md:w-1/3 bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">🔍 Top Contributors</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {contributors.map((item, i) => (
              <li key={i}>
                <strong>{item.feature}</strong>: {item.contribution.toFixed(2)}
                {getAdvice(item.feature, item.contribution) && (
                  <p className="text-gray-600">
                    💡 {getAdvice(item.feature, item.contribution)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 🔹 Email & Back */}
      <div className="mt-6 text-center">
        <button
          onClick={sendReminder}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send Health Reminder to Email
        </button>

        <div className="mt-4">
          <Link to="/" className="text-blue-600 underline">
            ← Back to Prediction Form
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
