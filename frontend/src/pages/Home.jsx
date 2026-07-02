import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Laptop,
  Key,
  ShieldCheck,
  BookOpen,
  Shirt,
  HelpCircle,
  X,
  FileText,
  AlertCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import "../style/Home.css";

/**
 * Home Component
 * 
 * Purpose:
 * Renders the homepage portal dashboard for College Lost & Found.
 * Shows active listings, live search, categories, and detail cards.
 * 
 * Working Mechanics:
 * 1. Combining Stores: Merges 'lost-reports' and 'found-reports' from localStorage on mount.
 * 2. Search & Filter: Computes the displayed items using state inputs (query, category, and type).
 * 3. Detail Dialog: Opens a detailed modal displaying the contact details and description of any selected item.
 * 4. Fallback Data: Loads pre-defined premium items if no entries exist in localStorage yet.
 */
const Home = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);

  // Load and combine reports from localStorage or fall back to high-quality mock data
  useEffect(() => {
    const localLost = JSON.parse(localStorage.getItem("lost-reports") || "[]");
    const localFound = JSON.parse(localStorage.getItem("found-reports") || "[]");

    const formattedLost = localLost.map((item) => ({
      id: item.id || `lost-${Date.now()}-${Math.random()}`,
      title: item.itemName || item.title || "Unnamed Item",
      category: item.category || "other",
      location: item.location || "Campus Grounds",
      date: item.date || "Just now",
      description: item.description || "No description provided.",
      contactPhone: item.contactPhone || "N/A",
      hasReward: item.hasReward || false,
      rewardAmount: item.rewardAmount || "",
      type: "lost",
      status: item.status || "searching",
      timestamp: item.timestamp || Date.now(),
    }));

    const formattedFound = localFound.map((item) => ({
      id: item.id || `found-${Date.now()}-${Math.random()}`,
      title: item.itemName || item.title || "Unnamed Item",
      category: item.category || "other",
      location: item.location || "Campus Grounds",
      date: item.date || "Just now",
      description: item.description || "No description provided.",
      contactPhone: item.contactPhone || "N/A",
      collectedLocation: item.collectedLocation || "with-finder",
      type: "found",
      status: item.status || "matched",
      timestamp: item.timestamp || Date.now(),
    }));

    const combined = [...formattedLost, ...formattedFound].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    if (combined.length > 0) {
      setReports(combined);
    } else {
      // Premium placeholder data for a great first look
      const mockData = [
        {
          id: "mock-1",
          title: "Space Grey MacBook Pro 14\"",
          category: "electronics",
          location: "Library Study Room 402",
          date: "Jun 24, 2026",
          description: "Space Grey 14-inch MacBook with stickers on the top cover (includes a Github sticker and a React sticker).",
          contactPhone: "+91 98765 43210",
          hasReward: true,
          rewardAmount: "Free Starbucks Coffee",
          type: "lost",
          status: "searching",
          timestamp: Date.now() - 3600000 * 2,
        },
        {
          id: "mock-2",
          title: "Keychain with Brown Leather Strap",
          category: "keys",
          location: "Main Cafeteria corner table",
          date: "Jun 25, 2026",
          description: "Found three keys on a brown leather strap near the payment counter.",
          contactPhone: "+91 87654 32109",
          collectedLocation: "turned-in-security",
          type: "found",
          status: "matched",
          timestamp: Date.now() - 3600000 * 4,
        },
        {
          id: "mock-3",
          title: "Black Leather Tri-fold Wallet",
          category: "documents",
          location: "Sports Complex locker room",
          date: "Jun 23, 2026",
          description: "Black wallet containing a college ID card and metro card. Handed over to the front desk.",
          contactPhone: "+91 76543 21098",
          hasReward: false,
          type: "lost",
          status: "resolved",
          timestamp: Date.now() - 3600000 * 24,
        },
      ];
      setReports(mockData);
    }
  }, []);

  // Category Icon Mapper
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "electronics":
        return <Laptop size={18} />;
      case "keys":
        return <Key size={18} />;
      case "documents":
        return <ShieldCheck size={18} />;
      case "books":
        return <BookOpen size={18} />;
      case "clothing":
        return <Shirt size={18} />;
      default:
        return <HelpCircle size={18} />;
    }
  };

  // Stats Calculator
  const totalLost = reports.filter((r) => r.type === "lost" && r.status !== "resolved").length;
  const totalFound = reports.filter((r) => r.type === "found" && r.status !== "resolved").length;
  const totalResolved = reports.filter((r) => r.status === "resolved").length;

  // Filters logic
  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;

    const matchesType = typeFilter === "all" || item.type === typeFilter;

    return matchesSearch && matchesCategory && matchesType;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Campus Lost & Found</h1>
        <p>
          Misplaced a belonging or found something on campus? File a report to instantly scan matching logs and connect with fellow students.
        </p>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="quick-actions-row">
        <Link to="/reportLost" className="action-card lost-trigger">
          <div className="action-icon-circle">
            <AlertCircle size={24} />
          </div>
          <div className="action-card-info">
            <h3>I Lost Something</h3>
            <p>File a report detailing your lost item. Our match engines scan incoming found logs continuously.</p>
          </div>
        </Link>
        <Link to="/reportfound" className="action-card found-trigger">
          <div className="action-icon-circle">
            <PlusCircle size={24} />
          </div>
          <div className="action-card-info">
            <h3>I Found Something</h3>
            <p>Report an item you've picked up. Help it reach its rightful owner safely and quickly.</p>
          </div>
        </Link>
      </section>

      {/* Live Statistics Row */}
      <section className="stats-row">
        <div className="stat-box">
          <div className="stat-icon">
            <FileText size={20} />
          </div>
          <div className="stat-meta">
            <h3>{totalLost}</h3>
            <p>Active Lost Claims</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">
            <Search size={20} />
          </div>
          <div className="stat-meta">
            <h3>{totalFound}</h3>
            <p>Reported Found Items</p>
          </div>
        </div>
        <div className="stat-box">
          <div className="stat-icon">
            <ArrowRight size={20} />
          </div>
          <div className="stat-meta">
            <h3>{totalResolved}</h3>
            <p>Successfully Returned</p>
          </div>
        </div>
      </section>

      {/* Controls & Filter Board */}
      <section className="dashboard-controls">
        <div className="controls-header">
          <h2>Campus Live Feeds</h2>
          {(searchQuery || categoryFilter !== "all" || typeFilter !== "all") && (
            <button className="clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        <div className="filter-grid">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search items by name, location, keyword..."
              className="search-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="select-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="keys">Keys</option>
            <option value="documents">Wallets & Documents</option>
            <option value="books">Books & Stationery</option>
            <option value="clothing">Clothing & Accessories</option>
            <option value="other">Other</option>
          </select>

          <select
            className="select-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
        </div>
      </section>

      {/* Main Items Listing Grid */}
      <section className="items-list-section">
        {filteredReports.length > 0 ? (
          <div className="grid-layout">
            {filteredReports.map((item) => (
              <div key={item.id} className="item-dashboard-card">
                <div className="item-card-top">
                  <div className="category-badge-circle">
                    {getCategoryIcon(item.category)}
                  </div>
                  <span className={`type-badge ${item.type}`}>
                    {item.type}
                  </span>
                </div>

                <div className="item-card-mid">
                  <h3>{item.title}</h3>
                  <div className="item-meta-info">
                    <div className="meta-row">
                      <MapPin size={14} />
                      <span>{item.location}</span>
                    </div>
                    <div className="meta-row">
                      <Calendar size={14} />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>

                <div className="item-card-bottom">
                  <span className={`status-indicator ${item.status}`}>
                    {item.status === "searching" ? "Searching" : item.status === "matched" ? "Reported Found" : "Resolved"}
                  </span>
                  <button
                    className="details-action-btn"
                    onClick={() => setSelectedItem(item)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-dashboard-state">
            <h4>No match found</h4>
            <p>No listings match your search keywords or filter criteria.</p>
          </div>
        )}
      </section>

      {/* Item Detail Modal overlay */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-left">
                <span className={`type-badge ${selectedItem.type}`}>
                  {selectedItem.type}
                </span>
                <h2>{selectedItem.title}</h2>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedItem(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div>
                <p className="modal-section-title">Item Description</p>
                <div className="modal-desc-box">
                  {selectedItem.description}
                </div>
              </div>

              <div className="modal-details-grid">
                <div className="detail-item-box">
                  <p className="label">Location</p>
                  <p className="value">{selectedItem.location}</p>
                </div>
                <div className="detail-item-box">
                  <p className="label">Date Reported</p>
                  <p className="value">{selectedItem.date}</p>
                </div>
                <div className="detail-item-box">
                  <p className="label">Category</p>
                  <p className="value" style={{ textTransform: "capitalize" }}>
                    {selectedItem.category}
                  </p>
                </div>
                <div className="detail-item-box">
                  <p className="label">Status</p>
                  <p className="value" style={{ textTransform: "capitalize" }}>
                    {selectedItem.status === "searching" ? "Searching" : selectedItem.status === "matched" ? "Reported Found" : "Resolved"}
                  </p>
                </div>
              </div>

              {selectedItem.type === "lost" && selectedItem.hasReward && (
                <div className="detail-item-box" style={{ borderColor: "#b45309", backgroundColor: "#fffbeb" }}>
                  <p className="label" style={{ color: "#b45309" }}>Reward Offered 🎉</p>
                  <p className="value" style={{ color: "#78350f" }}>{selectedItem.rewardAmount}</p>
                </div>
              )}

              {selectedItem.type === "found" && selectedItem.collectedLocation && (
                <div className="detail-item-box" style={{ borderColor: "var(--color-accent-teal)", backgroundColor: "var(--color-accent-teal-tint)" }}>
                  <p className="label" style={{ color: "var(--color-accent-teal)" }}>Current Location</p>
                  <p className="value" style={{ color: "var(--color-accent-teal-hover)", fontSize: "0.85rem" }}>
                    {selectedItem.collectedLocation === "with-finder" && "Still with finder (Contact below)"}
                    {selectedItem.collectedLocation === "turned-in-security" && "Turned in at Campus Security Desk"}
                    {selectedItem.collectedLocation === "turned-in-dept" && "Turned in at Department Office"}
                  </p>
                </div>
              )}

              <div>
                <p className="modal-section-title">Contact Finder/Owner</p>
                <div className="detail-item-box" style={{ backgroundColor: "#fafafa" }}>
                  <p className="label">Phone Number</p>
                  <p className="value">{selectedItem.contactPhone}</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn-close"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
              <a
                href={`tel:${selectedItem.contactPhone}`}
                className="modal-btn-action"
                style={{ textDecoration: "none" }}
              >
                Call Contact
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
