import React, { useEffect, useId, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Calendar } from "primereact/calendar";

import { api } from "../utils/Api";
import { ToastContainer, toast } from "react-toastify";

function AdditinalPaymants() {
  let houseId = useLocation().pathname.split("/")[2];
  let userId = useLocation().state
  const [dateTime, setDateTime] = useState({});
  const [amount, setAmount] = useState(null);
  const [paymentType, setPaymentType] = useState("");

  const [updatedUsers, setUpdatedUsers] = useState({});

  const [tenant, setTenant] = useState([]);

  useEffect(() => {
    const getTenantinfo = async () => {
      try {
        const response = await api(`/houseRegister/${houseId}`, "GET", {}, {});
        setTenant(response?.detailsWithTotal);
      } catch (error) {
        console.log(error);
      }
    };
    getTenantinfo();
  }, []);

  const creatingPayment = async (e) => {
    e.preventDefault();
    console.log(updatedUsers, "this one ");

    const updatedPayment = Object.entries(updatedUsers).map(([id, values]) => ({
      id,
      amount: values.amount,
      paymentType: values.paymentType,
      dateTime: values.dateTime,
    }));
    const response = await api(
      "/Tenant/registerPayment/",
      "POST",
      {},
      { updatedPayment }
    );

    if (response) {
      toast.success("payment added ");
    }
  };
  return (
    <>
      <div className=" px-20 py-20  w-full p-6 bg-base-100 shadow-xl">
        <p className="text-lg font-serif text-green-500">Additional Payment</p>
        <div className="divider mt-2"></div>
        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full ">
            <thead>
              <tr>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-black">
                  id{" "}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-black">
                  House Number
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-black">
                  Tenant Name{" "}
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-black">
                  payments
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-black">
                  Paid Date
                </th>
                <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-black">
                  PaymentType
                </th>
              </tr>
            </thead>
              {tenant?.map((tenants, index) => (
            <tbody class={` ${
              tenants.id == (userId) ?  ' bg-gradient-to-r from-green-400  via-green-500 to-green-700 ': 'bg-white'
            }` }>
              {" "}
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-black">
                    {tenants.id}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-black">
                    {tenants.houseNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-black">
                    {tenants.tenantsName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-black">
                    <input
                      type="text"
                      className=" border border-gray-400 w-full p-4 rounded-lg "
                      value={amount}
                      onChange={(e) =>
                        setUpdatedUsers({
                          ...updatedUsers,
                          [tenants.id]: {
                            ...updatedUsers[tenants.id],
                            amount: e.target.value, 
                          },
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-black">
                    <input
                      type="date"
                      className=" border border-gray-400 w-full p-4 rounded-lg "
                      onChange={(e) =>
                        setUpdatedUsers({
                          ...updatedUsers,
                          [tenants.id]: {
                            ...updatedUsers[tenants.id],
                            dateTime: e.target.value,
                          },
                        })
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-black">
                    <select
                      id="paymenyType"
                      class="
                        p-6 rounded-lg 
                        "
                      onChange={(e) =>
                        setUpdatedUsers({
                          ...updatedUsers,
                          [tenants.id]: {
                            ...updatedUsers[tenants.id],
                            paymentType: e.target.value,
                          },
                        })
                      }
                    >
                      <option selected>select payment type</option>
                      <option value="mpesa">Mpesa</option>
                      <option value="bank">Bank </option>
                      <option value="cash">Cash</option>
                    </select>
                  </td>
                </tr>
            </tbody>
              ))}
          </table>

          <form onSubmit={creatingPayment}>
            <button
              type="submit"
              className="text-white p-4 mt-10 rounded-lg bg-gradient-to-r  from-green-400 to-green-600 hover:bg-gradient-to-br focous:ring-4 font-medium  "
            >
              {" "}
              Create payments
            </button>
          </form>
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
    </>
  );
}

export default AdditinalPaymants;
