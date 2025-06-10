import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../style.css";
import "./profiles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserDoctor, faStar as faStarSolid, faPerson } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { BsArrowUpRightCircle } from "react-icons/bs";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; 
import { BASE_URL } from "../../config";

const DoctorProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [doctorDetails, setDoctorDetails] = useState(location.state?.doctor || null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [ratingComment, setRatingComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [showReviews, setShowReviews] = useState(true);
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' }); // New state for UI messages

  useEffect(() => {
    document.body.classList.add('doctor-profile-body');
    
    if (id && !doctorDetails) {
      fetchDoctorDetails(id);
    }
    
    const doctorId = id || (doctorDetails && doctorDetails._id);
    
    if (doctorId) {
      fetchAppointments(doctorId);
      fetchReviews(doctorId);
    }

    return () => {
      document.body.classList.remove('doctor-profile-body');
    };
  }, [id, doctorDetails]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchDoctorDetails = async (doctorId) => {
    setIsLoadingDoctor(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`);
      if (response.data.status === 'success') {
        setDoctorDetails(response.data.data);
      } else {
        setMessage({ type: 'danger', text: 'Failed to load doctor details. Please try again.' });
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
      setMessage({ type: 'danger', text: 'Error loading doctor details. Please check your connection.' });
    } finally {
      setIsLoadingDoctor(false);
    }
  };

  const fetchAppointments = async (doctorId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/userbook/appointments/${doctorId}`);
      if (response.data.status === 'success' && Array.isArray(response.data.data)) {
        setAppointments(response.data.data);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    }
  };

  const fetchReviews = async (doctorId) => {
    setIsLoadingReviews(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/userbook/reviews/${doctorId}`);
      if (response.data.status === 'success') {
        if (Array.isArray(response.data.data)) {
          setReviews(response.data.data);
        } else if (response.data.data && Array.isArray(response.data.data.reviews)) {
          setReviews(response.data.data.reviews);
        } else if (response.data.data && response.data.data.reviews) {
          setReviews([response.data.data.reviews]);
        } else {
          setReviews([]);
        }
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const bookAppointment = async () => {
    if (!selectedAppointment) {
      setMessage({ type: 'warning', text: 'Please select an appointment time first.' });
      return;
    }
    
    if (!isLoggedIn) {
      setMessage({ type: 'warning', text: 'You need to be logged in to book an appointment.' });
      setTimeout(() => navigate('/login', { state: { returnUrl: location.pathname } }), 3000);
      return;
    }

    try {
      const doctorId = id || (doctorDetails && doctorDetails._id);
      const token = localStorage.getItem('jwt');

      const response = await fetch(`${BASE_URL}/api/userbook/appointments/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: doctorId,
          appointmentId: selectedAppointment._id,
          appointmentSlot: selectedAppointment.appointmentSlot
        })
      });

      const responseData = await response.json();

      if (responseData.status === 'success') {
        setMessage({ type: 'success', text: 'Appointment booked successfully!' });
        fetchAppointments(doctorId);
        setSelectedAppointment(null);
      } else {
        setMessage({ type: 'danger', text: responseData.message || 'Failed to book appointment. Please try again.' });
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage({ type: 'danger', text: 'Failed to book appointment. Please try again.' });
    }
  };

  const submitRating = async () => {
    if (rating === 0) {
      setMessage({ type: 'warning', text: 'Please select a rating before submitting.' });
      return;
    }

    if (!isLoggedIn) {
      setMessage({ type: 'warning', text: 'You need to be logged in to submit a rating.' });
      setTimeout(() => navigate('/login', { state: { returnUrl: location.pathname } }), 3000);
      return;
    }

    try {
      const doctorId = id || (doctorDetails && doctorDetails._id);
      const token = localStorage.getItem('jwt'); 
      
      const response = await axios.post( `${BASE_URL}/api/userbook/reviews/add`, {
        doctorId: doctorId,
        rating: parseInt(rating, 10),
        comment: ratingComment
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'success') {
        setRatingSubmitted(true);
        setRating(0);
        setRatingComment('');
        setMessage({ type: 'success', text: 'Thank you! Your rating has been submitted.' });
        setTimeout(() => {
          fetchReviews(doctorId); 
        }, 500);
      } else {
        setMessage({ type: 'danger', text: response.data.message || 'Failed to submit rating. Please try again.' });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setMessage({ type: 'warning', text: 'Authentication error. Please log in again.' });
          setTimeout(() => navigate('/login', { state: { returnUrl: location.pathname } }), 3000);
        } else if (error.response.data && error.response.data.message) {
          setMessage({ type: 'danger', text: `Error: ${error.response.data.message}` });
        } else {
          setMessage({ type: 'danger', text: 'Failed to submit rating. Please try again.' });
        }
      } else if (error.request) {
        setMessage({ type: 'danger', text: 'No response from server. Please check your connection.' });
      } else {
        setMessage({ type: 'danger', text: `Failed to submit rating: ${error.message}` });
      }
    }
  };

  const renderStars = (count) => {
    return Array(5).fill().map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={i < count ? faStarSolid : faStarRegular}
        className="text-warning mx-1"
      />
    ));
  };
  
  const calculateAverageRating = () => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (isLoadingDoctor) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (!doctorDetails) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <p className="text-danger fs-4">No doctor details available.</p>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/doctors')}>
            Return to Doctors List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100">
      <div className="bg-DoctorProfile">
        <img 
          src="/img/doctor_profile.jpg" 
          alt="Doctor Profile" 
          className="img-fluid w-100 h-100 object-cover"
        />
      </div>
      <div className="profile-content overflow-auto">
        <h1 className="text-primary fw-bold text-center mb-4 doc-h">Doctor's Profile</h1>

        {/* Display Messages */}
        {message.text && (
          <div className={`alert alert-${message.type} alert-dismissible fade show mx-auto`} style={{ maxWidth: '800px' }} role="alert">
            {message.text}
            <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
          </div>
        )}

        <div className="d-flex flex-column align-items-center mb-4">
          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
            style={{ width: "100px", height: "100px" }}>
            <span className="fs-1 text-white"><FontAwesomeIcon icon={faUserDoctor} /></span>
          </div>
          <h2 className="mt-3">{doctorDetails.fullName || doctorDetails.name}</h2>
          <div className="mt-2 d-flex align-items-center">
            <div className="me-2 d-flex">
              {renderStars(Math.round(calculateAverageRating()))}
            </div>
            <span className="fw-bold text-primary">{calculateAverageRating()}</span>
            <span className="text-muted ms-1">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>

        <div className="row g-3 profile-card p-4 mx-auto" style={{ maxWidth: "800px" }}>
          <div className="col-12 col-sm-6">
            <label htmlFor="fullname" className="form-label">Full Name</label>
            <input id="fullname" type="text" className="form-control border-primary" value={doctorDetails.fullName || doctorDetails.name || ''} readOnly />
          </div>
          <div className="col-12 col-sm-6">
            <label htmlFor="specialization" className="form-label">Specialization</label>
            <input id="specialization" type="text" className="form-control border-primary" value={doctorDetails.specialty || 'Not specified'} readOnly />
          </div>
          <div className="col-12 col-sm-6">
            <label htmlFor="location" className="form-label">Location</label>
            <div className="input-group">
              <input id="location" type="text" className="form-control border-primary" value={doctorDetails.clinicAddress || 'Not specified'} readOnly />
              {doctorDetails.googleMapsLink && (
                <span className="input-group-text bg-white border-primary" style={{ cursor: 'pointer' }} onClick={() => window.open(doctorDetails.googleMapsLink, "_blank")}>
                  <BsArrowUpRightCircle size={20} className="text-primary" />
                </span>
              )}
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <label htmlFor="contact" className="form-label">Contact Number</label>
            <input id="contact" type="text" className="form-control border-primary" value={doctorDetails.contact || 'Not available'} readOnly />
          </div>
          
          <div className="col-12">
            <label htmlFor="appointments" className="form-label">Available Appointments</label>
            {appointments.length > 0 ? (
              <select
                id="appointments"
                className="form-select border-primary"
                value={selectedAppointment?._id || ""}
                onChange={(e) => {
                  const selected = appointments.find(apt => apt._id === e.target.value);
                  setSelectedAppointment(selected);
                }}
              >
                <option value="">Select an appointment</option>
                {appointments.map(apt => (
                  <option key={apt._id} value={apt._id} disabled={apt.isBooked}>
                    {apt.appointmentSlot} {apt.isBooked ? "(Booked)" : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="alert alert-info">No available appointments found.</div>
            )}
          </div>

          <div className="col-12 mt-2">
            {selectedAppointment && (
              <div className="alert alert-success">
                Selected Appointment: {selectedAppointment.appointmentSlot}
              </div>
            )}
          </div>

          <div className="col-12 mt-3 text-center">
            <button 
              className="btn btn-primary" 
              onClick={bookAppointment}
              disabled={!selectedAppointment}
            >
              Book Selected Appointment
            </button>
          </div>
        </div>

        <div className="mt-5 mx-auto" style={{ maxWidth: "800px" }}>
          <h3 className="text-primary border-bottom pb-2">Rate this Doctor</h3>
          
          {ratingSubmitted ? (
            <div className="alert alert-success">
              Thank you for your feedback! Your review has been submitted.
            </div>
          ) : (
            <div className="profile-card p-4 mt-3">
              <div className="mb-3 text-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={star <= (hoveredRating || rating) ? faStarSolid : faStarRegular}
                    className="fs-2 mx-1 star-rating"
                    style={{ 
                      cursor: 'pointer',
                      color: star <= (hoveredRating || rating) ? '#FFC107' : '#ccc'
                    }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
              
              <div className="mb-3">
                <label htmlFor="ratingComment" className="form-label">Your Review (Optional)</label>
                <textarea
                  id="ratingComment"
                  className="form-control border-primary"
                  rows="3"
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Share your experience with this doctor..."
                ></textarea>
              </div>
              
              <div className="text-center">
                <button className="btn btn-primary" onClick={submitRating}>
                  Submit Rating
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 mx-auto mb-5" style={{ maxWidth: "800px" }}>
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
            <h3 className="text-primary mb-0">Patient Reviews</h3>
            <button 
              className="btn btn-sm btn-outline-primary" 
              onClick={() => setShowReviews(!showReviews)}
            >
              {showReviews ? 'Hide Reviews' : 'Show Reviews'}
            </button>
          </div>

          {showReviews && (
            isLoadingReviews ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="review-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {reviews.map((review, index) => (
                  <div key={review._id || `review-${index}`} className="profile-card mb-3 p-3">
                    <div className="d-flex justify-content-between mb-2">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div 
                            className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center" 
                            style={{ width: '40px', height: '40px' }}
                          >
                            <FontAwesomeIcon icon={faPerson} />
                          </div>
                        </div>
                        <div>
                          <p className="mb-0 fw-semibold">{review.userName || 'Patient'}</p>
                          <span className="small text-muted">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) : 'Unknown date'}
                          </span>
                        </div>
                      </div>
                      <div className="text-warning">
                        {renderStars(Math.round(review.rating || 0))}
                      </div>
                    </div>
                    <p className="mb-0">
                      {review.comment ? review.comment.trim() : <em className="text-muted">No comment provided.</em>}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 bg-light rounded">
                <FontAwesomeIcon icon={faStarRegular} className="display-4 text-secondary" />
                <p className="mt-3">No reviews available yet. Be the first to review!</p>
              </div>
            )
          )}
        </div>

        <div className="text-center mb-5">
          <button className="btn btn-outline-primary" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;