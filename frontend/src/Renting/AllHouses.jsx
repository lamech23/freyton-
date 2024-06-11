import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/Api";

function AllHouses() {
  const [house, setHouse] = useState([]);

  const getHouse = async () => {
    const response = await api("/Details/fetchHousesByName", "GET", {}, {});
    setHouse(response?.details);
  };
  useEffect(() => {
    getHouse();
  }, []);

  // console.log(house);

  return (
    <>
      <div className="card w-full p-6 bg-base-100 shadow-xl ">
        <p>List Of All Houses</p>
        <div className="divider mt-2"></div>
        {/* Team Member list in table format loaded constant */}
        <div className="overflow-x-auto w-full">
          <table className=" w-full">
            <thead className="bg-green-600 ">
              <tr>
                <th class="text-left text-sm text-white px-4 py-1">Houses</th>
                <th class="text-left text-sm text-white px-4 py-1">Property Types</th>
                <th class="text-left text-sm text-white px-4 py-1">Locations</th>
                <th class="text-left text-sm text-white px-4 py-1">Owners</th>
                <th class="text-left text-sm text-white px-4 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {house?.map((item, index) =>
                item?.type == "renting" ? (
                  <tr className="border-b border-green-200 px-4 py-2"key={index} value={item}>
                    <td class="text-gray-700 px-4 py-2"> {item.houseName}</td>
                    <td class="text-gray-700 px-4 py-2">{item.type}</td>
                    <td class="text-gray-700 px-4 py-2">{item.location}</td>
                    <td class="text-gray-700 px-4 py-2">{item.houses.email}</td>
                    <td class="text-gray-700 px-4 py-2">
                      <Link
                                   
                        to={`/House/${item.houseName}`}
                      >
                       <span  class="text-white bg-green-600 mx-2 focus:outline-none focus:ring dark:focus:ring-green-200  font-medium rounded-lg text-sm px-2 py-1 text-center me-2 mb-2">
                       View
                        </span> 
                      </Link>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AllHouses;
