import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/admin.css";

import { ToastContainer, toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { Calendar } from "primereact/calendar";
import { api } from "../utils/Api";

function RegisterTenant({ visitedHouseId, tenant, closeModal, setIsOpen }) {
  const state = useLocation().state; // am  using one for to create and update
  const id = useLocation().state?.id;
  console.log(tenant?.currentPosts);
  const [tenantsName, setTenantsName] = useState(state?.tenantsName || "");
  const [houseNumber, setHouseNumber] = useState(state?.houseNumber || "");
  const [rent, setRent] = useState(state?.rent || "");
  const [rentDeposit, setRentDeposit] = useState(state?.rentDeposit || "");
  const [waterReading, setWaterReadiing] = useState(state?.waterReading || "");
  const [userName, setUserName] = useState(state?.phoneNumber || "");
  const [phoneNumber, setPhoneNumber] = useState(state?.phoneNumber || "");
  const [waterDeposite, setWaterDeposite] = useState(state?.waterDeposite || "");
  

  const [prevReadings, setPrevReadings] = useState(state?.prevReadings || "");
  const [currentReadings, setCurrentReadings] = useState(
    state?.currentReadings || ""
  );

  const [email, setEmail] = useState(state?.email || "");
  const [nextOfKingNumber, setNextOfKingNumber] = useState(
    state?.nextOfKingNumber || ""
  );
  const [password, setPassword] = useState("");
  const [houseName, setHouseName] = useState(state?.houseName || "");
  const [previousBalance, setPreviousBalance] = useState(
    state?.previousBalance || ""
  );
  const [house, setHouse] = useState([]);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [payableRent, setPaybleRent] = useState(state?.payableRent || "");
  const [rentPaymentDate, setRentPaymentDate] = useState(state?.date || null);
  const [tenantInformation, setTenantInformation]=useState([])


  const tenantInfo = [...users];

  const registeredTenants = tenant?.currentPosts?.map(
    (tenant) => tenant.email
  );

  useEffect(() => {
    const getHouse = async () => {
      const response = await api(
        `/Details/housesLinkedToTenants/`,
        "GET",
        {},
        {}
      );
      setHouse(response.details);
    };
    getHouse();

    const fetchUsers = async () => {
      //getting all  users  with the role tenant for registration  purpose

      const response = await api("/Users/all-user", "GET", {}, {});
      setUsers(response.user);
    };

    fetchUsers();
    getTenantinfo()
  }, []);
  const tenants = tenantInfo.filter((tenant) => tenant.role === "tenant");
  const exittingTenants = tenantInformation?.map((data)=> data.email)
  console.log(exittingTenants);


  const getTenantinfo = async () => {
    try {
      const response = await api(
        `/Tenant/all-tenants`,
        "GET",
        {},
        {}
      );
      setTenantInformation(response?.alltenants);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(tenantInfo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state) {
        const updatedTenant = await api(
          `/Tenant/change/${id}`,
          "PATCH",
          {},
          {
            tenantsName: tenantsName,
            houseNumber: houseNumber,
            rent: rent,
            email: email,
            rentDeposit: rentDeposit,
            password: password,
            waterReading: waterReading,
            userName: userName,
            phoneNumber: phoneNumber,
            nextOfKingNumber: nextOfKingNumber,
            houseName: houseName,
            previousBalance: previousBalance,
            prevReadings: prevReadings,
            currentReadings: currentReadings,
            houseId: visitedHouseId,
            tenant_id: id,
          }
        );
        // navigate(`House/${houseName}`)
        if (updatedTenant) {
          toast.success("Succesfully upadated");
        }
      } else {
      }

      const response = await api(
        "/Tenant/registerTenant",
        "POST",
        {},
        {
          tenantsName: tenantsName,
          houseNumber: houseNumber,
          rent: rent,
          email: email,
          rentDeposit: rentDeposit,
          password: password,
          waterReading: waterReading,
          userName: userName,
          phoneNumber: phoneNumber,
          nextOfKingNumber: nextOfKingNumber,
          houseName: houseName,
          previousBalance: previousBalance,
          prevReadings: prevReadings,
          payableRent: payableRent,
          houseId: visitedHouseId,
          rentPaymentDate: rentPaymentDate,
        }
      );
      if (response) {
        setTenantsName("");
        setHouseName("");
        setRent("");
        setEmail("");
        setRentDeposit("");
        setWaterReadiing("");
        setUserName("");
        setNextOfKingNumber("");
        setHouse("");
        setPreviousBalance("");
        setIsOpen(false);
      }

      toast.success("Succesfully registerd tenant");
    } catch (error) {
      // Handle errors here
      if (error.response?.status === 409) {
        const errorMessage = error.response.data.error;
        toast.error(`${errorMessage}`);
      }
    }
  };

  return (
    <>
      <div className=" lg:mt-40 lg:px-40  ">
        <div className="space-y-12 border  p-10 rounded-lg  shadow-md shadow-indigo-200">
          {state ? (
            <div className="bg-gray-100 p-4 rounded-md shadow-md text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                House Details for:
              </h1>
              <p className="text-lg font-medium text-red-700">{email}</p>
            </div>
          ) : (
            <div className="bg-gray-100 p-4 rounded-md shadow-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Creating  Details for:</h1>
            <p className="text-lg font-medium text-red-700">{email}</p>
          </div>
          
          )}

          <form onSubmit={handleSubmit}>
            <section className=" mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 ">
              <div class="sm:col-span-3">
                <label for="" className="form-label">
                  Email
                </label>
                <select
                  type="text"
                  name="houseName"
                  id=""
                  class="block p-10 w-full rounded-md border-0  py-6   text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                >
                  <option value=""> select email </option>
                  {tenants.map(
                    (client) =>
                      exittingTenants?.includes(client.email) || !registeredTenants?.includes(client.email)  && (
                        <option
                          className="text-red visible"
                          key={client.id}
                          value={client.email}
                        >
                          {client.email}
                        </option>
                      )
                  )}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  {" "}
                  Tenant Name
                </label>
                <input
                  type="text"
                  name="tenantName"
                  id="house_name"
                  class="block w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={tenantsName}
                  onChange={(e) => setTenantsName(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  House No
                </label>
                <input
                  type="text"
                  name="houseNumber"
                  id=""
                  class="block p-10 w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  payable Rent
                </label>
                <input
                  type="number"
                  name="rent"
                  id=""
                  class="block p-10 w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={payableRent}
                  onChange={(e) => setPaybleRent(e.target.value)}
                />
              </div>
              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  Rent
                </label>
                <input
                  type="number"
                  name="rent"
                  id=""
                  class="block p-10 w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                />
              </div>

              {rent.length >= 5 ? (
                <div class="sm:col-span-3 ">
                  <label for="" className="form-label">
                    paid Date
                  </label>
                  <div className="border">
                    <input
                      type="date"
                      value={rentPaymentDate}
                      onChange={(e) => setRentPaymentDate(e.target.value)}
                    />
                  </div>
                </div>
              ) : null}
              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  Rent Deposit
                </label>
                <input
                  type="number"
                  name="rentDeposit"
                  id=""
                  className="block  w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={rentDeposit}
                  onChange={(e) => setRentDeposit(e.target.value)}
                />
              </div>
              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  Water reading
                </label>

                <input
                  type="number"
                  name="waterReading"
                  id=""
                  class="block  w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={waterReading}
                  onChange={(e) => setWaterReadiing(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  Water Deposite
                </label>

                <input
                  type="number"
                  name="waterReading"
                  id=""
                  class="block  w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={waterDeposite}
                  onChange={(e) => setWaterDeposite(e.target.value)}
                />
              </div>

              <div class="sm:col-span-3">
                <label for="" className="form-label">
                  Previous Balance
                </label>
                <input
                  type="number"
                  name="previousBalance"
                  id=""
                  class="block  w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={previousBalance}
                  onChange={(e) => setPreviousBalance(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  User name
                </label>
                <input
                  type="text"
                  name="userName"
                  id=""
                  class="block  w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  id=""
                  className="block  w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  Next Of Kin
                </label>
                <input
                  type="number"
                  name="nextOfKingNumber"
                  id=""
                  className="block  w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={nextOfKingNumber}
                  onChange={(e) => setNextOfKingNumber(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
                <label for="" className="form-label">
                  prev readings
                </label>
                <input
                  type="text"
                  name="prevReading"
                  id=""
                  className="block w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                  placeholder=""
                  value={prevReadings}
                  onChange={(e) => setPrevReadings(e.target.value)}
                />
              </div>
              {state && (
                <div className="sm:col-span-3 space-y-6">
                  <div>
                    <label for="" className="form-label">
                      current Reading
                    </label>
                    <input
                      type="text"
                      name="currentReadings"
                      id=""
                      className="block w-full rounded-md border-0 px-3 py-4  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                      placeholder=""
                      value={currentReadings}
                      onChange={(e) => setCurrentReadings(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {state ? (
                <button
                  className=" text-white bg-gradient-to-r  from-green-400  via-green-500 to-green-600  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  type="submit"
                >
                  update
                </button>
              ) : (
                <button
                  className=" text-white bg-gradient-to-r  from-green-400  via-green-500 to-green-600  hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  type="submit"
                >
                  create
                </button>
              )}
            </section>
          </form>
        </div>
      </div>
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
    </>
  );
}

export default RegisterTenant;
