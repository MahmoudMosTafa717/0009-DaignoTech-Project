import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { FaCamera, FaEdit, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./profiles.css"
import { BASE_URL } from "../../config";

const UpdateInfo = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    gender: "",
    age: "",
    medicalHistory: "",
    profilePicture: "/img/user.png", 
  });
  const [newprofilePicture, setNewprofilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

    useEffect(() => {
      
      document.body.classList.add("update-info-body");
    
      return () => {
        document.body.classList.remove("update-info-body");
      };
    }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      setFetchLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/api/profile/user`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('jwt')}` }
        });
        if (response.data) {
          setUserData({
            ...response.data.data,
            profilePicture: `${BASE_URL}${response.data.data.profilePicture}` ||
              "/img/user.png",
          });
        }
        setError(null);
      } catch (err) {
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setFetchLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setNewprofilePicture(file);
    setUserData({ ...userData, profilePicture: URL.createObjectURL(file) }); // تحديث الصورة مؤقتًا
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
   
    await axios.put(`${BASE_URL}/api/profile/update`, userData, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}`, "Content-Type": "application/json" }
    });


    if (newprofilePicture) {
      const formData = new FormData();
      formData.append("profilePicture", newprofilePicture);

      const res = await axios.post(`${BASE_URL}/api/profile/uploadProfilePicture`, formData, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("jwt")}` }
      });


      if (res.data.profilePictureUrl) {
        setUserData((prevData) => ({
          ...prevData,
          profilePicture: res.data.profilePictureUrl
        }));
      }
    }

    // 4. عرض رسالة نجاح
    setSuccess(true);
    setTimeout(() => {
      sessionStorage.setItem("reloadProfile", "true");
      navigate("/profile"); 
    }, 1500);

  } catch (err) {

    setError(err.response?.data?.message || "Failed to update profile. Please try again.");
  } finally {
    setLoading(false);
  }
};

    if (fetchLoading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <div className="update-info-bg">
      <Container className="mt-5 d-flex justify-content-center ">
        <Card className="p-4 shadow-lg border-0 rounded-4 text-center" style={{ maxWidth: "700px", width: "100%", backgroundColor: "#f8f9fa" }}>
          {success && <Alert variant="success">Profile updated successfully!</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          <div className="d-flex justify-content-center mb-3">
            <div className="position-relative" style={{ width: "180px", height: "180px" }}>
              <img
                src={userData.profilePicture}
                alt="User Profile"
                className="rounded-circle border border-3 border-primary shadow-sm"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              <label htmlFor="file-input" className="position-absolute" style={{
                bottom: "5px",
                right: "5px",
                backgroundColor: "#007bff",
                padding: "8px",
                borderRadius: "50%",
                color: "white",
                cursor: "pointer",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px"
              }}>
                <FaCamera size={18} />
              </label>
              <input 
                id="file-input" 
                type="file" 
                accept="image/*" 
                style={{ display: "none" }} 
                onChange={handleImageChange}
              />
            </div>
          </div>
          <h3 className="mb-3 fw-bold text-primary">Update Profile</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Full Name</Form.Label>
              <Form.Control 
                type="text" 
                name="fullName"
                value={userData.fullName} 
                onChange={handleInputChange} 
                placeholder="Enter full name" 
                className="shadow-sm" 
                required
              />
            </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control 
                  type="email" 
                  name="email"
                  value={userData.email} 
                  onChange={handleInputChange} 
                  placeholder="Enter email" 
                  className="shadow-sm" 
                  required
                  disabled
                />
              </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Gender</Form.Label>
                  <Form.Control 
                    as="select" 
                    name="gender"
                    value={userData.gender} 
                    onChange={handleInputChange} 
                    className="shadow-sm"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Age</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="age"
                    value={userData.age}
                    onChange={handleInputChange} 
                    placeholder="Enter age" 
                    className="shadow-sm" 
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-between mt-4">
              <Button 
                type="submit"
                variant="primary" 
                className="me-2 px-4 fw-semibold shadow"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaEdit className="me-2" /> Save Changes
                  </>
                )}
              </Button>
              <Link to="/profile">
                <Button variant="secondary" className="px-4 fw-semibold shadow">
                  <FaUser className="me-2" /> Back to Profile
                </Button>
              </Link>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default UpdateInfo;
