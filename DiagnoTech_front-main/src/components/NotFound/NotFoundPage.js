import React from "react";
import { Button } from "react-bootstrap";
import { FiAlertCircle } from "react-icons/fi";
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-404">
          <span className="digit">4</span>
          <div className="icon-wrapper">
            <FiAlertCircle className="alert-icon" />
          </div>
          <span className="digit">4</span>
        </div>

        <h1 className="oops-text">Oops! Page not found</h1>
        <p className="description">
          The page you’re looking for might have been removed,<br />
          had its name changed, or is temporarily unavailable.
        </p>

        <Button className="back-button" href="/">Back To Home Page</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
