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
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-200 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-16 py-3">
                <span class="">Image</span>
              </th>
              <th scope="col" class="px-6 py-3">
                HouseName
              </th>

              <th scope="col" class="px-6 py-3">
                LandLord
              </th>
              <th scope="col" class="px-6 py-3">
                Property Type
              </th>

              <th scope="col" class="px-6 py-3">
                Units
              </th>

              <th scope="col" class="px-6 py-3">
                Category
              </th>
              <th scope="col" class="px-6 py-3">
                Price
              </th>
            </tr>
          </thead>

          {details?.map((house, index) => (
            <tbody key={index}>
              <tr class="bg-white border-b  dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-100">
                {house?.images?.map(
                  (img, imgIndex) =>
                    imgIndex === 0 && (
                      <td class="p-4">
                        <img
                          src={img.image}
                          class="w-16 md:w-32 max-w-full max-h-full"
                          alt="Image"
                        />
                      </td>
                    )
                )}

                <td class="px-6 py-4 font-semibold text-gray-900 ">
                  {house.houseName}
                </td>

                <td class="px-6 py-4 font-semibold text-gray-900 ">
                  {house.houses.email}
                </td>
                <td class="px-6 py-4 font-semibold text-gray-900 ">
                  {house.type}
                </td>

                <td class="px-6 py-4 font-semibold text-gray-900 ">
                  {house.units}
                </td>
                <td class="px-6 py-4 font-semibold text-gray-900 ">
                  {house.category}
                </td>
                <td class="px-6 py-4">
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
