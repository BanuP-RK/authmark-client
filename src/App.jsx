
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Upload from './pages/Upload';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  

  const token = localStorage.getItem("token");
  

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={
          token ? <Navigate to="/upload" /> : <Navigate to="/login" />
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/upload" element={
          <ProtectedRoute><Upload /></ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

       
      </Routes>
    </>
  );
}

export default App;
