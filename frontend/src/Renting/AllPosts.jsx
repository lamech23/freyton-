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
       <table className="table w-full">
          <thead>
            <tr>
              <th><span>Image</span> </th>
              <th>House Name</th>
              <th> Landlord</th>
              <th> Property Type</th>
              <th> Units</th>
              <th> Category</th>
              <th>Delete</th>
            </tr>
          </thead>

          {details?.map((house, index) => (
            <tbody key={index}>
              <tr class=" ">
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

                <td>  {house.houseName}</td>
                <td>{house.houses.email}</td>
                <td>{house.type}</td>

                <td> {house.units}</td>
                <td> {house.category}</td>
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
