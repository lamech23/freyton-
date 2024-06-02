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
          <table className="table w-full">
            <thead>
              <tr>
                <th>Houses</th>
                <th>Property Types</th>
                <th>Locations</th>
                <th>Owners</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {house?.map((item, index) =>
                item?.type == "renting" ? (
                  <tr key={index} value={item}>
                    <td> {item.houseName}</td>
                    <td>{item.type}</td>
                    <td>{item.location}</td>
                    <td>{item.houses.email}</td>
                    <td>
                      <Link
          
                        to={`/House/${item.houseName}`}
                      >
                        View
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
