import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, form);


    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));

    // ✅ ADD THIS LINE
    localStorage.setItem('userEmail', res.data.user.email);

    navigate('/dashboard');
  } catch (err) {
    setMessage(err.response?.data?.message || 'Login failed');
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="w-full p-2 mb-4 border rounded" required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange}
            className="w-full p-2 mb-4 border rounded" required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Login</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-700">
          Don’t have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
        </p>
        {message && <p className="mt-4 text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
