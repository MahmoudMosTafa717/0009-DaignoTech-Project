/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import { FaHome, FaUserShield, FaUsers, FaUserMd } from 'react-icons/fa';
import { motion } from "framer-motion";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import "./admin-dashboard.css";
import { FaUserPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { FaUser, FaKey, FaCog, FaChevronDown, FaChevronUp, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaWrench } from 'react-icons/fa';
import { AdminHeader } from "./admin-dashboard-header"
import {
  FaStethoscope,
  FaNotesMedical,
  FaMale,
  FaFemale,
  FaChild,
  FaUserClock
} from "react-icons/fa";
import { BASE_URL } from "../../config";

// eslint-disable-next-line no-unused-vars
const areaData = [
  { month: "Jan", visits: 400 },
  { month: "Feb", visits: 300 },
  { month: "Mar", visits: 500 },
  { month: "Apr", visits: 200 },
  { month: "May", visits: 700 },
];

const barData = [
  { name: "Jan", reports: 240 },
  { name: "Feb", reports: 139 },
  { name: "Mar", reports: 980 },
  { name: "Apr", reports: 390 },
  { name: "May", reports: 480 },
];

export default function Dashboard() {
  // ////////////////////Fetching Data(Statistics)///////////
  const [statCardsData, setStatCardsData] = useState([
    { icon: <FaUsers />, title: "Total Users", value: 0, color: "#4e73df" },
    { icon: <FaUserMd />, title: "Total Doctors", value: 0, color: "#1cc88a" },
    { icon: <FaUserShield />, title: "Total Admins", value: 0, color: "#858796" },
    { icon: <FaStethoscope />, title: "Total Specialties", value: 0, color: "#36b9cc" },
    { icon: <FaNotesMedical />, title: "Total Diagnoses", value: 0, color: "#f6c23e" },
    { icon: <FaMale />, title: "Total Males", value: 0, color: "#4e73df" },
    { icon: <FaFemale />, title: "Total Females", value: 0, color: "#e83e8c" },
    { icon: <FaChild />, title: "Age Under or Equal 35", value: 0, color: "#20c997" },
    { icon: <FaUserClock />, title: "Age Above 35", value: 0, color: "#fd7e14" },
  ]);

  const [monthlyDiagnosesData, setMonthlyDiagnosesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const response = await axios.get(`${BASE_URL}/api/Dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        setStatCardsData([
          { icon: <FaUsers />, title: "Total Users", value: data.totalUsers, color: "#4e73df" },
          { icon: <FaUserMd />, title: "Total Doctors", value: data.totalDoctors, color: "#1cc88a" },
          { icon: <FaUserShield />, title: "Total Admins", value: data.totalAdmins, color: "#858796" },
          { icon: <FaStethoscope />, title: "Total Specialties", value: data.totalSpecialties, color: "#36b9cc" },
          { icon: <FaNotesMedical />, title: "Total Diagnoses", value: data.totalDiagnoses, color: "#f6c23e" },
          { icon: <FaMale />, title: "Total Males", value: data.totalMales, color: "#4e73df" },
          { icon: <FaFemale />, title: "Total Females", value: data.totalFemales, color: "#e83e8c" },
          { icon: <FaChild />, title: "Age Under or Equal 35", value: data.ageUnderOrEqual35, color: "#20c997" },
          { icon: <FaUserClock />, title: "Age Above 35", value: data.ageAbove35, color: "#fd7e14" },
        ]);
        if (Array.isArray(data.monthlyDiagnoses)) {
          console.log("Monthly Diagnoses Data:", data.monthlyDiagnoses);
          setMonthlyDiagnosesData(data.monthlyDiagnoses);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error.response?.data || error.message);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#FF69B4"];
  const genderData = [
    { name: "Male", value: statCardsData[5]?.value || 0 },
    { name: "Female", value: statCardsData[6]?.value || 0 },
  ];

  const totalDiagnosesData = [
    { name: "January", value: statCardsData[4]?.value || 0 },
    { name: "February", value: statCardsData[4]?.value || 0 },
    { name: "March", value: statCardsData[4]?.value || 0 },
    { name: "April", value: statCardsData[4]?.value || 0 },
    { name: "May", value: statCardsData[4]?.value || 0 },
    { name: "June", value: statCardsData[4]?.value || 0 },
    { name: "July", value: statCardsData[4]?.value || 0 },
    { name: "August", value: statCardsData[4]?.value || 0 },
    { name: "September", value: statCardsData[4]?.value || 0 },
    { name: "October", value: statCardsData[4]?.value || 0 },
    { name: "November", value: statCardsData[4]?.value || 0 },
    { name: "December", value: statCardsData[4]?.value || 0 },
  ];

  // ////////////////// view all users////////////////////////////////////////////////////
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("jwt");
      console.log("Token:", token);
      try {
        const response = await axios.get(`${BASE_URL}/api/Dashboard/users/allUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        console.log("Users API Data:", data);
        if (Array.isArray(data)) {
          setUserData(data);
        } else {
          console.error("Users data is not an array", data);
        }
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };
    fetchUsers();
  }, []);

  // //////////////////// Adding Admins/////////////////////////
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [doctorExperience, setDoctorExperience] = useState("");

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/Dashboard/admins/addAdmin`,
        { fullName, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      alert("Admin added successfully!");
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("admin");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error adding admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  ///////////////fetching adding doctor//////////////////////////////////////////////////////////////////////////////////
  const [doctorFullName, setDoctorFullName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [doctorConfirmPassword, setDoctorConfirmPassword] = useState("");
  const [doctorPhoneNumber, setDoctorPhoneNumber] = useState("");
  const [doctorLocation, setDoctorLocation] = useState("");
  const [doctorSpecialization, setDoctorSpecialization] = useState("");
  const [doctorGender, setDoctorGender] = useState("");
  const [doctorAge, setDoctorAge] = useState("");
  const [doctorGoogleMapsLink, setDoctorGoogleMapsLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate password match
    if (doctorPassword !== doctorConfirmPassword) {
      alert("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    // Validate required fields
    if (
      !doctorFullName ||
      !doctorEmail ||
      !doctorPassword ||
      !doctorSpecialization ||
      !doctorLocation ||
      !doctorPhoneNumber ||
      !doctorAge ||
      !doctorGender ||
      !doctorExperience ||
      !doctorGoogleMapsLink
    ) {
      alert("Please fill in all required fields!");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("jwt");
    const doctorData = {
      fullName: doctorFullName,
      email: doctorEmail,
      password: doctorPassword,
      specialty: doctorSpecialization,
      clinicAddress: doctorLocation,
      contact: doctorPhoneNumber,
      age: parseInt(doctorAge), // Ensure age is sent as a number
      gender: doctorGender,
      experience: doctorExperience,
      whatsappLink: `https://wa.me/${doctorPhoneNumber}`,
      googleMapsLink: doctorGoogleMapsLink,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/Dashboard/doctors/addDoctor`,
        doctorData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("API Response:", response.data);
      alert("Doctor added successfully!");
      // Reset form
      setDoctorFullName("");
      setDoctorEmail("");
      setDoctorPassword("");
      setDoctorConfirmPassword("");
      setDoctorPhoneNumber("");
      setDoctorLocation("");
      setDoctorSpecialization("");
      setDoctorGender("");
      setDoctorAge("");
      setDoctorExperience("");
      setDoctorGoogleMapsLink("");
    } catch (error) {
      console.error("Error adding doctor:", error.response?.data || error.message);
      alert(`Error adding doctor: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // /////////////View All Doctors/////////////////////////////////////////
  const [doctorData, setDoctorData] = useState([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("jwt");
      console.log("Token:", token);
      try {
        const response = await axios.get(`${BASE_URL}/api/Dashboard/doctors/alldoctors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log("Doctors API Data:", data);
        if (Array.isArray(data)) {
          setDoctorData(data);
        } else {
          console.error("Doctors Data is not an array", data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error.response?.data || error.message);
      }
    };
    fetchDoctors();
  }, []);

  // ///////////////////////////Search&Delete Admin/////////////////////////////////////////////////////
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [adminData, setAdminData] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = localStorage.getItem("jwt");
      try {
        // Fetch all admins by default
        let url = `${BASE_URL}/api/Dashboard/admins/allAdmins`;
        if (searchQuery.trim().length > 0) {
          // If there's a search query, fetch filtered results
          url = `${BASE_URL}/api/Dashboard/admins/search?query=${searchQuery}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log("Admin Data:", data);
        if (Array.isArray(data.data)) {
          setSearchResults(data.data);
        } else {
          console.error("Admin Data is not an array", data);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching admins:", error.response?.data || error.message);
        setSearchResults([]);
      }
    };
    fetchAdmins();
  }, [searchQuery]);

  const handleDelete = async (adminId) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.delete(`${BASE_URL}/api/Dashboard/admins/deleteAdmin/${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        // Update search results after deletion
        const updatedResults = searchResults.filter((admin) => admin._id !== adminId);
        setSearchResults(updatedResults);
        console.log("Admin deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting admin:", error.response?.data || error.message);
    }
  };

  // //////////////////////////View All Admins/////////////////////////////////////////////////////
  useEffect(() => {
    const fetchAllAdmins = async () => {
      const token = localStorage.getItem("jwt");
      try {
        const response = await axios.get(`${BASE_URL}/api/Dashboard/admins/allAdmins`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        console.log("All Admin Data:", data);
        if (Array.isArray(data.data)) {
          setAdminData(data.data);
        } else {
          console.error("Admin Data is not an array", data);
        }
      } catch (error) {
        console.error("Error fetching all admins:", error.response?.data || error.message);
      }
    };
    fetchAllAdmins();
  }, []);

  // ////////////////////////////Search&Delete Doctors/////////////////////////////////////////////////////////////////////////////////////
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [doctorSearchResults, setDoctorSearchResults] = useState([]);

  const handleDeleteDoctor = async (doctorId) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Dashboard/doctors/deleteDoctor/${doctorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedResults = doctorSearchResults.filter((doc) => doc._id !== doctorId);
        setDoctorSearchResults(updatedResults);
        console.log("Doctor deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem("jwt");
      try {
        let url = `${BASE_URL}/api/Dashboard/doctors/alldoctors`;
        if (doctorSearchQuery.trim().length > 0) {
          url = `${BASE_URL}/api/doctors/doctors/search?specialty=${doctorSearchQuery}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setDoctorSearchResults(data);
        } else {
          console.error("Doctor data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error.response?.data || error.message);
      }
    };
    fetchDoctors();
  }, [doctorSearchQuery]);

  // ///////////////////////Searching&Deleting(Users)//////////////////////////////////////////
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("jwt");
      try {
        let url = `${BASE_URL}/api/Dashboard/users/allUsers`;
        if (userSearchQuery.trim().length > 0) {
          url = `${BASE_URL}/api/Dashboard/users/search?query=${userSearchQuery}`;
        }
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.status === "success" && Array.isArray(response.data.data)) {
          setUserSearchResults(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
      }
    };
    fetchUsers();
  }, [userSearchQuery]);

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem("jwt");
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/Dashboard/users/deleteUser/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const updatedResults = userSearchResults.filter((user) => user._id !== userId);
        setUserSearchResults(updatedResults);
        console.log("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error.response?.data || error.message);
    }
  };

  // ///////////////////////////Admin's Profile///////////////////////////////////////////
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/Dashboard/profilesettings/myinfo`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("An error occurred while fetching data.");
        }
        const data = await response.json();
        if (data.status === "success") {
          setProfileData(data.data);
        } else {
          setError("No data found.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfileData();
  }, []);

  // ////////////////Updating Admin's Info /////////////////////////////////////////////////////////////
  const [updatedName, setUpdatedName] = useState(profileData?.fullName || "");
  useEffect(() => {
    if (profileData?.fullName) {
      setUpdatedName(profileData.fullName);
    }
  }, [profileData]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/Dashboard/profilesettings/updateinfo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({ fullName: updatedName }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        alert("Profile updated successfully ✅");
        setProfileData({ ...profileData, fullName: updatedName });
      } else {
        alert("Update failed ❌");
      }
    } catch (err) {
      alert("An error occurred while connecting to the server ❌");
    }
  };

  // /////////////////Change Admin's Password///////////////////////////////////////
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword === "") {
      alert("Please enter a new password.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/Dashboard/profilesettings/changePassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        setMessage("Password updated successfully ✅");
      } else {
        setMessage("Failed to update password ❌");
      }
    } catch (err) {
      setMessage("An error occurred while connecting to the server ❌");
    }
  };

  // ////////////////////Deleting Admin's Account ///////////////////////////////
  const navigate = useNavigate();
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;
    if (password === "") {
      alert("Please enter your password to confirm the deletion.");
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/Dashboard/profilesettings/deleteAccount`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({ password }),
        }
      );
      const result = await response.json();
      console.log(result);
      if (result.status === "success") {
        alert("Account deleted successfully ✅");
        navigate("/login");
      } else {
        alert("Failed to delete account ❌");
      }
    } catch (err) {
      alert("An error occurred while connecting to the server ❌");
      console.error("Error: ", err);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const [userOpen, setUserOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [deleteDoctorData, setDeleteDoctorData] = useState({ email: "", password: "", confirmPassword: "" });
  const [currentView, setCurrentView] = useState("statistics");
  const [deleteAdminData, setDeleteAdminData] = useState({ email: "", password: "", confirmPassword: "" });
  const [deleteUserData, setDeleteUserData] = useState({ email: "", password: "", confirmPassword: "" });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("statistics");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentView(tab);
  };

  return (
    <div>
      <AdminHeader />
      <div className="d-flex">
        <div className="bg-info text-white p-4 admin-side-bar" style={{ width: '250px', height: '100vh', position: 'fixed', top: '0', left: '0' }}>
          <h4 className="mb-4 admin-dash-info">Admin Dashboard</h4>
          <ul className="list-unstyled">
            <li className="mb-3">
              <a
                href="#"
                className={`text-white d-flex align-items-center admin-dash-info1 ${activeTab === "statistics" ? "admin-active" : ""}`}
                onClick={() => handleTabClick("statistics")}
              >
                <FaHome className="me-2" /> Home Page Statistics
              </a>
            </li>
            <li className="mb-3">
              <a
                href="#"
                className={`text-white d-flex align-items-center ${activeTab === "manage" ? "admin-active" : ""}`}
                onClick={() => { setManageOpen(!manageOpen); handleTabClick("manage"); }}
              >
                <FaWrench className="me-2" />
                Manage {manageOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
              </a>
              {manageOpen && (
                <ul className="list-unstyled ms-4">
                  <li className="mb-3">
                    <a
                      href="#"
                      className={`text-white d-flex align-items-center ${activeTab === "admins" ? "admin-active" : ""}`}
                      onClick={() => { setAdminOpen(!adminOpen); handleTabClick("admins"); }}
                    >
                      <FaUserShield className="me-2" /> Admins {adminOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
                    </a>
                    {adminOpen && (
                      <ul className="list-unstyled ms-4">
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "addAdmin" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("addAdmin")}
                          >
                            <FaUserPlus className="me-2" /> Add New Admin
                          </a>
                        </li>
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "viewAdmins" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("viewAdmins")}
                          >
                            <FaUsers className="me-2" /> View All Admins
                          </a>
                        </li>
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "searchAdmin" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("searchAdmin")}
                          >
                            <FaSearch className="me-2" /> Search Admin
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="mb-3">
                    <a
                      href="#"
                      className={`text-white d-flex align-items-center ${activeTab === "doctors" ? "admin-active" : ""}`}
                      onClick={() => { setDoctorOpen(!doctorOpen); handleTabClick("doctors"); }}
                    >
                      <FaStethoscope className="me-2" /> Doctors {doctorOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
                    </a>
                    {doctorOpen && (
                      <ul className="list-unstyled ms-4">
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "addDoctor" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("addDoctor")}
                          >
                            <FaUserPlus className="me-2" /> Add New Doctor
                          </a>
                        </li>
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "viewDoctors" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("viewDoctors")}
                          >
                            <FaUserMd className="me-2" /> View All Doctors
                          </a>
                        </li>
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "searchDoctor" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("searchDoctor")}
                          >
                            <FaSearch className="me-2" /> Search Doctor
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="mb-3">
                    <a
                      href="#"
                      className={`text-white d-flex align-items-center ${activeTab === "users" ? "admin-active" : ""}`}
                      onClick={() => { setUserOpen(!userOpen); handleTabClick("users"); }}
                    >
                      <FaUsersCog className="me-2" /> Users {userOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
                    </a>
                    {userOpen && (
                      <ul className="list-unstyled ms-4">
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "viewUsers" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("viewUsers")}
                          >
                            <FaUsers className="me-2" /> View All Users
                          </a>
                        </li>
                        <li className="mb-3">
                          <a
                            href="#"
                            className={`text-white d-flex align-items-center ${activeTab === "searchUser" ? "admin-active" : ""}`}
                            onClick={() => handleTabClick("searchUser")}
                          >
                            <FaSearch className="me-2" /> Search User
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                </ul>
              )}
            </li>
            <li className="mb-3">
              <a
                href="#"
                className={`text-white d-flex align-items-center ${activeTab === "settings" ? "admin-active" : ""}`}
                onClick={() => { setSettingsOpen(!settingsOpen); handleTabClick("settings"); }}
              >
                <FaCog className="me-2" /> Settings {settingsOpen ? <FaChevronUp className="ms-auto" /> : <FaChevronDown className="ms-auto" />}
              </a>
              {settingsOpen && (
                <ul className="list-unstyled ms-4">
                  <li className="mb-3">
                    <a
                      href="#"
                      className={`text-white d-flex align-items-center ${activeTab === "profile" ? "admin-active" : ""}`}
                      onClick={() => handleTabClick("profile")}
                    >
                      <FaUser className="me-2" /> My Profile
                    </a>
                  </li>
                  <li className="mb-3">
                    <a
                      href="#"
                      className={`text-white d-flex align-items-center ${activeTab === "updateprofile" ? "admin-active" : ""}`}
                      onClick={() => handleTabClick("updateprofile")}
                    >
                      <FaEdit className="me-2" /> Update Info
                    </a>
                  </li>
                  <li className="mb-3">
                    <a
                      href="#"
                      className={`text-white d-flex align-items-center ${activeTab === "changePassword" ? "admin-active" : ""}`}
                      onClick={() => handleTabClick("changePassword")}
                    >
                      <FaKey className="me-2" /> Change Password
                    </a>
                  </li>
                  <li className="mb-3">
                    <a
                      href="#"
                      className={`text-white d-flex align-items-center ${activeTab === "deleteAccount" ? "admin-active" : ""}`}
                      onClick={() => handleTabClick("deleteAccount")}
                    >
                      <FaTrash className="me-2" /> Delete Account
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* ///////////////////////Statistics//////////////////////////////////////////// */}
        <div className="container mt-5" style={{ marginLeft: '250px' }}>
          {currentView === "statistics" && (
            <>
              <motion.div
                className="row mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {statCardsData.map((card, index) => (
                  <div key={index} className="col-12 col-sm-6 col-md-4 mb-4">
                    <div
                      className="card admin-stat-card text-dark h-100"
                      style={{ backgroundColor: "#f0f0f0" }}
                    >
                      <div className="admin-card-body d-flex align-items-center">
                        <div className="me-3 admin-stat-icon" style={{ fontSize: "1.8rem", color: card.color }}>
                          {card.icon}
                        </div>
                        <div className="admin-stat-content">
                          <h5 className="admin-stat-title">{card.title}</h5>
                          <h6 className="admin-stat-value">{card.value}</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
              <motion.div className="row" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {/* //////////////////////////////Total Diagnoses//////////////////////////////////////// */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="admin-card-body">
                      <h5 className="card-title">Total Diagnoses</h5>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={totalDiagnosesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#007bff"
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                {/* ////////////////////////////////////////Gender Distribution Pie Chart//////////// */}
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="admin-card-body">
                      <h5 className="card-title">Gender Distribution</h5>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {genderData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* /////////////////////////view admin/////////////////////////////////////////////// */}
          {currentView === "viewAdmins" && (
            <div className="row">
              {adminData.map((admin) => {
                const profileImage = admin.profilePicture
                  ? `http://localhost:5000${admin.profilePicture}`
                  : "/img/user.png";
                return (
                  <div key={admin._id} className="col-md-4 col-lg-3 mb-4">
                    <div className="card shadow-lg border-0 rounded-4 h-100">
                      <div className="admin-card-body d-flex flex-column">
                        <div className="text-center mb-3">
                          <img
                            src={profileImage}
                            alt="Admin"
                            className="rounded-circle"
                            width="80"
                            height="80"
                            onError={(e) => (e.target.src = '/img/user.png')}
                          />
                        </div>
                        <h5 className="text-primary text-center mb-2">{admin.fullName}</h5>
                        <h6 className="text-secondary text-center mb-2">{admin.email}</h6>
                        <ul className="list-unstyled text-muted small">
                          <li className="mb-2">
                            <i className="bi bi-briefcase-fill me-2 text-secondary"></i>
                            Role: {admin.role}
                          </li>
                        </ul>
                        <div className="mt-auto text-center">
                          <a
                            href={`mailto:${admin.email}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-primary btn-sm rounded-pill px-4 shadow-sm"
                          >
                            Email Admin
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* //////////////Add Admin//////////////////////////////////////////////// */}
          {currentView === "addAdmin" && (
            <div className="mt-5 d-flex justify-content-center">
              <motion.div
                className="w-100"
                style={{ maxWidth: "600px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card p-4 shadow-lg border-0 rounded-4">
                  <h4 className="mb-4 text-center text-primary">Add New Admin</h4>
                  <form onSubmit={handleAddAdmin}>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="adminName"
                        placeholder="Enter full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                      <label htmlFor="adminName">Full Name</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="adminEmail"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="adminEmail">Email</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="adminPassword"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="adminPassword">Password</label>
                    </div>

                    <div className="form-floating mb-4">
                      <select
                        className="form-select"
                        id="adminRole"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option value="admin">Admin</option>
                      </select>
                      <label htmlFor="adminRole">Role</label>
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary btn-lg rounded-pill shadow addadminbtn" disabled={loading}>
                        {loading ? "Adding..." : "Add Admin"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* /////////////////////////////////Admin's Profile/////////////// */}
          {currentView === "profile" && (
            <div className="admin-profile-wrapper d-flex justify-content-center align-items-center mt-5">
              <motion.div
                className="admin-profile-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="admin-profile-header text-center">
                  <img
                    src={
                      profileData?.profilePicture
                        ? `http://localhost:5000${profileData.profilePicture}`
                        : "/img/user.png"
                    }
                    alt="Profile"
                    className="admin-profile-avatar"
                    onError={(e) => (e.target.src = '/img/user.png')}
                  />
                  <h3 className="admin-profile-name mt-3">{profileData?.fullName || "Loading..."}</h3>
                  <p className="admin-profile-role">{profileData?.role || "Loading..."}</p>
                </div>
                <div className="admin-profile-info-cards mt-4">
                  <div className="admin-info-card">
                    <span className="admin-info-label">Email</span>
                    <span className="admin-info-value">{profileData?.email || "Loading..."}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* ///////////////////////////Updating Profile info//////////////// */}
          {currentView === "updateprofile" && (
            <div className="admin-profile-wrapper d-flex justify-content-center align-items-center mt-5">
              <motion.div
                className="admin-profile-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="admin-profile-name mt-3 text-center">Update Profile</h3>
                <div className="admin-profile-header text-center">
                  <img
                    src={
                      profileData?.profilePicture
                        ? `http://localhost:5000${profileData.profilePicture}`
                        : "/img/user.png"
                    }
                    alt="Profile"
                    className="admin-profile-avatar"
                    onError={(e) => (e.target.src = '/img/user.png')}
                  />
                  <h4 className="mt-3">{profileData?.fullName || "Loading..."}</h4>
                  <p className="admin-profile-role">{profileData?.role || "Loading..."}</p>
                </div>
                <form onSubmit={handleUpdate} className="admin-profile-info-cards mt-4">
                  <div className="admin-info-card">
                    <label className="admin-info-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={updatedName || profileData?.fullName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn w-100 mt-3 addadminbtn">
                    Save Changes
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* ///////////////////////////////////////Changing Password//////////////////////////////////// */}
          {currentView === "changePassword" && (
            <div className="admin-profile-wrapper d-flex justify-content-center align-items-center mt-5">
              <motion.div
                className="admin-profile-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="admin-profile-header text-center">
                  <h3 className="admin-profile-name mt-3">Change Password</h3>
                </div>
                <form onSubmit={handleChangePassword} className="admin-profile-info-cards mt-4">
                  <div className="admin-info-card">
                    <label className="admin-info-label">Old Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="admin-info-card mt-3">
                    <label className="admin-info-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mt-3 addadminbtn">
                    Save Changes
                  </button>
                  {message && <p className="mt-3 text-center">{message}</p>}
                </form>
              </motion.div>
            </div>
          )}

          {/* ////////////////////////////////////Deleting Acc//////////////////////////////////////////// */}
          {currentView === "deleteAccount" && (
            <div className="admin-profile-wrapper d-flex justify-content-center align-items-center mt-5">
              <motion.div
                className="admin-profile-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="admin-profile-header text-center">
                  <h3 className="admin-profile-name mt-3">Delete Account</h3>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleDeleteAccount();
                  }}
                  className="admin-profile-info-cards mt-4"
                >
                  <div className="admin-info-card">
                    <label className="admin-info-label">Enter Your Password to Confirm</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mt-3 addadminbtn">
                    Delete Account
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* //////////////////search admin/////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
          {currentView === "searchAdmin" && (
            <div>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control shadow-lg border-0 rounded-pill py-3 ps-4"
                  placeholder="Search Admin by Name or Email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                />
                <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-primary"></i>
              </div>
              <div className="row mt-4">
                {searchResults.length > 0 ? (
                  searchResults.map((admin) => {
                    const profileImage = admin.profilePicture
                      ? `http://localhost:5000${admin.profilePicture}`
                      : "/img/user.png";
                    return (
                      <div key={admin._id} className="col-md-4 col-lg-3 mb-4">
                        <div className="card shadow-lg border-0 rounded-4 h-100">
                          <div className="admin-card-body d-flex flex-column">
                            <div className="text-center mb-3">
                              <img
                                src={profileImage}
                                alt="Admin"
                                className="rounded-circle"
                                width="80"
                                height="80"
                                onError={(e) => (e.target.src = '/img/user.png')}
                              />
                            </div>
                            <h5 className="text-primary text-center mb-2">{admin.fullName}</h5>
                            <h6 className="text-secondary text-center mb-2">{admin.email}</h6>
                            <ul className="list-unstyled text-muted small">
                              <li className="mb-2">
                                <i className="bi bi-briefcase-fill me-2 text-secondary"></i>
                                Role: {admin.role}
                              </li>
                            </ul>
                            <div className="mt-auto text-center d-flex flex-column gap-2">
                              <a
                                href={`mailto:${admin.email}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-outline-primary btn-sm rounded-pill px-4 shadow-sm"
                              >
                                Email Admin
                              </a>
                              <button
                                onClick={() => handleDelete(admin._id)}
                                className="btn btn-outline-primary btn-sm rounded-pill px-4 shadow-sm"
                              >
                                Delete Admin
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center mt-4">No admins found.</p>
                )}
              </div>
            </div>
          )}

          {/* /////////DOCTOR//////////////////////////////////////// */}
          {/* ///////////view all doc/////////////////// */}
          {currentView === "viewDoctors" && (
            <div className="row">
              {doctorData.map((doctor) => {
                console.log("Doctor Data:", doctor);
                return (
                  <div key={doctor._id} className="col-md-4 col-lg-3 mb-4">
                    <div className="card shadow-lg border-0 rounded-4 h-100">
                      <div className="admin-card-body d-flex flex-column">
                        <h5 className="text-primary text-center mb-2">{doctor.fullName}</h5>
                        <h5 className="text-primary text-center mb-2">{doctor.name}</h5>
                        <ul className="list-unstyled text-muted small">
                          <li className="mb-2">
                            <i className="bi bi-briefcase-fill me-2 text-secondary"></i>
                            Specialty: {doctor.specialty || "N/A"}
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-hospital-fill me-2 text-secondary"></i>
                            Clinic: {doctor.clinicAddress || "N/A"}
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-telephone-fill me-2 text-secondary"></i>
                            Contact: {doctor.contact || "N/A"}
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-geo-alt-fill me-2 text-secondary"></i>
                            <a href={doctor.googleMapsLink} target="_blank" rel="noreferrer">
                              Location
                            </a>
                          </li>
                        </ul>
                        <div className="mt-auto text-center">
                          <a
                            href={doctor.whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline-success btn-sm rounded-pill px-4 shadow-sm"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* //////////////////Add New Doc////////////////////// */}
          {currentView === "addDoctor" && (
            <div className="mt-5 d-flex justify-content-center">
              <motion.div
                className="w-100"
                style={{ maxWidth: "600px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="card p-4 shadow-lg border-0 rounded-4">
                  <h4 className="mb-4 text-center text-primary">Add New Doctor</h4>
                  <form onSubmit={handleAddDoctor}>
                    {/* Full Name */}
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="doctorFullName"
                        placeholder="Enter full name"
                        value={doctorFullName}
                        onChange={(e) => setDoctorFullName(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorFullName">Full Name</label>
                    </div>

                    {/* Email */}
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control"
                        id="doctorEmail"
                        placeholder="Enter email"
                        value={doctorEmail}
                        onChange={(e) => setDoctorEmail(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorEmail">Email</label>
                    </div>

                    {/* Password */}
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="doctorPassword"
                        placeholder="Enter password"
                        value={doctorPassword}
                        onChange={(e) => setDoctorPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorPassword">Password</label>
                    </div>

                    {/* Confirm Password */}
                    <div className="form-floating mb-3">
                      <input
                        type="password"
                        className="form-control"
                        id="doctorConfirmPassword"
                        placeholder="Confirm password"
                        value={doctorConfirmPassword}
                        onChange={(e) => setDoctorConfirmPassword(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorConfirmPassword">Confirm Password</label>
                    </div>

                    {/* Specialty */}
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="doctorSpecialty"
                        value={doctorSpecialization}
                        onChange={(e) => setDoctorSpecialization(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select specialty
                        </option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Psychiatry">Psychiatry</option>
                      </select>
                      <label htmlFor="doctorSpecialty">Specialty</label>
                    </div>

                    {/* Clinic Address */}
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="doctorClinicAddress"
                        placeholder="Enter clinic address"
                        value={doctorLocation}
                        onChange={(e) => setDoctorLocation(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorClinicAddress">Clinic Address</label>
                    </div>

                    {/* Contact */}
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="doctorContact"
                        placeholder="Enter contact number"
                        value={doctorPhoneNumber}
                        onChange={(e) => setDoctorPhoneNumber(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorContact">Contact Number</label>
                    </div>

                    {/* Age */}
                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        className="form-control"
                        id="doctorAge"
                        placeholder="Enter age"
                        value={doctorAge}
                        onChange={(e) => setDoctorAge(e.target.value)}
                        required
                        min="18"
                      />
                      <label htmlFor="doctorAge">Age</label>
                    </div>

                    {/* Gender */}
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="doctorGender"
                        value={doctorGender}
                        onChange={(e) => setDoctorGender(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <label htmlFor="doctorGender">Gender</label>
                    </div>

                    {/* Experience */}
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="doctorExperience"
                        placeholder="Enter years of experience"
                        value={doctorExperience}
                        onChange={(e) => setDoctorExperience(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorExperience">Experience (Years)</label>
                    </div>

                    {/* Google Maps Link */}
                    <div className="form-floating mb-3">
                      <input
                        type="url"
                        className="form-control"
                        id="doctorGoogleMapsLink"
                        placeholder="Enter Google Maps link"
                        value={doctorGoogleMapsLink}
                        onChange={(e) => setDoctorGoogleMapsLink(e.target.value)}
                        required
                      />
                      <label htmlFor="doctorGoogleMapsLink">Google Maps Link</label>
                    </div>

                    {/* WhatsApp Link */}
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="doctorWhatsappLink"
                        placeholder="WhatsApp link will be generated"
                        value={doctorPhoneNumber ? `https://wa.me/${doctorPhoneNumber}` : ""}
                        readOnly
                      />
                      <label htmlFor="doctorWhatsappLink">WhatsApp Link</label>
                    </div>

                    <div className="d-grid">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg rounded-pill shadow addadminbtn"
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add Doctor"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}

          {/* ///////////////////search doctor ////////////////////////////////////////////////////////////////////////////////*/}
          {currentView === "searchDoctor" && (
            <div>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control shadow-lg border-0 rounded-pill py-3 ps-4"
                  placeholder="Search Doctor by Specialty"
                  value={doctorSearchQuery}
                  onChange={(e) => setDoctorSearchQuery(e.target.value)}
                  style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                />
                <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-primary"></i>
              </div>
              <div className="row mt-4">
                {doctorSearchResults.length > 0 ? (
                  doctorSearchResults.map((doctor) => (
                    <div key={doctor._id} className="col-md-4 col-lg-3 mb-4">
                      <div className="card shadow-lg border-0 rounded-4 h-100">
                        <div className="admin-card-body d-flex flex-column">
                          <h5 className="text-primary text-center mb-2">{doctor.fullName || doctor.name}</h5>
                          <h6 className="text-secondary text-center mb-2">{doctor.name}</h6>
                          <ul className="list-unstyled text-muted small">
                            <li><strong>Clinic:</strong> {doctor.clinicAddress}</li>
                            <li><strong>Contact:</strong> {doctor.contact}</li>
                            <li>
                              <strong>Available:</strong>{" "}
                              {Array.isArray(doctor.availableAppointments) && doctor.availableAppointments.length > 0
                                ? doctor.availableAppointments.join(", ")
                                : "N/A"}
                            </li>
                          </ul>
                          <div className="mt-auto text-center">
                            <button
                              onClick={() => handleDeleteDoctor(doctor._id)}
                              className="btn btn-outline-primary btn-sm rounded-pill px-4 shadow-sm"
                            >
                              Delete Doctor
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center mt-4">No doctors found.</p>
                )}
              </div>
            </div>
          )}

          {/* ////////////////////////////////////////////view User//////////////////////// */}
          {currentView === "viewUsers" && (
            <div className="row">
              {userData.map((user) => {
                const profileImage = user.profilePicture
                  ? `http://localhost:5000${user.profilePicture}`
                  : "/img/user.png";
                return (
                  <div key={user._id} className="col-md-4 col-lg-3 mb-4">
                    <div className="card shadow-lg border-0 rounded-4 h-100">
                      <div className="admin-card-body d-flex flex-column">
                        <div className="text-center mb-3">
                          <img
                            src={profileImage}
                            alt={user.fullName}
                            className="rounded-circle shadow"
                            width="80"
                            height="80"
                            onError={(e) => (e.target.src = '/img/user.png')}
                          />
                        </div>
                        <h5 className="text-primary text-center mb-2">{user.fullName}</h5>
                        <ul className="list-unstyled text-muted small">
                          <li className="mb-2">
                            <i className="bi bi-envelope-fill me-2 text-secondary"></i>
                            {user.email}
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-gender-ambiguous me-2 text-secondary"></i>
                            {user.gender}
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-calendar me-2 text-secondary"></i>
                            {user.age} years old
                          </li>
                          <li className="mb-2">
                            <i className="bi bi-person-fill me-2 text-secondary"></i>
                            Role: {user.role}
                          </li>
                        </ul>
                        <div className="mt-auto text-center">
                          <button className="btn btn-outline-primary btn-sm rounded-pill px-4 shadow-sm">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* /////////////////////////////////////Searching User/////////////////////////////////////////// */}
          {currentView === "searchUser" && (
            <div>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control shadow-lg border-0 rounded-pill py-3 ps-4"
                  placeholder="Search User by Name or Email"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                />
                <i className="bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-primary"></i>
              </div>
              <div className="row mt-4">
                {userSearchResults.length > 0 ? (
                  userSearchResults.map((user) => (
                    <div key={user._id} className="col-md-4 col-lg-3 mb-4">
                      <div className="card shadow-lg border-0 rounded-4 h-100">
                        <div className="admin-card-body d-flex flex-column">
                          <img
                            src={
                              user.profilePicture
                                ? `http://localhost:5000${user.profilePicture}`
                                : "/img/user.png"
                            }
                            alt="Profile"
                            className="rounded-circle mb-3 mx-auto"
                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            onError={(e) => (e.target.src = '/img/user.png')}
                          />
                          <h5 className="text-primary text-center mb-2">{user.fullName}</h5>
                          <h6 className="text-secondary text-center mb-2">{user.email}</h6>
                          <p className="text-muted text-center mb-2">Age: {user.age}</p>
                          <p className="text-muted text-center mb-3">Gender: {user.gender}</p>
                          <div className="mt-auto text-center">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="btn btn-outline-primary btn-sm rounded-pill px-4 shadow-sm"
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center mt-4">No users found.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
