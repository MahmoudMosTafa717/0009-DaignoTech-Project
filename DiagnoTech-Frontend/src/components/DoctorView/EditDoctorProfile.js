import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";

const EditDoctorProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    experience: '',
    specialty: '',
    clinicAddress: '',
    contact: '',
    googleMapsLink: '',
    whatsappLink: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const API_ENDPOINTS = {
    doctor: `${BASE_URL}/api/doctorprofile/myprofile`,
    update: `${BASE_URL}/api/doctorprofile/myprofile/update`,
  };

  // Fetch current doctor profile data
  useEffect(() => {
    const token = localStorage.getItem('jwt');

    const fetchDoctorData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(API_ENDPOINTS.doctor, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const doctorData = response.data.data;
        setFormData({
          fullName: doctorData.fullName || '',
          age: doctorData.age || '',
          experience: doctorData.experience || '',
          specialty: doctorData.specialty || '',
          clinicAddress: doctorData.clinicAddress || '',
          contact: doctorData.phone || '',
          googleMapsLink: doctorData.googleMapsLink || '',
          whatsappLink: doctorData.whatsappLink || ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        setError('Failed to load doctor profile. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [API_ENDPOINTS.doctor]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('jwt');
      const response = await axios.put(
        API_ENDPOINTS.update,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          navigate('/DoctorView');
        }, 2000);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/DoctorView');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', background: 'linear-gradient(135deg, #e6f0fa, #ffffff)' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3 text-primary fw-bold">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="edit-doctor-profile-container">
      <div className="container py-5">
        <div className="card border-0 shadow-lg rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary mb-0">
              <i className="bi bi-person-gear me-2"></i>Edit Your Profile
            </h2>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate('/DoctorView')}
              title="Back to Profile"
            >
              <i className="bi bi-arrow-left me-2"></i>Back
            </button>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess(null)} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="form-group position-relative">
                  <label htmlFor="fullName" className="form-label fw-bold text-muted">
                    Full Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group position-relative">
                  <label htmlFor="age" className="form-label fw-bold text-muted">
                    Age
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-calendar"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control form-control-lg"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      min="18"
                      required
                      placeholder="Enter your age"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group position-relative">
                  <label htmlFor="specialty" className="form-label fw-bold text-muted">
                    Specialty
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-briefcase"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your specialty"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group position-relative">
                  <label htmlFor="experience" className="form-label fw-bold text-muted">
                    Experience
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-clock-history"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group position-relative">
                  <label htmlFor="clinicAddress" className="form-label fw-bold text-muted">
                    Clinic Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-geo-alt"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="clinicAddress"
                      name="clinicAddress"
                      value={formData.clinicAddress}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter clinic address"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group position-relative">
                  <label htmlFor="contact" className="form-label fw-bold text-muted">
                    Contact Number
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-telephone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control form-control-lg"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group position-relative">
                  <label htmlFor="googleMapsLink" className="form-label fw-bold text-muted">
                    Google Maps Link
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-map"></i>
                    </span>
                    <input
                      type="url"
                      className="form-control form-control-lg"
                      id="googleMapsLink"
                      name="googleMapsLink"
                      value={formData.googleMapsLink}
                      onChange={handleInputChange}
                      placeholder="Enter Google Maps link (optional)"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="form-group position-relative">
                  <label htmlFor="whatsappLink" className="form-label fw-bold text-muted">
                    WhatsApp Link
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-whatsapp"></i>
                    </span>
                    <input
                      type="url"
                      className="form-control form-control-lg"
                      id="whatsappLink"
                      name="whatsappLink"
                      value={formData.whatsappLink}
                      onChange={handleInputChange}
                      placeholder="Enter WhatsApp link (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-5">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg px-4"
                onClick={handleCancel}
              >
                <i className="bi bi-x-circle me-2"></i>Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg px-4"
              >
                <i className="bi bi-save me-2"></i>Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDoctorProfile;