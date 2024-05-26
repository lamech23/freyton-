import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import User from "../Admin/User";
import AddHouse from "../Admin/AddHouse";
import GetAllDetails from "./GetAllDetails";
import HouseRegistration from "../Renting/HouseRegistration";
import RegisterTenant from "../Renting/RegisterTenant";
import House from "../Renting/House";
import NewsLetter from "./NewsLetter";
import ClientContactUs from "./ClientContactUs";
import HelpCenterAdmin from "./HelpCenterAdmin";
import Stats from "./Stats";
import AllHouses from "../Renting/AllHouses";
import Category from "./Category";
import PropertType from "./PropertType";
import CreateUser from "./CreateUser";

function SideNavigation() {
  // const{user}=useAuthContext()
  const [activeSection, setActiveSection] = useState("stats");

  const handleToggle = () => {
    const button = document.querySelector("#toggle");
    const links = document.querySelectorAll("#link");

    button.style.width = "50px";

    // Iterate through each link and hide it
    links.forEach((link) => {
      link.style.display = "none";
    });
  };

  return (
    <div className=" flex  ">
      {/* <!-- Sidebar --> */}
      <div
        className=" flex flex-col justify-start  bg-green-600 w-60 h-fit gap-10  max-h-screen overflow-y-scroll  "
        id="toggle"
      >
        <div className="sidebar-heading text-center py-4 primary-text fs-4 fw-bold text-uppercase border-bottom mt-4">
          <div
            className="flex flex-col  justify-center gap-3 w-14 bg-grey-400 p-2"
            onClick={handleToggle}
          >
            <div className="border-b-2 border-white w-full"></div>
            <div className="border-b-2 border-white w-full"></div>
            <div className="border-b-2 border-white w-full"></div>
          </div>
          <i className="fas fa-user-secret me-2"></i>Kausi Admin
        </div>

        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            analytics
          </i>
          <button
            type="button"
            className={` py-2 px-14 my-2   text-red-200 
            
          ${
            activeSection === "stats"
              ? "bg-teal-500  justify-center items-center border-r-4"
              : ""
          }
          
          `}
            id="link"
            onClick={() => setActiveSection("stats")}
          >
            Analytic
          </button>
        </div>
        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            person
          </i>
          <button
            type="button"
            className={` py-2 px-4 my-2   w-full text-gray-200
          ${
            activeSection === "User"
              ? "bg-teal-500  justify-center items-center border-r-4"
              : ""
          }
          `}
            id="link"
            onClick={() => setActiveSection("User")}
          >
            Users
          </button>
        </div>

        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            add
          </i>
          <button
            type="button"
            className={` py-2 px-4 my-2   w-full text-gray-200
          ${
            activeSection === "registerUser"
              ? "bg-teal-500  justify-center items-center border-r-4"
              : ""
          }
          `}
            id="link"
            onClick={() => setActiveSection("registerUser")}
          >
            Register User
          </button>
        </div>

        <div className="flex gap-0 ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            add_circle
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
            ${
              activeSection === "AddHouse"
                ? "bg-teal-500  justify-center items-center border-r-4"
                : ""
            }
            `}
            onClick={() => setActiveSection("AddHouse")}
            id="link"
          >
            Add House
          </button>
        </div>

       
        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            person_add
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
             ${
               activeSection === "RegisterTenant"
                 ? "bg-teal-500  justify-center items-center border-r-4"
                 : ""
             }
             `}
            onClick={() => setActiveSection("RegisterTenant")}
            id="link"
          >
            Register Tenant
          </button>
        </div>

        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            category
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
               ${
                 activeSection === "category"
                   ? "bg-teal-500  justify-center items-center border-r-4"
                   : ""
               }
               `}
            onClick={() => setActiveSection("category")}
            id="link"
          >
            category
          </button>
        </div>


        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            category
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
               ${
                 activeSection === "propertyType"
                   ? "bg-teal-500  justify-center items-center border-r-4"
                   : ""
               }
               `}
            onClick={() => setActiveSection("propertyType")}
            id="link"
          >
            propter Type
          </button>
        </div>


        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            list
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
                ${
                  activeSection === "allHouses"
                    ? "bg-teal-500  justify-center items-center border-r-4"
                    : ""
                }
                `}
            onClick={() => setActiveSection("allHouses")}
            id="link"
          >
            AllHouses
          </button>
        </div>

        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            mail
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
        ${
          activeSection === "NewsLetter"
            ? "bg-teal-500  justify-center items-center border-r-4"
            : ""
        }
        `}
            onClick={() => setActiveSection("NewsLetter")}
            id="link"
          >
            NewsLetter
          </button>
        </div>

        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            inbox
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
            ${
              activeSection === "ClientContactUs"
                ? "bg-teal-500  justify-center items-center border-r-4"
                : ""
            }
            `}
            onClick={() => setActiveSection("ClientContactUs")}
            id="link"
          >
            Questions
          </button>
        </div>
        <div className="flex ">
          <i className="material-symbols-outlined text-5xl text-gray-900">
            {" "}
            question_mark
          </i>
          <button
            className={` py-2 px-4 my-2   w-full text-gray-200
              ${
                activeSection === "HelpCenterAdmin"
                  ? "bg-teal-500  justify-center items-center border-r-4"
                  : ""
              }
              `}
            onClick={() => setActiveSection("HelpCenterAdmin")}
            id="link"
          >
            Issues
          </button>
        </div>

      </div>

      <div className="p-5 w-full h-fit overflow-y-scroll hide-scrollbar ">
        <div className="p-5 w-full">
          <div className=" bg-gray-100 p-4  rounded-lg max-w-full">
            {activeSection === "stats" && <Stats />}
            {activeSection === "User" && <User />}
            {activeSection === "AddHouse" && <AddHouse />}
            {activeSection === "GetAllDetails" && <GetAllDetails />}
            {activeSection === "RegisterTenant" && <RegisterTenant />}
            {activeSection === "NewsLetter" && <NewsLetter />}
            {activeSection === "ClientContactUs" && <ClientContactUs />}
            {activeSection === "HelpCenterAdmin" && <HelpCenterAdmin />}
            {activeSection === "allHouses" && <AllHouses />}
            {activeSection === "category" && <Category />}
            {activeSection === "propertyType" && <PropertType />}
            {activeSection === "registerUser" && <CreateUser />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
