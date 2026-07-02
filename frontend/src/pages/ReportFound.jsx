import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import "../style/ReportForm.css";

/**
 * ReportFound Component
 * 
 * Purpose:
 * Renders a form for users to report found items. Saves the data into localStorage
 * to sync with the main campus dashboard list.
 * 
 * Working Mechanics:
 * 1. State Binding: Form values bind to a single `formData` object.
 * 2. Autofill: Pre-fills contact details from the logged-in user profile.
 * 3. Validation: Enforces required inputs. Uses maximum date as today.
 * 4. Submission: Creates a unique report, prepends to `found-reports` array in `localStorage`, and displays a success view.
 */
const ReportFound = () => {
  const navigate = useNavigate();

  // Found item state setup
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
    collectedLocation: "with-finder", // with-finder, turned-in-security, turned-in-dept
    contactPhone: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Autofill user's phone from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("college-user") || "null");
    if (user?.phone) {
      setFormData((prev) => ({ ...prev, contactPhone: user.phone }));
    }
  }, []);

  // Update state on inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create report object
    const newReport = {
      ...formData,
      id: `found-${Date.now()}`,
      title: formData.itemName, // matches homepage listing
      type: "found",
      status: "matched", // active found report
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      timestamp: Date.now(),
    };

    // Save to localStorage
    const currentReports = JSON.parse(localStorage.getItem("found-reports") || "[]");
    currentReports.unshift(newReport);
    localStorage.setItem("found-reports", JSON.stringify(currentReports));

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="form-page-container">
        <div className="success-card">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={36} />
          </div>
          <h2>Found Report Filed</h2>
          <p>
            Your found item <strong>"{formData.itemName}"</strong> has been logged in the college database. Thank you for your honesty!
          </p>
          <div className="success-actions">
            <button className="success-btn-primary" onClick={() => navigate("/")}>
              Go to Home
            </button>
            <button className="success-btn-secondary" onClick={() => navigate("/myreports")}>
              View My Reports
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="form-header">
        <Link to="/" className="view-all-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "12px", textDecoration: "none", color: "var(--color-accent)", fontWeight: "600" }}>
          <ArrowLeft size={16} /> Back to Homepage
        </Link>
        <h1>Report a Found Belonging</h1>
        <p>Your record helps the owner locate their misplaced item.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {/* Item Name */}
        <div className="form-group">
          <label className="form-label">Item Name <span className="required">*</span></label>
          <input
            type="text"
            name="itemName"
            className="form-input"
            placeholder="e.g. Blue Water Bottle, Keys, Black Wallet"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category & Location */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Category <span className="required">*</span></label>
            <select name="category" className="form-select" value={formData.category} onChange={handleChange} required>
              <option value="" disabled>Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="keys">Keys</option>
              <option value="documents">Wallets & Documents</option>
              <option value="books">Books & Stationery</option>
              <option value="clothing">Clothing & Accessories</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Where Was it Found? <span className="required">*</span></label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="e.g. Near Library Desk, Cafeteria Table"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Date & Phone */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Date Found <span className="required">*</span></label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Phone <span className="required">*</span></label>
            <input
              type="tel"
              name="contactPhone"
              className="form-input"
              placeholder="e.g. +91 98765 43210"
              value={formData.contactPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Collected Location Status */}
        <div className="form-group">
          <label className="form-label">Current Location of the Item <span className="required">*</span></label>
          <select
            name="collectedLocation"
            className="form-select"
            value={formData.collectedLocation}
            onChange={handleChange}
            required
          >
            <option value="with-finder">Still with me (Finder)</option>
            <option value="turned-in-security">Turned in at Campus Security Desk</option>
            <option value="turned-in-dept">Turned in at Department/Admin Block Office</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Item Details & Description <span className="required">*</span></label>
          <textarea
            name="description"
            className="form-textarea"
            placeholder="Describe specific features (but do omit private markings so owners can prove ownership)"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="form-submit-btn">
            File Found Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportFound;
