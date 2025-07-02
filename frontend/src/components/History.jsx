import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const History = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get('http://localhost:5000/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setHistory(res.data);
      } catch (err) {
        setError("⚠️ Unable to fetch history.");
        console.error(err);
      }
    };

    fetchHistory();
  }, [user]);

  const regionMap = {
    0: "Southeast",
    1: "Southwest",
    2: "Northeast",
    3: "Northwest"
  };

  const reversedData = [...history].reverse();

  return (
    <div className="mt-8 p-6 bg-white rounded shadow max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-center text-gray-700 mb-4">📅 Prediction History</h3>

      {error && <p className="text-red-600 text-center">{error}</p>}

      {history.length === 0 ? (
        <p className="text-gray-500 text-center">No predictions yet.</p>
      ) : (
        <>
          {/* Line Chart First */}
          <div className="mb-6">
            <h4 className="text-md font-semibold mb-2 text-gray-700">📈 Premium Over Time</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reversedData}>
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Line type="monotone" dataKey="result" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Table Second */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full text-sm border">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="px-2 py-1">Age</th>
                  <th>BMI</th>
                  <th>Children</th>
                  <th>Smoker</th>
                  <th>Region</th>
                  <th>Cost (₹)</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-2 py-1">{row.age}</td>
                    <td>{row.bmi}</td>
                    <td>{row.children}</td>
                    <td>{row.smoker === 0 ? "Yes" : "No"}</td>
                    <td>{regionMap[row.region]}</td>
                    <td>₹{row.result}</td>
                    <td>{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default History;
