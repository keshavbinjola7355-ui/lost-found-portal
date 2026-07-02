import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import "../style/ReportForm.css";

/**
 * ReportLost Component
 * 
 * Purpose:
 * Renders a form for users to report lost items. Saves the data into localStorage
 * to sync with the main campus dashboard list.
 * 
 * Working Mechanics:
 * 1. State Binding: Form values bind to a single `formData` object.
 * 2. Autofill: Loads contact phone from `localStorage` ("college-user") on mount.
 * 3. Validation: Enforces required inputs. Uses maximum date as today.
 * 4. Submission: Creates a unique report, prepends to `lost-reports` array in `localStorage`, and displays a success view.
 */
const ReportLost = () => {
  const navigate = useNavigate();

  // Single form state is much easier to manage and handle
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
    hasReward: false,
    rewardAmount: "",
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

  // One change handler for all form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create report object
    const newReport = {
      ...formData,
      id: `lost-${Date.now()}`,
      title: formData.itemName, // to match homepage listing
      type: "lost",
      status: "searching",
      date: new Date(formData.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      timestamp: Date.now(),
    };

    // Save to localStorage
    const currentReports = JSON.parse(localStorage.getItem("lost-reports") || "[]");
    currentReports.unshift(newReport);
    localStorage.setItem("lost-reports", JSON.stringify(currentReports));

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="form-page-container">
        <div className="success-card">
          <div className="success-icon-wrapper">
            <CheckCircle2 size={36} />
          </div>
          <h2>Lost Report Filed</h2>
          <p>
            Your item <strong>"{formData.itemName}"</strong> has been logged in the college database.
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
        <h1>Report a Lost Belonging</h1>
        <p>Accurate logs help our matching engine find potential items.</p>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {/* Item Name */}
        <div className="form-group">
          <label className="form-label">Item Name <span className="required">*</span></label>
          <input
            type="text"
            name="itemName"
            className="form-input"
            placeholder="e.g. MacBook Pro, Blue Water Bottle, Black Wallet"
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
            <label className="form-label">Last Seen Location <span className="required">*</span></label>
            <input
              type="text"
              name="location"
              className="form-input"
              placeholder="e.g. Library Study Room 402, Gym"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Date & Phone */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Date Lost <span className="required">*</span></label>
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

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Item Details & Description <span className="required">*</span></label>
          <textarea
            name="description"
            className="form-textarea"
            placeholder="Describe specific features (color, stickers, engravings, etc.)"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Reward Switch */}
        <div className="toggle-wrapper">
          <div className="toggle-label-group">
            <h4>Offer a Reward?</h4>
            <p>Encourage faster return of high-value items.</p>
          </div>
          <label className="switch-label-slider">
            <input
              type="checkbox"
              name="hasReward"
              className="switch-input-element"
              checked={formData.hasReward}
              onChange={handleChange}
            />
            <span className="switch-slider-round"></span>
          </label>
        </div>

        {/* Conditional Reward Input */}
        {formData.hasReward && (
          <div className="form-group reward-input-container">
            <label className="form-label">Reward Description / Amount</label>
            <input
              type="text"
              name="rewardAmount"
              className="form-input"
              placeholder="e.g. Coffee Treat, cash amount, chocolate box"
              value={formData.rewardAmount}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Submit */}
        <div className="form-actions">
          <button type="submit" className="form-submit-btn">
            File Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportLost;
