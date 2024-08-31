import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../utils/Api";
import { toast, ToastContainer } from "react-toastify";

function WaterBill() {
  const [getWater, setGetWater] = useState([]);
  let houseId = useLocation().pathname.split("/")[3];

  const tenant = useLocation().state;
  const getWaterRates = async () => {
    try {
      const res = await api(`/water/fetchWater/${houseId}`, "GET", {}, {});
      setGetWater(res?.getWater);
    } catch (error) {
      toast.error("water rates not found " || error.massage);
    }
  };

  useEffect(() => {
    getWaterRates();
  }, []);
  const houseName = getWater.at(0)?.house?.houseName;
  const waterUnits = getWater
    ?.map((house) => {
      return house.price;
    })
    .slice(-1)[0];
  return (
    <div className=" mx-auto mt-20 px-4">
      <div className="flex flex-row  justify-around shadow-2xl ">
        <h1 className="mb-10 font-bold text-3xl uppercase text-green-500">
          house-Water-Report
        </h1>
        <h1 className="mb-10 font-bold text-3xl uppercase text-green-500">
          House : {houseName}
        </h1>{" "}
        console.log(houseName, "this water ");
      </div>

      <div className="flex flex-col items-center">
        <div className="overflow-x-auto w-full">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tenant Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      House Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Water Units
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rates(KES)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Bill(KES)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tenant?.map((tenants, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {tenants.tenantsName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {tenants.houseNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {tenants.totalWaterReadings <= 0
                          ? 0
                          : tenants?.totalWaterReadings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                        {waterUnits}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          tenants?.totalWaterReadings * waterUnits <= 0
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {tenants?.totalWaterReadings * waterUnits <= 0
                          ? 0
                          : tenants?.totalWaterReadings * waterUnits}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

export default WaterBill;
