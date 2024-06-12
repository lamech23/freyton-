import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { api } from '../utils/Api';
import { toast, ToastContainer } from "react-toastify";


function WaterBill() {
  const [getWater, setGetWater] = useState([]);
  let houseId = useLocation().pathname.split("/")[3];


  const tenant = useLocation().state; 

  useEffect(() => {
    const getWaterRates = async () => {
      try {
        const res = await api(
          `/water/fetchWater/${houseId}`,
          "GET",
          {},
          {}
        );
        setGetWater(res?.getWater);
      } catch (error) {
        toast.error("water rates not found " || error.massage);
      }
    };
    getWaterRates();
  }, []);


  const waterUnits = getWater
  ?.map((house) => {
    return house.price;
  })
  .slice(-1)[0];
  return (
    <div>

            <div className="flex flex-col mt-20">
      <span className='mb-10 font-bold text-3xl capitalize text-green-500 '> Water report </span>

          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline- align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Tenant Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        House Number
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Water Units
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Rates
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase"
                      >
                        Bill
                      </th>
                     
                    </tr>
                  </thead>
                  {tenant?.map((tenants, index) => (
                    <tbody key={index} className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-600">
                          {tenants.tenantsName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-600">
                          {tenants.houseNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-600">
                          {tenants.totalWaterReadings <= 0
                            ? 0
                            : tenants?.totalWaterReadings}{" "}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-600">
                          {waterUnits}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            tenants?.totalWaterReadings * waterUnits < 0
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {tenants?.totalWaterReadings * waterUnits <= 0
                            ? 0
                            : tenants?.totalWaterReadings * waterUnits}{" "}
                        </td>
                     
                      </tr>
                    </tbody>
                  ))}
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
  )
}

export default WaterBill