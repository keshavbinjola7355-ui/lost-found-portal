import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import {
  Calendar,
  MapPin,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Compass,
  Laptop,
  Key,
  ShieldCheck,
  Tag,
  FileText
} from "lucide-react";
import animationData from "../animations/login.json";
import "../style/MyReport.css";

// Handle dynamic module resolution for different bundler environments (Vite/ESM/CJS)
const LottiePlayer = typeof Lottie === "function" ? Lottie : (Lottie.default || Lottie);

const MyReport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [reports, setReports] = useState([]);

  // Load reports from localStorage or use premium fallback data
  useEffect(() => {
    const localLost = JSON.parse(localStorage.getItem("lost-reports") || "[]");
    const localFound = JSON.parse(localStorage.getItem("found-reports") || "[]");
    
    // Combine and format the local items
    const combinedLocal = [
      ...localLost.map((item) => ({
        id: item.id || `lost-${Date.now()}-${Math.random()}`,
        title: item.itemName || item.title || "Unnamed Item",
        category: item.category || "Item",
        date: item.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        location: item.location || "Campus Grounds",
        type: "lost",
        status: item.status || "searching", // searching, matched, resolved
      })),
      ...localFound.map((item) => ({
        id: item.id || `found-${Date.now()}-${Math.random()}`,
        title: item.itemName || item.title || "Unnamed Item",
        category: item.category || "Item",
        date: item.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        location: item.location || "Campus Grounds",
        type: "found",
        status: item.status || "matched", // searching, matched, resolved
      })),
    ];

    if (combinedLocal.length > 0) {
      setReports(combinedLocal);
    } else {
      // Default premium mock data for demonstration
      const mockData = [
        {
          id: "mock-1",
          title: "MacBook Pro 14\" (Space Grey)",
          category: "electronics",
          date: "Jun 15, 2026",
          location: "Library Study Room 402",
          type: "lost",
          status: "matched", // matched with a found report
        },
        {
          id: "mock-2",
          title: "Keys on a brown leather strap",
          category: "keys",
          date: "Jun 17, 2026",
          location: "Main Cafeteria near exit",
          type: "lost",
          status: "searching", // actively searching
        },
        {
          id: "mock-3",
          title: "Leather Wallet (Black)",
          category: "documents",
          date: "Jun 12, 2026",
          location: "Admin Block staircase",
          type: "found",
          status: "resolved", // return completed
        }
      ];
      setReports(mockData);
    }
  }, []);

  // Filter logic based on tabs
  const filteredReports = reports.filter((report) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return report.status === "searching" || report.status === "matched";
    if (activeTab === "resolved") return report.status === "resolved";
    return true;
  });

  // Helper to get category icons
  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes("electronic") || cat.includes("laptop") || cat.includes("phone")) {
      return <Laptop size={18} />;
    }
    if (cat.includes("key")) {
      return <Key size={18} />;
    }
    if (cat.includes("wallet") || cat.includes("card") || cat.includes("document") || cat.includes("id")) {
      return <ShieldCheck size={18} />;
    }
    return <Tag size={18} />;
  };

  // Stats calculation
  const totalReports = reports.length;
  const activeSearches = reports.filter((r) => r.status === "searching" || r.status === "matched").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="my-reports-container">
      {/* Top Welcome Section */}
      <div className="reports-header">
        <h1>My Reports</h1>
        <p>Monitor your active claims, scan campus matches, and manage resolved items.</p>
      </div>

      {/* Stats Row */}
      <div className="reports-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FileText size={22} />
          </div>
          <div className="stat-info">
            <h3>{totalReports}</h3>
            <p>Total Reports</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <Clock size={22} />
          </div>
          <div className="stat-info">
            <h3>{activeSearches}</h3>
            <p>Active Searches</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <CheckCircle size={22} />
          </div>
          <div className="stat-info">
            <h3>{resolvedReports}</h3>
            <p>Resolved Items</p>
          </div>
        </div>
      </div>

      {/* Grid Layout for Radar & List */}
      <div className="reports-layout">
        {/* Left Widget: Radar scanner using Lottie Animation */}
        <div className="radar-widget">
          <div className="radar-badge">
            <span className="radar-ping"></span>
            Radar Active
          </div>
          
          <div className="lottie-animation-container">
            <LottiePlayer 
              animationData={animationData} 
              loop={true} 
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          <h3>Campus Match Radar</h3>
          <p>
            Our matching engine scans all newly reported found items every few minutes to check for compatibility with your lost items.
          </p>
          
          <button 
            className="radar-action-btn"
            onClick={() => navigate("/reportLost")}
          >
            Report Another Lost Item
          </button>
        </div>

        {/* Right Widget: Tabs & List */}
        <div className="reports-list-card">
          <div className="reports-tabs">
            <button
              className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Reports
            </button>
            <button
              className={`tab-btn ${activeTab === "active" ? "active" : ""}`}
              onClick={() => setActiveTab("active")}
            >
              Active ({activeSearches})
            </button>
            <button
              className={`tab-btn ${activeTab === "resolved" ? "active" : ""}`}
              onClick={() => setActiveTab("resolved")}
            >
              Resolved ({resolvedReports})
            </button>
          </div>

          {filteredReports.length > 0 ? (
            <div className="reports-grid">
              {filteredReports.map((report) => (
                <div key={report.id} className="report-item-card">
                  <div className="report-item-left">
                    <div className="item-icon-circle">
                      {getCategoryIcon(report.category)}
                    </div>
                    <div className="item-details">
                      <h4>{report.title}</h4>
                      <div className="item-meta">
                        <span>
                          <Calendar size={12} />
                          {report.date}
                        </span>
                        <span>
                          <MapPin size={12} />
                          {report.location}
                        </span>
                        <span style={{ textTransform: "capitalize", fontWeight: "600", color: report.type === "lost" ? "#b91c1c" : "#047857" }}>
                          ({report.type})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="report-item-right">
                    <span className={`status-badge ${report.status}`}>
                      {report.status}
                    </span>
                    <button className="view-details-btn">Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h4>No reports here</h4>
              <p>Try reporting a new item or switching tabs.</p>
              <button 
                className="empty-state-btn"
                onClick={() => navigate("/reportLost")}
              >
                File Report
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReport;
