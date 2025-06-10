import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DoctorsList.css';
import { faUserDoctor } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BASE_URL } from "../../config";

// Separate components for better organization
const SearchBar = ({ value, onChange }) => (
  <div className="input-group shadow-sm rounded-3">
    <span className="input-group-text bg-white border-end-0">
      <i className="bi bi-search text-primary"></i>
    </span>
    <input
      type="text"
      className="form-control border-start-0 ps-0"
      placeholder="Search by doctor name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SpecialtyFilter = ({ specialties, value, onChange }) => (
  <select
    className="form-select border rounded-3 shadow-sm"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    <option value="">All Specialties</option>
    {specialties.map((spec, index) => (
      <option key={index} value={spec}>{spec}</option>
    ))}
  </select>
);

const DoctorCard = ({ doctor, onClick }) => {
  const rating = doctor.rating || 0;
  const maxStars = 5;

  return (
    <div 
      className="card h-100 border-0 shadow-sm rounded-4 transition-all doctor-card"
      onClick={() => onClick(doctor)}
    >
      <div className="card-body p-4">
        <div className="d-flex align-items-center mb-4">
          <div 
            className="rounded-circle text-white d-flex align-items-center justify-content-center me-3"
            style={{ 
              width: '70px', 
              height: '70px', 
              fontSize: '28px',
              background: 'linear-gradient(135deg,rgb(96, 140, 243) 0%,rgb(8, 53, 125) 100%)'
            }}
          >
            <span className="fs-1 text-white"><FontAwesomeIcon icon={faUserDoctor} /></span>
          </div>
          <div>
            <h5 className="card-title mb-1 fw-bold text-primary">
              {doctor.fullName || doctor.name || 'Name unavailable'}
            </h5>
            <span className="badge rounded-pill bg-primary text-white">{doctor.specialty || 'Specialty unavailable'}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <p className="text-muted small mb-2">
            <i className="bi bi-geo-alt me-2"></i>
            {doctor.clinicAddress || 'Address unavailable'}
          </p>
          <div className="d-flex align-items-center">
            <div className="text-warning me-2">
              {[...Array(maxStars)].map((_, i) => (
                <i 
                  key={i} 
                  className={`bi ${i < Math.round(rating) ? 'bi-star-fill' : 'bi-star'}`}
                ></i>
              ))}
            </div>
            <span className="text-muted small">
              {rating ? `${rating.toFixed(1)}/5` : 'No ratings'}
            </span>
          </div>
        </div>
        
        <button 
          className="btn btn-outline-primary w-100 mt-3 rounded-3"
          onClick={(e) => {
            e.stopPropagation();
            onClick(doctor);
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

const EmptyResults = () => (
  <div className="col-12 text-center py-5">
    <div className="d-flex flex-column align-items-center">
      <i className="bi bi-search fs-1 text-muted mb-3"></i>
      <h4>No doctors found</h4>
      <p className="text-muted">Try adjusting your search or filter criteria</p>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="col-12 text-center py-5">
    <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="text-muted mt-3">Loading doctors...</p>
  </div>
);

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    specialty: ''
  });
  const [visibleCount, setVisibleCount] = useState(15);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Fetch doctors data once on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const response = await axios.get(`${BASE_URL}/api/doctors/alldoctors`);
        if (response.data.status === 'success') {
          const doctorsList = response.data.data;
          setDoctors(doctorsList);
          setFilteredDoctors(doctorsList);
          
          // Extract unique specialties
          const uniqueSpecialties = [...new Set(doctorsList.map(doc => doc.specialty))];
          setSpecialties(uniqueSpecialties);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    fetchDoctors();
  }, []);

  // Apply filters and reset visibleCount when filters change
  useEffect(() => {
    const applyFilters = () => {
      const { searchTerm, specialty } = filters;
      const filtered = doctors.filter(doc => 
        (!specialty || doc.specialty === specialty) &&
        (!searchTerm || doc.fullName?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredDoctors(filtered);
      setVisibleCount(15);
    };

    applyFilters();
  }, [filters, doctors]);

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, searchTerm: value }));
  };

  const handleSpecialtyChange = (value) => {
    setFilters(prev => ({ ...prev, specialty: value }));
  };

  const handleDoctorClick = (doctor) => {
    navigate(`/doctor/${doctor._id}`, { 
      state: { 
        doctor,
        reviews: doctor.reviews || [],
        availableAppointments: doctor.availableAppointments || []
      } 
    });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 15);
  };

  return (
    <div className="doctors-list-container">
      <div className="container py-5">
        <h2 className="text-center mb-5 text-primary fw-bold">Find Your Doctor</h2>
        
        {/* Search & Filter Section */}
        <div className="row mb-5 bg-white rounded-4 shadow-sm p-4 align-items-center">
          <div className="col-md-8 mb-3 mb-md-0">
            <SearchBar value={filters.searchTerm} onChange={handleSearchChange} />
          </div>
          <div className="col-md-4">
            <SpecialtyFilter 
              specialties={specialties} 
              value={filters.specialty} 
              onChange={handleSpecialtyChange} 
            />
          </div>
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-4">
            <p className="text-muted fs-6">
              Showing {Math.min(filteredDoctors.length, visibleCount)} of {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
              {filters.specialty && ` in ${filters.specialty}`}
            </p>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="row g-4">
          {loading ? (
            <LoadingSpinner />
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.slice(0, visibleCount).map((doctor) => (
              <div key={doctor._id} className="col-12 col-sm-6 col-lg-6 col-xl-4">
                <DoctorCard doctor={doctor} onClick={handleDoctorClick} />
              </div>
            ))
          ) : (
            <EmptyResults />
          )}
        </div>
        
        {!loading && filteredDoctors.length > visibleCount && (
          <div className="mt-5 text-center">
            <button 
              className="btn btn-primary btn-gradient px-4 py-2 rounded-3"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;