import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './DoctorView.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from "../../config";

const DoctorView = () => {
  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  const [isLoading, setIsLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [acceptedAppointments, setAcceptedAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("custom-body");
    return () => {
      document.body.classList.remove("custom-body");
    };
  }, []);

  const API_ENDPOINTS = {
    doctor: `${BASE_URL}/api/doctorprofile/myprofile`,
    addSlot: `${BASE_URL}/api/doctorprofile/appointments/add`,
    getSlots: `${BASE_URL}/api/doctorprofile/appointments/all`,
    appointments: `${BASE_URL}/api/doctorprofile/appointments/all`,
    updateAppointmentStatus: `${BASE_URL}/api/doctorprofile/appointments/status`,
    reviews: `${BASE_URL}/api/doctorprofile/reviews`,
    deleteSlot: `${BASE_URL}/api/doctorprofile/appointments/delete`,
  };

  // Function to add a new toast notification
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

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

        setDoctor(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        console.error('Error response:', error.response ? error.response.data : 'No response data');
        setError('Failed to load doctor profile. Please try again.');
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [API_ENDPOINTS.doctor]);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    const fetchAvailableSlots = async () => {
      try {
        setError(null);

        const response = await axios.get(API_ENDPOINTS.getSlots, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.data && response.data.data.unbookedSlots) {
          setAvailableSlots(response.data.data.unbookedSlots);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
        console.error('Error response:', err.response ? err.response.data : 'No response data');
        setError('Failed to load available slots. Please try again.');
      }
    };

    const fetchAppointmentRequests = async () => {
      try {
        setError(null);

        const response = await axios.get(API_ENDPOINTS.appointments, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.data && response.data.data.bookedAppointments) {
          const pendingAppointments = response.data.data.bookedAppointments
            .filter(apt => apt.status.toLowerCase() === 'pending')
            .map(apt => ({
              id: apt._id,
              patient: apt.userId ? apt.userId.fullName : 'Unknown Patient',
              patientId: apt.userId ? apt.userId._id : '',
              email: apt.userId ? apt.userId.email : '',
              date: apt.appointmentSlot.split(' ')[0],
              time: apt.appointmentSlot.split(' ').slice(1).join(' '),
              status: apt.status,
              bookedAt: apt.bookedAt,
              appointmentSlot: apt.appointmentSlot
            }));

          setAppointmentRequests(pendingAppointments);
        }
      } catch (err) {
        console.error('Error fetching appointment requests:', err);
        console.error('Error response:', err.response ? err.response.data : 'No response data');
        setError('Failed to load appointment requests. Please try again.');
      }
    };

    const fetchAcceptedAppointments = async () => {
      try {
        setError(null);

        const response = await axios.get(API_ENDPOINTS.appointments, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.data && response.data.data.bookedAppointments) {
          const confirmedAppointments = response.data.data.bookedAppointments
            .filter(apt => apt.status.toLowerCase() === 'confirmed')
            .map(apt => ({
              id: apt._id,
              patient: apt.userId ? apt.userId.fullName : 'Unknown Patient',
              patientId: apt.userId ? apt.userId._id : '',
              email: apt.userId ? apt.userId.email : '',
              date: apt.appointmentSlot.split(' ')[0],
              time: apt.appointmentSlot.split(' ').slice(1).join(' '),
              status: apt.status,
              bookedAt: apt.bookedAt,
              appointmentSlot: apt.appointmentSlot
            }));

          setAcceptedAppointments(confirmedAppointments);
        }
      } catch (err) {
        console.error('Error fetching accepted appointments:', err);
        console.error('Error response:', err.response ? err.response.data : 'No response data');
        setError('Failed to load accepted appointments. Please try again.');
      }
    };

    const fetchReviews = async () => {
      try {
        setError(null);
        const response = await axios.get(API_ENDPOINTS.reviews, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReviews(response.data.data || []);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        console.error('Error response:', err.response ? err.response.data : 'No response data');
        setError('Failed to load reviews. Please try again.');
      }
    };

    fetchAvailableSlots();
    fetchAppointmentRequests();
    fetchAcceptedAppointments();
    fetchReviews();
  }, [API_ENDPOINTS.appointments, API_ENDPOINTS.getSlots, API_ENDPOINTS.reviews]);

  const formatAppointmentSlot = (date, time) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formattedHour = ((h + 11) % 12 + 1);
    return `${date} ${formattedHour}:${minutes} ${suffix}`;
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setError(null);
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();

    const currentDate = new Date().toISOString().split('T')[0];
    if (newSlot.date < currentDate) {
      setError('Cannot add slots for past dates');
      return;
    }

    if (!newSlot.time) {
      setError('Please enter a valid time');
      return;
    }

    try {
      setError(null);

      const formattedSlot = formatAppointmentSlot(newSlot.date, newSlot.time);

      const response = await axios.post(
        API_ENDPOINTS.addSlot,
        { slots: [formattedSlot] },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        }
      );

      if (response.data && response.data.data) {
        const slotsResponse = await axios.get(API_ENDPOINTS.getSlots, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        if (slotsResponse.data.data && slotsResponse.data.data.unbookedSlots) {
          setAvailableSlots(slotsResponse.data.data.unbookedSlots);
        }

        setNewSlot({ date: '', time: '' });
        addToast('New appointment slot added successfully!', 'success');
      }
    } catch (err) {
      console.error('Error adding slot:', err);
      console.error('Error response:', err.response ? err.response.data : 'No response data');
      setError('Failed to add new slot. Please try again.');
    }
  };

  const handleAcceptAppointment = async (appointment) => {
    try {
      setError(null);
      const token = localStorage.getItem('jwt');

      const response = await axios.put(
        API_ENDPOINTS.updateAppointmentStatus,
        {
          appointmentSlot: appointment.appointmentSlot,
          status: 'confirmed'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        const refreshResponse = await axios.get(API_ENDPOINTS.appointments, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (refreshResponse.data.data && refreshResponse.data.data.bookedAppointments) {
          const pendingAppointments = refreshResponse.data.data.bookedAppointments
            .filter(apt => apt.status.toLowerCase() === 'pending')
            .map(apt => ({
              id: apt._id,
              patient: apt.userId ? apt.userId.fullName : 'Unknown Patient',
              patientId: apt.userId ? apt.userId._id : '',
              email: apt.userId ? apt.userId.email : '',
              date: apt.appointmentSlot.split(' ')[0],
              time: apt.appointmentSlot.split(' ').slice(1).join(' '),
              status: apt.status,
              bookedAt: apt.bookedAt,
              appointmentSlot: apt.appointmentSlot
            }));
          const confirmedAppointments = refreshResponse.data.data.bookedAppointments
            .filter(apt => apt.status.toLowerCase() === 'confirmed')
            .map(apt => ({
              id: apt._id,
              patient: apt.userId ? apt.userId.fullName : 'Unknown Patient',
              patientId: apt.userId ? apt.userId._id : '',
              email: apt.userId ? apt.userId.email : '',
              date: apt.appointmentSlot.split(' ')[0],
              time: apt.appointmentSlot.split(' ').slice(1).join(' '),
              status: apt.status,
              bookedAt: apt.bookedAt,
              appointmentSlot: apt.appointmentSlot
            }));

          setAppointmentRequests(pendingAppointments);
          setAcceptedAppointments(confirmedAppointments);
        }

        addToast('Appointment confirmed successfully!', 'success');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error('Error accepting appointment:', err);
      console.error('Error response:', err.response ? err.response.data : 'No response data');
      setError('Failed to accept appointment. Please try again.');
    }
  };

  const handleRejectAppointment = async (appointment) => {
    try {
      setError(null);
      const token = localStorage.getItem('jwt');

      const response = await axios.put(
        API_ENDPOINTS.updateAppointmentStatus,
        {
          appointmentSlot: appointment.appointmentSlot,
          status: 'cancelled'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        const refreshResponse = await axios.get(API_ENDPOINTS.appointments, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (refreshResponse.data.data && refreshResponse.data.data.bookedAppointments) {
          const pendingAppointments = refreshResponse.data.data.bookedAppointments
            .filter(apt => apt.status.toLowerCase() === 'pending')
            .map(apt => ({
              id: apt._id,
              patient: apt.userId ? apt.userId.fullName : 'Unknown Patient',
              patientId: apt.userId ? apt.userId._id : '',
              email: apt.userId ? apt.userId.email : '',
              date: apt.appointmentSlot.split(' ')[0],
              time: apt.appointmentSlot.split(' ').slice(1).join(' '),
              status: apt.status,
              bookedAt: apt.bookedAt,
              appointmentSlot: apt.appointmentSlot
            }));
          setAppointmentRequests(pendingAppointments);
        }

        addToast('Appointment cancelled successfully.', 'info');
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (err) {
      console.error('Error rejecting appointment:', err);
      console.error('Error response:', err.response ? err.response.data : 'No response data');
      setError('Failed to reject appointment. Please try again.');
    }
  };

  const handleRemoveSlot = async (slotIndex) => {
    try {
      setError(null);
      const token = localStorage.getItem('jwt');
      const slotToRemove = availableSlots[slotIndex];

      const response = await axios.delete(API_ENDPOINTS.deleteSlot, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { appointmentSlot: slotToRemove },
      });

      if (response.data.status === 'success') {
        setAvailableSlots((prevSlots) =>
          prevSlots.filter((_, index) => index !== slotIndex)
        );
        addToast('Appointment slot removed successfully!', 'success');
      }
    } catch (err) {
      console.error('Error removing slot:', err);
      console.error('Error response:', err.response ? err.response.data : 'No response data');
      setError('Failed to remove slot. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3 text-primary">Loading doctor profile...</span>
      </div>
    );
  }

  if (!doctor && !isLoading) {
    return (
      <div className="alert alert-danger text-center m-5" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        Could not load doctor profile. Please try again later.
      </div>
    );
  }

  const experience = doctor?.experience || "unknown";

  return (
    <div className="doctor-profile-container">
      {/* Toast Container */}
      <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-white bg-${toast.type} border-0`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                {toast.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                aria-label="Close"
              ></button>
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-primary bg-gradient text-white py-3 shadow-sm" style={{ position: 'fixed', top: 0, width: '100%', zIndex: 1000 }}>
        <div className="container d-flex justify-content-between align-items-center">
          <h3 className="mb-0">DiagnoTech</h3>
          <button 
            className="btn btn-outline-light"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-left me-2"></i>Logout
          </button>
        </div>
      </header>

      <div className="container py-5" style={{ paddingTop: '80px' }}>
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="row g-0">
            <div className="col-md-4 bg-primary bg-gradient text-white d-flex flex-column align-items-center justify-content-center p-5 border-end">
              <div className="avatar-container mb-4">
                <div className="rounded-circle border border-4 border-white shadow bg-white text-primary d-flex align-items-center justify-content-center" style={{ width: '150px', height: '150px' }}>
                  <i className="fa-solid fa-user-doctor" style={{ fontSize: '80px' }}></i>
                </div>
              </div>
              <h4 className="fw-bold mb-1">{doctor?.fullName}</h4>
              <p className="mb-2">{doctor?.specialty}</p>
              <div className="clinicAddress-badge mb-3">
                <i className="bi bi-geo-alt-fill me-1"></i>
                {doctor?.clinicAddress || 'unknown'}
              </div>
            </div>

            <div className="col-md-8 bg-white p-4">
              <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => handleTabChange('about')}
                  >
                    <i className="bi bi-person-badge me-2"></i>About
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => handleTabChange('appointments')}
                  >
                    <i className="bi bi-calendar-week me-2"></i>Appointments
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => handleTabChange('reviews')}
                  >
                    <i className="bi bi-star me-2"></i>Reviews
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'slots' ? 'active' : ''}`}
                    onClick={() => handleTabChange('slots')}
                  >
                    <i className="bi bi-clock-history me-2"></i>Available Slots
                  </button>
                </li>
              </ul>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              <div className="tab-content p-2">
                {activeTab === 'about' && (
                  <div>
                    <div className="card mb-4 border-0 bg-light">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="card-title text-primary">
                            <i className="bi bi-info-circle me-2"></i>Personal Information
                          </h5>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate('/EditDoctorProfile')}
                          >
                            <i className="bi bi-pencil-square me-2"></i>Edit Profile
                          </button>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush bg-transparent">
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Full Name:</span> {doctor?.fullName}
                              </li>
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Email:</span> {doctor?.email || 'doctor@example.com'}
                              </li>
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Phone:</span> {doctor?.contact || '(123) 456-7890'}
                              </li>
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Age:</span> {doctor?.age || '45'}
                              </li>
                            </ul>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush bg-transparent">
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Gender:</span> {doctor?.gender || 'Male'}
                              </li>
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Specialty:</span> {doctor?.specialty}
                              </li>
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Experience:</span> {experience}
                              </li>
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">Google Maps:</span> 
                                {doctor?.googleMapsLink ? (
                                  <a href={doctor.googleMapsLink} target="_blank" rel="noopener noreferrer">View Location</a>
                                ) : 'Not provided'}
                              </li>
                              <li className="list-group-item bg-transparent px-0">
                                <span className="fw-bold me-2">WhatsApp:</span> 
                                {doctor?.whatsappLink ? (
                                  <a href={doctor.whatsappLink} target="_blank" rel="noopener noreferrer">Contact via WhatsApp</a>
                                ) : 'Not provided'}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appointments' && (
                  <div>
                    <h5 className="text-primary mb-4">
                      <i className="bi bi-calendar-check me-2"></i>Appointment Requests
                    </h5>

                    {appointmentRequests.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Patient</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointmentRequests.map((apt) => (
                              <tr key={apt.id}>
                                <td>{apt.patient}</td>
                                <td>{apt.date}</td>
                                <td>{apt.time}</td>
                                <td>
                                  <span
                                    className={`badge rounded-pill bg-${
                                      apt.status.toLowerCase() === 'confirmed'
                                        ? 'success'
                                        : apt.status.toLowerCase() === 'pending'
                                        ? 'warning'
                                        : 'info'
                                    }`}
                                  >
                                    {apt.status}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-outline-success me-1"
                                    onClick={() => handleAcceptAppointment(apt)}
                                    title="Accept appointment"
                                  >
                                    <i className="bi bi-check-circle"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleRejectAppointment(apt)}
                                    title="Reject appointment"
                                  >
                                    <i className="bi bi-x-circle"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-light rounded">
                        <i className="bi bi-calendar-x display-4 text-secondary"></i>
                        <p className="mt-3">No appointment requests at this time.</p>
                      </div>
                    )}

                    <h5 className="text-success mt-5 mb-4">
                      <i className="bi bi-calendar2-check me-2"></i>Accepted Appointments
                    </h5>

                    {acceptedAppointments.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Patient</th>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {acceptedAppointments.map((apt) => (
                              <tr key={apt.id}>
                                <td>{apt.patient}</td>
                                <td>{apt.date}</td>
                                <td>{apt.time}</td>
                                <td>
                                  <span className="badge rounded-pill bg-success">
                                    {apt.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-light rounded">
                        <i className="bi bi-calendar2-x display-4 text-secondary"></i>
                        <p className="mt-3">No accepted appointments yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="text-primary mb-0">
                        <i className="bi bi-star me-2"></i>Patient Reviews
                      </h5>
                      {reviews.length > 0 && (
                        <div className="text-end">
                          <div className="text-warning mb-1">
                            {Array(5)
                              .fill()
                              .map((_, i) => {
                                const avgRating =
                                  reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
                                return (
                                  <i
                                    key={i}
                                    className={`bi ${i < Math.round(avgRating) ? 'bi-star-fill' : 'bi-star'}`}
                                  ></i>
                                );
                              })}
                          </div>
                          <span className="small text-muted">
                            {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)}{' '}
                            out of 5 ({reviews.length} reviews)
                          </span>
                        </div>
                      )}
                    </div>

                    {reviews.length > 0 ? (
                      <div className="review-list">
                        {reviews.map((review, index) => (
                          <div key={index} className="card border-0 shadow-sm mb-3">
                            <div className="card-body">
                              <div className="d-flex justify-content-between mb-2">
                                <div className="d-flex align-items-center">
                                  <div className="avatar me-3">
                                    <div
                                      className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                      style={{ width: '40px', height: '40px' }}
                                    >
                                      <i className="bi bi-person"></i>
                                    </div>
                                  </div>
                                  <div>
                                    <h6 className="mb-0">{review.patientName}</h6>
                                    <span className="small text-muted">{review.date}</span>
                                  </div>
                                </div>
                                <div className="text-warning">
                                  {Array(5)
                                    .fill()
                                    .map((_, i) => (
                                      <i
                                        key={i}
                                        className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}
                                      ></i>
                                    ))}
                                </div>
                              </div>
                              <p className="mb-0">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-light rounded">
                        <i className="bi bi-chat-square-text display-4 text-secondary"></i>
                        <p className="mt-3">No reviews available yet.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'slots' && (
                  <div>
                    <h5 className="text-primary mb-4">
                      <i className="bi bi-clock-history me-2"></i>Add Available Slot
                    </h5>
                    <form onSubmit={handleAddSlot} className="row g-3 mb-4">
                      <div className="col-md-5">
                        <input
                          type="date"
                          className="form-control"
                          value={newSlot.date}
                          onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="col-md-5">
                        <input
                          type="time"
                          className="form-control"
                          value={newSlot.time}
                          onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        <button type="submit" className="btn btn-primary w-100">
                          <i className="bi bi-plus-circle me-2"></i>Add
                        </button>
                      </div>
                    </form>

                    <h6 className="mb-3 text-secondary">Current Available Slots:</h6>

                    {availableSlots && availableSlots.length > 0 ? (
                      <ul className="list-group">
                        {availableSlots.map((slot, index) => (
                          <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {slot}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveSlot(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center p-3 bg-light rounded">
                        <p className="mb-0">No available slots. Add some using the form above.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="row text-center mt-4 g-3">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm rounded-4 py-2">
                    <div className="card-body">
                      <div className="icon-circle bg-primary bg-opacity-10 mb-2 mx-auto">
                        <i className="bi bi-calendar-check text-primary"></i>
                      </div>
                      <h6 className="text-muted">Pending Appointments</h6>
                      <h4 className="fw-bold text-primary mb-0">
                        {appointmentRequests.length}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm rounded-4 py-2">
                    <div className="card-body">
                      <div className="icon-circle bg-success bg-opacity-10 mb-2 mx-auto">
                        <i className="bi bi-people text-success"></i>
                      </div>
                      <h6 className="text-muted">Patients</h6>
                      <h4 className="fw-bold text-success mb-0">{acceptedAppointments.length}</h4>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm rounded-4 py-2">
                    <div className="card-body">
                      <div className="icon-circle bg-warning bg-opacity-10 mb-2 mx-auto">
                        <i className="bi bi-star text-warning"></i>
                      </div>
                      <h6 className="text-muted">Rating</h6>
                      <h4 className="fw-bold text-warning mb-0">
                        {reviews.length > 0
                          ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
                          : '0'}
                        <small>/5</small>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;