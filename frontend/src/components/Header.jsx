import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../../src/images/screen.png";
import { House } from "lucide-react";
import { SearchCheck } from "lucide-react";
import { Archive } from "lucide-react";
import { FolderSearch2 } from "lucide-react";
import { LogOut } from 'lucide-react';
import "../style/Header.css"


const Header = () => {
  const navigate = useNavigate();
  function handlelogin() {
    navigate("/login");
  }
  return (
    <>
    <header className="header">
      <div className="logo">
        <img src={logo} alt="logo" />
        College Lost & Found
      </div>
      <nav>
        <div>
          <span>
            <House />
          </span>
          Home
        </div>
        <div>
          <span>
            <SearchCheck />
          </span>
          Report Lost
        </div>
        <div>
          <span>
            <Archive />
          </span>
          Report Found
        </div>
        <div>
          <span>
            <FolderSearch2 />
          </span>
          My Reports
        </div>
      </nav>

      <div className="auth">
        <div>Keshav</div>
        <button onClick={handlelogin}>
          <span>
            <LogOut />
          </span>
        </button>
      </div>
      </header>
    </>
  );
};

export default Header;
