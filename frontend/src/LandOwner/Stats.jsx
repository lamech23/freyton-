import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import { api } from "../utils/Api";
import TransactionGraph from "../utils/landOwner/TransactionGraph";
import { isAdmin } from "../utils/Decoded";

function Stats() {
  const [activeUser, setActiveUser] = useState(0);
  const [tenant, setTenant] = useState(0);
  let navigate = useNavigate();
  const [payment, setPayment] = useState([]);

  const admin = isAdmin();




  return (
    <div>
      <div class=" grid grid-flow-row-dense grid-cols-4 gap-2   ">
        <article class="col-span-2 flex items-end justify-between  rounded-lg border  border-gray-100 bg-white p-6">
          <div class="flex items-center gap-4">
            <span class="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>

            <div>
              <p class="text-sm text-gray-500">Increase Revenue</p>

              <p class="text-2xl font-medium text-green-500">
                {" "}
                KSH 100
              </p>
            </div>
          </div>

          <div class="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>

            <span class="text-xs font-medium"> 10000 % </span>
          </div>
        </article>

        <article class="col-span-2 flex  items-end justify-between  rounded-lg border border-gray-100 bg-white p-6">
          <div class="flex items-center gap-4">
            <span class="hidden rounded-full bg-gray-100 p-2 text-gray-600 sm:block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </span>

            <div>
              <p class="text-sm text-gray-500">Revenue </p>

              <p class="text-2xl font-medium text-rose-600">ksh 200</p>
            </div>
          </div>

          <div class="inline-flex gap-2 rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            <span class="text-xs font-medium"> 67.81% </span>
          </div>
        </article>
      </div>

      <div className="container-fluid px-4 mt-5">
        <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
          <div className="stats shadow">
            <div className="stat">
              <div className="flex justify-between  dark:text-slate-700">
              <div className="stat-title dark:text-slate-300">Occupied</div>
                 <HomeIcon className="w-8 h-8" />
              </div>
              <div className="stat-value dark:text-slate-300">{activeUser}</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="flex justify-between  dark:text-slate-700">
              <div className="stat-title dark:text-slate-300">Vacant</div>
                 <HomeIcon className="w-8 h-8" />
              </div>
              <div className="stat-value dark:text-slate-300">{activeUser}</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="flex justify-between  dark:text-slate-700">
              <div className="stat-title dark:text-slate-300">Tenants</div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
              </div>
              <div className="stat-value dark:text-slate-300">{tenant}</div>
            </div>
          </div>
        </div>

        <div className="">
          {/* PieGraph Component */}
          <div className="col-span-2">
            <div className=" rounded-lg  pt-20">
              <h2 className="text-xl font-bold mb-4">
                Monthly Payments Transaction{" "}
              </h2>
              <TransactionGraph payments={payment} />
            </div>
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
    </div>
  );
}

export default Stats;
