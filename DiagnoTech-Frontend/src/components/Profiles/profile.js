import React, { useState, useEffect } from "react";
import { Container, Card, Button, Spinner, Modal, Form, Row, Col, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaKey, FaUser, FaEnvelope, FaVenusMars, FaBirthdayCake, FaHistory } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsChevronDown, BsChevronUp, BsCalendarDate ,BsClipboard2Fill ,BsShieldCheck ,BsExclamationCircle } from "react-icons/bs";
import axios from "axios";
import "./profiles.css";
import "../style.css";
import { BASE_URL } from "../../config";

const Profile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "Not Available",
    email: "Not Available",
    gender: "Not Available",
    age: 0,
    medicalHistory: "Not Available",
    profilePicture: "",
  });
  const [profilePicture, setProfilePicture] = useState(
    `${BASE_URL}/uploads/defaultProfilePic.png`
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(2);
  const [visibleAppointmentCount, setVisibleAppointmentCount] = useState(2);
  const [passwordError, setPasswordError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/profile/user`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.data) {
        setUserData(response.data.data);
        setProfilePicture(
          response.data.data.profilePicture
            ? `${BASE_URL}${response.data.data.profilePicture}`
            : `${BASE_URL}/uploads/defaultProfilePic.png`
        );

        localStorage.setItem("username", response.data.data.fullName);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalHistory = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/diagnosis/history`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setMedicalHistory(response.data);
      } else {
        setMedicalHistory([]);
      }
    } catch (err) {
      console.error("Error fetching medical history:", err);
      setMedicalHistory([]);
    }
  };

  const fetchAppointments = async () => {
  setAppointmentLoading(true);
  setAppointmentError(null);
  try {
    const response = await axios.get(
      `${BASE_URL}/api/profile/myappointments`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    // Log the raw response for debugging
    console.log("Appointments API response:", response);

    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      const validatedAppointments = response.data.map(appointment => ({
        doctorName: String(appointment.doctorName || "Unknown Doctor"),
        appointmentSlot: String(appointment.appointmentSlot || ""),
      }));
      setAppointments(validatedAppointments);
    } else {
      console.warn("Unexpected response format:", response.data);
      setAppointments([]);
      setAppointmentError("Unexpected response format from server.");
    }
  } catch (err) {
    console.error("Error fetching appointments:", err);
    // Provide more specific error messages
    let errorMessage = "Failed to load appointments. Please try again later.";
    if (err.response) {
      // Server responded with an error status
      errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
    } else if (err.request) {
      // Request was made but no response received
      errorMessage = "Network error: Unable to reach the server.";
    }
    setAppointmentError(errorMessage);
    setAppointments([]);
  } finally {
    setAppointmentLoading(false);
  }
};

  const handleDeleteAccount = async () => {
    setDeleteError("");
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm deletion.");
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/api/profile/deleteAccount`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        data: {
          password: deletePassword,
        },
      });
      localStorage.removeItem("jwt");
      setShowConfirmModal(false);
      setShowFinalConfirm(true);
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (err) {
      console.error("Error deleting account:", err);
      setDeleteError(
        err.response?.data?.message ||
        "Failed to delete account. Please check your password and try again."
      );
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    if (!oldPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password should be at least 8 characters long.");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/profile/changePassword`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      );
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      const successDiv = document.createElement("div");
      successDiv.className = "alert alert-success position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg";
      successDiv.style.zIndex = "9999";
      successDiv.style.maxWidth = "400px";
      successDiv.innerHTML = "<strong>Success!</strong> Password changed successfully.";
      document.body.appendChild(successDiv);
      setTimeout(() => {
        successDiv.remove();
      }, 3500);
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordError(
        err.response?.data?.message ||
        "Failed to change password. Please check your old password and try again."
      );
    }
  };

  useEffect(() => {
    document.body.classList.add("profile-bg");
    fetchUserData();
    fetchMedicalHistory();
    fetchAppointments();

    const reloadProfile = sessionStorage.getItem("reloadProfile");
    if (reloadProfile === "true") {
      sessionStorage.removeItem("reloadProfile");
    }

    return () => {
      document.body.classList.remove("profile-bg");
    };
  }, [location]);

  const formatDate = (dateString) => {
    try {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (appointmentSlot) => {
    try {
      const [, time] = appointmentSlot.split(" ");
      const [hours, minutes] = time.split(":");
      const h = parseInt(hours, 10);
      const suffix = h >= 12 ? "PM" : "AM";
      const formattedHour = ((h + 11) % 12 + 1);
      return `${formattedHour}:${minutes} ${suffix}`;
    } catch {
      return "Invalid Time";
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading profile...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Card
          className="p-4 shadow-lg border-0 rounded-3 text-center"
          style={{
            maxWidth: "700px",
            width: "100%",
            backgroundColor: "#f8f9fa",
          }}
        >
          <div className="text-danger mb-4">
            <h4>Error</h4>
            <p>{error}</p>
          </div>
          <Button variant="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4 gx-4">
        <Col lg={8}>
          <Card className="mb-4 shadow-lg border-0 rounded-3" style={{ backgroundColor: "#f8f9fa" }}>
            <Card.Header className="ProfileInformation-H text-white py-3 rounded-top-3 border-0">
              <h5 className="mb-0 fw-bold">Profile Information</h5>
            </Card.Header>
            <Card.Body className="p-4">
              <Row>
                <Col md={4} className="text-center mb-4 mb-md-0">
                  <div className="position-relative mb-3">
                    <img
                      src={profilePicture}
                      alt="User Profile"
                      className="rounded-circle border border-3 border-primary shadow"
                      style={{ width: "150px", height: "150px", objectFit: "cover" }}
                    />
                  </div>
                  <h5 className="fw-bold text-primary mt-3">{userData.fullName}</h5>
                  <p className="text-muted mb-0"><small>Member since {new Date().getFullYear()}</small></p>
                </Col>
                <Col md={8}>
                  <div className="ps-md-4">
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaUser className="text-primary me-3" size={16} />
                        <h6 className="mb-0 fw-bold">Full Name</h6>
                      </div>
                      <p className="mb-0 ps-5">{userData.fullName}</p>
                      <hr className="my-2" />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaEnvelope className="text-primary me-3" size={16} />
                        <h6 className="mb-0 fw-bold">Email Address</h6>
                      </div>
                      <p className="mb-0 ps-5">{userData.email}</p>
                      <hr className="my-2" />
                    </div>
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <FaVenusMars className="text-primary me-3" size={16} />
                        <h6 className="mb-0 fw-bold">Gender</h6>
                      </div>
                      <p className="mb-0 ps-5">{userData.gender}</p>
                      <hr className="my-2" />
                    </div>
                    <div>
                      <div className="d-flex align-items-center mb-2">
                        <FaBirthdayCake className="text-primary me-3" size={16} />
                        <h6 className="mb-0 fw-bold">Age</h6>
                      </div>
                      <p className="mb-0 ps-5">{userData.age} years</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="bg-transparent py-3 border-0">
              <div className="d-flex justify-content-end gap-2">
                <Link to="/update-info">
                  <Button variant="outline-primary" size="md" className="fw-semibold px-4">
                    <FaEdit className="me-2" /> Edit Profile
                  </Button>
                </Link>
              </div>
            </Card.Footer>
          </Card>
          <Card className="shadow-lg border-0 rounded-3 mb-4" style={{ backgroundColor: "#f8f9fa" }}>
            <Card.Body className="p-4">
              <h6 className="fw-bold mb-3 text-primary">Account Management</h6>
              <div className="d-flex flex-wrap gap-3">
                <Button variant="warning" className="px-4 py-2 shadow-sm" onClick={() => setShowPasswordModal(true)}>
                  <FaKey className="me-2" /> Change Password
                </Button>
                <Button variant="danger" className="px-4 py-2 shadow-sm" onClick={() => setShowConfirmModal(true)}>
                  <FaTrash className="me-2" /> Delete Account
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card
            className="medical-h shadow-lg border-0 rounded-3 mb-4"
            style={{ backgroundColor: "#f8f9fa", overflowY: "auto" }}
          >
            <Card.Header className="ProfileInformation-H text-white py-3 rounded-top-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Medical History</h5>
              <FaHistory size={18} />
            </Card.Header>
            <Card.Body className="medical-h p-3">
              {medicalHistory.length ? (
                <div
                  style={{ overflowY: "auto" }}
                  className="custom-scrollbar pr-2"
                >
                  {medicalHistory.slice(0, visibleCount).map((item, index) => {
                    const isOpen = openIndex === index;
                    const disease = item.diagnosisResult?.[0]?.disease || "Unknown Disease";

                    return (
                      <Card
                        key={index}
                        className={`mb-3 shadow-sm border-0 ${isOpen ? 'bg-light' : ''}`}
                        style={{
                          cursor: 'pointer',
                          transition: '0.2s',
                          borderRadius: 8,
                          borderLeft: '4px solid #0d6efd'
                        }}
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                      >
                        <Card.Body className="py-3 px-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-bold mb-1 text-primary" style={{ fontSize: "1rem" }}>{disease}</h6>
                              <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                                <BsCalendarDate className="me-1" size={12} /> {formatDate(item.createdAt)}
                              </p>
                            </div>
                            <Badge
                              bg={isOpen ? "primary" : "light"}
                              text={isOpen ? "white" : "primary"}
                              className="px-2 py-2 rounded-pill"
                            >
                              {isOpen ? <BsChevronUp size={12} /> : <BsChevronDown size={12} />}
                            </Badge>
                          </div>
                          {isOpen && (
                            <div className="mt-3 pt-2 border-top" style={{ fontSize: "0.9rem" }}>
                              <div className="mb-3">
                                <h6 className="fw-bold mb-2">
                                  <BsExclamationCircle className="text-warning me-2" size={14} /> Symptoms
                                </h6>
                                <p className="mb-0 ps-4">{item.symptoms.join(", ")}</p>
                              </div>
                              {item.diagnosisResult?.[0]?.precautions?.length > 0 && (
                                <div>
                                  <h6 className="fw-bold mb-2">
                                    <BsShieldCheck className="text-success me-2" size={14} /> Precautions
                                  </h6>
                                  <ul className="ps-4 mb-0">
                                    {item.diagnosisResult[0].precautions.map((p, idx) => <li key={idx}>{p}</li>)}
                                  </ul>
                                </div>
                              )}
                              <br />
                              {item.diagnosisResult?.[0]?.description?.length > 0 && (
                                <div>
                                  <h6 className="fw-bold mb-2">
                                    <BsClipboard2Fill className="text-success me-2" size={14} /> Description
                                  </h6>
                                  <p className="ps-4 mb-0">{item.diagnosisResult[0].description}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    );
                  })}
                  {visibleCount < medicalHistory.length && (
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-primary"
                        size="md"
                        onClick={() => setVisibleCount(v => v + 3)}
                        className="rounded-pill px-4 py-2"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Show More
                      </Button>
                    </div>
                  )}
                  {visibleCount > 2 && medicalHistory.length > 2 && (
                    <div className="text-center mt-2">
                      <Button
                        variant="link"
                        size="md"
                        onClick={() => setVisibleCount(2)}
                        className="text-secondary py-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Show Less
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <FaHistory size={40} style={{ opacity: 0.3 }} className="mb-3" />
                  <h6>No medical history available</h6>
                  <p className="small mb-0">Your medical records will appear here</p>
                </div>
              )}
            </Card.Body>
          </Card>
          <Card
            className="medical-h shadow-lg border-0 rounded-3"
            style={{ backgroundColor: "#f8f9fa", overflowY: "auto" }}
          >
            <Card.Header className="ProfileInformation-H text-white py-3 rounded-top-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Booked Appointments</h5>
              <BsCalendarDate size={18} />
            </Card.Header>
            <Card.Body className="medical-h p-3">
              {appointmentLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <p className="mt-2">Loading appointments...</p>
                </div>
              ) : appointmentError ? (
                <div className="text-center py-5 text-danger">
                  <p>{appointmentError}</p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={fetchAppointments}
                  >
                    Retry
                  </Button>
                </div>
              ) : appointments.length ? (
                <div
                  style={{ overflowY: "auto" }}
                  className="custom-scrollbar pr-2"
                >
                  {appointments.slice(0, visibleAppointmentCount).map((appointment, index) => {
                    const date = appointment.appointmentSlot ? formatDate(appointment.appointmentSlot.split(" ")[0]) : "Invalid Date";
                    const time = appointment.appointmentSlot ? formatTime(appointment.appointmentSlot) : "Invalid Time";

                    return (
                      <Card
                        key={index}
                        className="mb-3 shadow-sm border-0"
                        style={{
                          transition: '0.2s',
                          borderRadius: 8,
                          borderLeft: '4px solid #0d6efd'
                        }}
                      >
                        <Card.Body className="py-3 px-3">
                          <div>
                            <h6 className="fw-bold mb-1 text-primary" style={{ fontSize: "1rem" }}>
                              Dr. {appointment.doctorName}
                            </h6>
                            <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                              <BsCalendarDate className="me-1" size={12} /> {date} at {time}
                            </p>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })}
                  {visibleAppointmentCount < appointments.length && (
                    <div className="text-center mt-3">
                      <Button
                        variant="outline-primary"
                        size="md"
                        onClick={() => setVisibleAppointmentCount(v => v + 3)}
                        className="rounded-pill px-4 py-2"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Show More
                      </Button>
                    </div>
                  )}
                  {visibleAppointmentCount > 2 && appointments.length > 2 && (
                    <div className="text-center mt-2">
                      <Button
                        variant="link"
                        size="md"
                        onClick={() => setVisibleAppointmentCount(2)}
                        className="text-secondary py-1"
                        style={{ fontSize: "0.85rem" }}
                      >
                        Show Less
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <BsCalendarDate size={40} style={{ opacity: 0.3 }} className="mb-3" />
                  <h6>No booked appointments</h6>
                  <p className="small mb-0">Your booked appointments will appear here</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showConfirmModal} onHide={() => {
        setShowConfirmModal(false);
        setDeletePassword("");
        setDeleteError("");
      }} centered>
        <Modal.Header closeButton className="bg-light py-3">
          <Modal.Title className="text-danger" style={{ fontSize: "1.2rem" }}>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <p className="mb-4">Please enter your password to confirm account deletion.</p>
          {deleteError && (
            <div className="alert alert-danger mb-3">
              {deleteError}
            </div>
          )}
          <Form.Group className="mb-4">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              size="lg"
            />
          </Form.Group>
          <div className="alert alert-warning py-3">
            <small><strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.</small>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-3">
          <Button variant="secondary" onClick={() => {
            setShowConfirmModal(false);
            setDeletePassword("");
            setDeleteError("");
          }}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteAccount}>Yes, Delete My Account</Button>
          <p className="warning-delete">If you click Delete, your account will be deleted immediately.</p>
        </Modal.Footer>
      </Modal>
      <Modal show={showPasswordModal} onHide={() => {
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setPasswordError("");
      }} centered>
        <Modal.Header closeButton className="bg-light py-3">
          <Modal.Title style={{ fontSize: "1.2rem" }}>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          {passwordError && (
            <div className="alert alert-danger mb-4">
              {passwordError}
            </div>
          )}
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                size="lg"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                size="lg"
              />
              <Form.Text className="text-muted">
                Password should be at least 8 characters long
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="py-3">
          <Button variant="secondary" onClick={() => {
            setShowPasswordModal(false);
            setOldPassword("");
            setNewPassword("");
            setPasswordError("");
          }}>Cancel</Button>
          <Button variant="primary" onClick={handleChangePassword}>Update Password</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showFinalConfirm} backdrop="static" keyboard={false} centered>
        <Modal.Body className="text-center py-5">
          <div className="mb-4 text-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
            </svg>
          </div>
          <h5 className="mb-3">Account Deleted Successfully</h5>
          <p className="text-muted">You will be redirected to the login page shortly.</p>
          <Spinner animation="border" variant="primary" size="sm" className="mt-3" />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;