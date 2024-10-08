import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";

import {
  NavLink,
  Routes,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { isUser } from "../utils/Decoded";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "../utils/Api";

function Header() {
  const dispatch = useDispatch();
  const user = isUser?.userId;
  const [request, setRequest] = useState([]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await api(`/users/logout`, "POST", {}, {});
    // localStorage.removeItem("credentials");
    dispatch({ type: "LOGOUT" });

    document.cookie = "user=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/";
    navigate("/");

    return toast.success(`Successfully logged out ${user?.email}`);
  };

  const fetchRequests = async () => {
    const response = await axios.get(
      "http://localhost:4000/proccess/fetchRequests"
      // "https://winton.freytonhomes.com/proccess/fetchRequests"

    );
    setRequest(response.data.requests);
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  const requestLenght = request.length;

  return (
    <>
      <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md mt-5 ">
        {/* Menu toogle for mobile view or small screen */}
        <div className="flex-1">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <Bars3Icon className="h-5 inline-block w-5" />
          </label>
        </div>

        <div>
          <Link
            to={"/requests"} 
            className=" relative material-symbols-outlined right-3"
          >
            notifications
          </Link>
          <button className="absolute -top-1 right-20 text-center cursor-pointer  text-red-600 text-2xl w-4 h-4 rounded-full">
            {requestLenght}
          </button>
        </div>
        <div className="flex-none ">
          {/* Profile icon, opening menu on click */}
          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img  className=" object-center"
                src="https://media.geeksforgeeks.org/wp-content/uploads/20240226132217/w2.png" 
                 alt="profile" />
              </div>
            </label>
            <div
              tabIndex={0}
              className="menu menu-compact cursor-pointer dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <span>
                <a onClick={handleLogout}>Logout</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
