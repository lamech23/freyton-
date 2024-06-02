import axios from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../utils/Api";
import { ToastContainer,toast } from "react-toastify";

function AllPosts() {
  const [details, setDetails] = useState([]);

  const fetchDetails = async () => {
    const response = await api(`/Details/allHouses/`, "GET", {}, {});
    setDetails(response?.allHousesWithImage?.rows);
  };
  useEffect(() => {
    fetchDetails();
  }, []);

  const handleDeletePost = async (id) => {
    try {
      const response = await api(`/Details/${id}`, "DELETE", {}, {});
      fetchDetails()
      if (!response.success) {
        toast.success("House deleted succesfully ");
      }
    } catch (error) {
      toast.error("Error deleting the house please try again ", );
    }
  };

  return (
    <>
    <div className="card w-full p-6 bg-base-100 shadow-xl ">
    <p>List Of Posts</p>
    <div className="divider mt-2"></div>
    <div className="overflow-x-auto w-full">
       <table className="w-full">
       <thead className="bg-green-400">
            <tr>
              <th class="text-left text-sm text-white px-4 py-1"><span>Image</span> </th>
              <th class="text-left text-sm text-white px-4 py-1">House Name</th>
              <th class="text-left text-sm text-white px-4 py-1"> Landlord</th>
              <th class="text-left text-sm text-white px-4 py-1"> Property Type</th>
              <th class="text-left text-sm text-white px-4 py-1"> Units</th>
              <th class="text-left text-sm text-white px-4 py-1"> Category</th>
              <th class="text-left text-sm text-white px-4 py-1">Delete</th>
            </tr>
          </thead>

          {details?.map((house, index) => (
            <tbody key={index}>
              <tr class="border-b border-green-200 px-4 py-2 ">
                {house?.images?.map(
                  (img, imgIndex) =>
                    imgIndex === 0 && (
                      <td  class="p-4">
                        <img
                          src={img.image}
                          class="w-16 h-16 md:w-32"
                          alt="Image"
                        />
                      </td>
                    )
                )}

                <td class="text-gray-500 px-4 py-2">  {house.houseName}</td>
                <td class="text-gray-500 px-4 py-2">{house.houses.email}</td>
                <td class="text-gray-500 px-4 py-2">{house.type}</td>

                <td class="text-gray-500 px-4 py-2"> {house.units}</td>
                <td class="text-gray-500 px-4 py-2"> {house.category}</td>
                <td  class="text-gray-500 px-6 py-4">
                  <button
                  onClick={()=>handleDeletePost(house.id)}
                    class="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                  </td>
              </tr>
            </tbody>
          ))}
        </table>
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

export default AllPosts;
