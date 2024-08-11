import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../componets/images/logo.jpg";
import "./Image.css";
import "../css/navbar.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "../hooks/UseAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Search from "./Search";
import { isUser, isAdmin } from "../utils/Decoded";
import { api } from "../utils/Api";

function Navbar() {
  const { dispatch } = useAuthContext();
  // const { user } = useAuthContext();
  const role = useIsAdmin();
  const admin = isAdmin();

  const [open, setOpen] = useState(false);
  let navigate = useNavigate();

  const user = isUser()?.userId;

  const handleLogout = async () => {
    await api(`/users/logout`, "POST", {}, {});
    // localStorage.removeItem("credentials");
    dispatch({ type: "LOGOUT" });

    document.cookie = "user=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/";
    navigate("/");

    return toast.success(`Successfully logged out ${user?.email}`);
  };

  return (
    <div>
      <header class="border-b bg-white font-sans min-h-[60px] px-10 py-3 relative">
        <div class="flex flex-wrap items-center max-lg:gap-y-6 max-sm:gap-x-4">
          <a href="/">
            <div class="text-center">
              <div class="inline-block w-20 h-20 rounded-full overflow-hidden">
                <img src={logo} alt="Logo" class="w-full h-full object-cover" />
              </div>
              
              <p class="text-blue-400 text-2xl font-bold mt-3">Freyton Homes</p>
            </div>
          </a>

          <div class="flex items-center ml-auto lg:order-1">
            <div className=" sticky top-0 bg-base-100  z-40  ">
              <div className="dropdown dropdown-end ml-4">
                <label tabIndex={0} className="">
                  <div className="w-10 rounded-full">
                    <p className="cursor-pointer">
                      <img
                        width="100"
                        height="100"
                        src="https://media.geeksforgeeks.org/wp-content/uploads/20240226132217/w2.png"
                        alt="profile"
                      />
                    </p>
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {user && (
                    <>
                      <li className="justify-between">
                        <a href={"/account/"}> Profile </a>
                      </li>
                      <li>
                        <a onClick={handleLogout}>Logout</a>
                      </li>
                    </>
                  )}

                  {!user && (
                    <>
                      <li className="justify-between">
                        <a href="/Login">Login</a>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setOpen(!open)}
              id="toggle"
              class="lg:hidden ml-7"
            >
              <svg
                class="w-7 h-7"
                fill="#000"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <ul
            className={`absolute lg:static left-0 w-full lg:w-0  lg:flex mx-auto lg:space-x-10 max-lg:space-y-3   md:z-auto z-40  transition-all duration-500 ease-in ${
              open ? "top-52 bg-gray-50 z-40 " : "top-[-490px]"
            }`}
          >
            {/* <li class="max-lg:border-b max-lg:py-2 px-5">
              <Link
                to="/"
                class="hover:text-[#007bff] text-[15px] text-gray-600 block font-bold"
              >
                Home
              </Link>
            </li>
            <li class="max-lg:border-b max-lg:py-2 px-5">
              <Link
                to="/About"
                class="hover:text-[#007bff] text-gray-600 font-bold text-[15px] block"
              >
                About
              </Link>
            </li> */}

            {/* {admin ? (
              <li class="max-lg:border-b max-lg:py-2 px-5">
                <a
                  href="/admin/analytics"
                  class="hover:text-[#007bff] text-gray-600 font-bold text-[15px] block"
                >
                  {" "}
                  Dashboard
                </a>
              </li>
            ) : null} */}
          </ul>
        </div>
        <Search />
      </header>

      {/* <Search/> */}
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Navbar;
