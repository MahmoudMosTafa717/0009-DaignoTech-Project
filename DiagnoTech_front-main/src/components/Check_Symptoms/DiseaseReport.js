import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf"; 
import "./CheckSymptoms.css";

const DoctorSuggestion = ({ doctors }) => {
  const navigate = useNavigate();

  const handleDoctorClick = (doctor) => {
    navigate(`/doctor/${doctor._id}`, { state: { doctor } });
  };

  return (
    <div className="doctor-suggestions">
      <label className="custom-label">
        Doctor Suggestions
        <i className="bi bi-person-heart ms-2" style={{ fontSize: "1.2rem", color: "#3f78b5" }}></i>
      </label>
      <div className="custom-textarea p-3">
        {Array.isArray(doctors) && doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div
              key={index}
              className="doctor-card border rounded p-2 shadow-sm mb-3 d-flex align-items-center gap-3"
              onClick={() => handleDoctorClick(doctor)}
            >
              <i className="bi bi-person-circle" style={{ fontSize: "40px", color: "#007bff" }}></i>
              <div>
                <h6 className="mb-1">{doctor.name}</h6>
                <p className="mb-0" style={{ fontSize: "12px", color: "gray" }}>
                  <i className="bi bi-geo-alt"></i> {doctor.clinicAddress}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No doctors are available for this condition. Please try again later or contact support.</p>
        )}
      </div>
    </div>
  );
};

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const reportData = location.state?.reportData || {
    disease: '',
    description: '',
    precautions: [],
    doctors: [],
  };

  useEffect(() => {
    if (!location.state?.reportData) {
      // Handle missing report data if needed
    }
    document.body.classList.add("custom-report-body");
    return () => {
      document.body.classList.remove("custom-report-body");
    };
  }, [location.state]);

  const downloadReportAsPDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const maxWidth = pageWidth - 2 * margin;
    let y = margin;

    // Header
    doc.setFillColor(60, 120, 181);
    doc.rect(0, 0, pageWidth, 20, "F");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("DiagnoTech | Medical Report", margin, 12);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, 12);
    y += 25;

    // Disease Section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Disease", margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const diseaseText = reportData.disease || "No disease information available";
    const diseaseLines = doc.splitTextToSize(diseaseText, maxWidth);
    doc.text(diseaseLines, margin, y);
    y += diseaseLines.length * 7 + 10;

    // Description Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Description", margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const descriptionText = reportData.description || "No description available for this condition";
    const descriptionLines = doc.splitTextToSize(descriptionText, maxWidth);
    doc.text(descriptionLines, margin, y);
    y += descriptionLines.length * 7 + 10;

    // Precautions Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Precautions", margin, y);
    y += 8;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    if (reportData.precautions.length > 0) {
      reportData.precautions.forEach((item, index) => {
        const precautionText = `${index + 1}. ${item}`;
        const precautionLines = doc.splitTextToSize(precautionText, maxWidth);
        if (y + precautionLines.length * 7 > doc.internal.pageSize.getHeight() - margin - 20) {
          doc.addPage();
          y = margin;
        }
        doc.text(precautionLines, margin, y);
        y += precautionLines.length * 7 + 2;
      });
    } else {
      doc.text("No precautions available.", margin, y);
      y += 10;
    }
    y += 10;

    // Doctor Suggestions Section
    if (reportData.doctors.length > 0) {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Doctor Suggestions", margin, y);
      y += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      reportData.doctors.forEach((doctor, index) => {
        const doctorText = `${index + 1}. Dr. ${doctor.name} - ${doctor.clinicAddress}`;
        const doctorLines = doc.splitTextToSize(doctorText, maxWidth);
        if (y + doctorLines.length * 7 > doc.internal.pageSize.getHeight() - margin - 20) {
          doc.addPage();
          y = margin;
        }
        doc.text(doctorLines, margin, y);
        y += doctorLines.length * 7 + 2;
      });
    }

    // Footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save("Your_Medical_Report.pdf");
  };

  return (
    <div className="container py-5 custom-report">
      <h1 className="text-center mb-4 report-title">Your Medical Report</h1>

      {!reportData.disease && !reportData.description && reportData.precautions.length === 0 && reportData.doctors.length === 0 ? (
        <div className="alert alert-warning text-center" role="alert">
          No report data available. Please try generating the report again or return to the home page.
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-6 d-flex flex-column gap-4">
            <div>
              <label className="custom-label">
                Disease
                <i className="bi bi-virus ms-2" style={{ fontSize: "1rem", color: "#3f78b5" }}></i>
              </label>
              <input
                type="text"
                className="custom-input"
                value={reportData.disease || 'No disease information available'}
                disabled
              />
            </div>
            <div>
              <label className="custom-label">
                Disease Description
                <i className="bi bi-journal-medical ms-2" style={{ fontSize: "1rem", color: "#3f78b5" }}></i>
              </label>
              <textarea
                className="custom-textarea"
                rows="5"
                value={reportData.description || 'No description available for this condition'}
                disabled
              ></textarea>
            </div>
            <div>
              <label className="custom-label">
                Recommended Precautions
                <i className="bi bi-shield-check ms-2" style={{ fontSize: "1rem", color: "#3f78b5" }}></i>
              </label>
              {reportData.precautions.length > 0 ? (
                <div className="precautions-container">
                  {reportData.precautions.map((item, index) => (
                    <div key={index} className="precaution-item">
                      <div className="precaution-number">{index + 1}</div>
                      <div className="precaution-text">{item}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No precautions available for this condition.</p>
              )}
            </div>
          </div>
          <div className="col-lg-6 d-flex flex-column gap-4">
            <div className="w-100">
              <DoctorSuggestion doctors={reportData.doctors} />
            </div>
            <div className="w-100 d-flex flex-column gap-3">
              <button className="custom-btn-secondary" onClick={() => navigate("/")}>
                Go to Home Page
              </button>
              <button className="custom-btn-primary" onClick={downloadReportAsPDF}>
                Download Report as PDF
              </button>
            </div>
            <div className="image-container d-none d-lg-flex justify-content-end gap-3">
              <img
                src="/img/report1.jpeg"
                alt="Medical report illustration"
                className="custom-image"
              />
              <img
                src="/img/report2.jpeg"
                alt="Health report illustration"
                className="custom-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;