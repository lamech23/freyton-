import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/userPage.css";
import { Link, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import io from "socket.io-client";
import { ServerUrl } from "../utils/ServerUrl";
import { ToastContainer, toast } from "react-toastify";
import { api } from "../utils/Api";
import { isAdmin, isUser } from "../utils/Decoded";

function User() {
  const [socket, setSocket] = useState(null);
  const newSocket = io(ServerUrl);
  const [users, setUsers] = useState([]);
  const [house, setHouse] = useState([]);
  const [agent, setAgent] = useState("");
  const [pagination, setPagination] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const admin = isAdmin();

  const user = isUser()?.userId;
  useEffect(() => {
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // testing purposes  only

  // get the instance  of the two  userId and  houseId
  const handleHouseSelection = (agentId, houseId) => {
    setAgent({
      agentId,
      houseId: Number(houseId),
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:4000/users/assing",
        agent
      );

      if (response) {
        toast.success("assigned  successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHouse = async () => {
    const response = await api("/Details/housesLinkedToTenants", "GET", {}, {});
    setHouse(response.details);
  };

  const fetchUsers = async () => {
    const response = await api("/Users/all", "GET", {}, {});
    setUsers(response.user);
    setPagination(response?.pagination);
  };

  useEffect(() => {
    fetchUsers();
    fetchHouse();

    // if (socket === null) return;

    // socket.emit("allUsers", users);

    // socket.on("getAllUsers", (res) => {
    //   setUsers(res);
    // });

    // fetchUsers();

    // return () => {
    //   // component is being unmounted
    //   socket.off("disconnect");
    // };
  }, []);

  // useEffect(() => {
  //   if (socket === null) return;
  //   // socket.emit("updating", id, state);
  //   socket.on("updatingUser", (res) => {
  //     updateStatus(res);
  //   });
  // }, []);

  const handleNext = async () => {
    const nextPage = pagination.currentPage + 1;
    setPageNum(nextPage);
    try {
      const response = await api(`/Users/all/?page=${nextPage}`, "GET", {}, {});
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleprev = async () => {
    const prevPage = pagination.currentPage - 1;
    setPageNum(prevPage);
    try {
      const response = await api(`/Users/all/?page=${prevPage}`, "GET", {}, {});
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateStatus = async (id, state) => {
    const response = await axios.patch(
      `http://localhost:4000/Users/userStatus/${id}?Active=` + state
    );
  };

  const verifyingUser = async (id, verified) => {
    const response = await axios.patch(
      `http://localhost:4000/Users/verifyUser/${id}?verified=` + verified
    );
  };

  const deactivate = (id) => {
    let state = "inActive";
    updateStatus(id, state);
  };

  const activate = (id) => {
    let state = "active";
    updateStatus(id, state);
  };

  const Verify = (id) => {
    let verified = 1;
    verifyingUser(id, verified);
  };

  const handelDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (isConfirmed) {
      const res = await axios.delete(`http://localhost:4000/Users/${id} `);
      fetchUsers();
    } else {
      alert("Action Cancelled");
    }
  };

  useEffect(() => {
    if (socket === null) return;
    // socket.emit("updating", users?.id)
  }, [socket]);

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl ">
        <p>Manage Users </p>
        <div className="divider mt-2"></div>
        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>id</th>
                <th>Email</th>
                <th>Role</th>
                <th>House Managing </th>
                <th>Approval Status </th>
                <th>Assign House</th>
                <th>Actions</th>
              </tr>
            </thead>
            {pagination &&
              pagination?.currentPosts?.map(
                (allUsers) =>
                  !allUsers?.email.includes(user.email) && (
                    <tbody key={allUsers.id}>
                      <tr>
                        <td>{allUsers.id}</td>

                        <td>{allUsers.email}</td>
                        <td>{allUsers.role}</td>
                        <td>{allUsers?.agent[0]?.house?.houseName}</td>
                        <td
                          style={{ color: allUsers.verified ? "green" : "red" }}
                        >
                          {allUsers.verified ? "Verified" : "Unverified"}
                        </td>

                        <td>
                          {allUsers.role == "agent" ? (
                            <select
                              className="p-2 rounded-md"
                              onChange={(e) =>
                                handleHouseSelection(
                                  allUsers.id,
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select house ...</option>
                              {house &&
                                house
                                  .filter((h) => h.type === "renting")
                                  .map(
                                    (h, index) =>
                                      !allUsers?.agent[0]?.house?.houseName.includes(
                                        h.houseName
                                      ) && (
                                        <option key={index} value={h.id}>
                                          {h.houseName}
                                        </option>
                                      )
                                  )}
                            </select>
                          ) : (
                            <p>N/A</p>
                          )}
                        </td>

                        <td className="flex flex-row justify-center items-start  gap-2">
                          <div>
                            {allUsers.role == "agent" ? (
                              <button
                                onClick={handleSave}
                                type="submit"
                                class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                              >
                                Assign
                              </button>
                            ) : null}
                          </div>
                          <Link
                            to={`/UpdateUser/${allUsers.id}`}
                            type="button"
                            className="material-symbols-outlined text-decoration-none text-green-700"
                          >
                            edit
                          </Link>
                          <span
                            onClick={() => handelDelete(allUsers.id)}
                            type="button"
                            className="material-symbols-outlined cursor-pointer"
                            style={{ color: "red" }}
                          >
                            delete
                          </span>{" "}
                          <span>
                            {allUsers.Active === "active" ? (
                              <button
                                type="button"
                                className={
                                  "whitespace-nowrap rounded-full bg-greeen-100 px-2.5 py-0.5 bg-green-200 text-sm text-green-700"
                                }
                                onClick={() => deactivate(allUsers.id)}
                              >
                                active
                              </button>
                            ) : allUsers.Active === "inActive" ? (
                              <button
                                type="button"
                                onClick={() => activate(allUsers.id)}
                                className="whitespace-nowrap rounded-full bg-red-100 px-2.5 py-0.5 text-sm text-red-700"
                              >
                                inActive
                              </button>
                            ) : null}
                          </span>
                          <button
                            type="button "
                            onClick={() => Verify(allUsers.id)}
                            class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                          >
                            Verify
                          </button>{" "}
                        </td>
                      </tr>
                    </tbody>
                  )
              )}
          </table>
          <div className="flex flex-row justify-center items-center  gap-4 mt-10">
        <button className="border p-2 " onClick={handleprev}>
          prev
        </button>

        <div className="flex flex-row justify-center items-center">
          {pagination?.totalPages?.map((number) => (
            <div key={number} className="">
              <a className="page-link ">
                <p
                  className={`flex flex-row gap-4 border p-2 cursor-pointer ${
                    pageNum == number ? "bg-teal-600" : "bg-white"
                  }
              `}
                >
                  {" "}
                  {number}
                </p>
              </a>
            </div>
          ))}
        </div>

        <button className="border p-2 " onClick={handleNext}>
          next
        </button>
      </div>
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

export default User;
