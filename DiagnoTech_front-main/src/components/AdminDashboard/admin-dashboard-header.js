import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminHeader.css';
import { FaSignOutAlt } from 'react-icons/fa';
export const AdminHeader = () => {
  const [,setUsername] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setUsername(storedName);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    navigate('/login');
  };
  return (
    <nav className="admin-header navbar navbar-expand-lg navbar-light bg-transparent px-4">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="navbar-brand fw-bold fs-4 text-dark" style={{ cursor: 'pointer' }} onClick={() => navigate('')}>
          Diagno<span style={{ color: "#0d6efd" }}>Tech</span>
        </div>
          <button className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </button>
      </div>
    </nav>
  );
};
