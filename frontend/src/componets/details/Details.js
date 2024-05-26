import React, { useEffect, useState } from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./details.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useIsAdmin } from "../../hooks/UseAdmin";
import Pagination from "./Pagination";
import { api } from "../../utils/Api";

const Details = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [posts, setPosts] = useState([]);
  const [user_id, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(4);
  const [details, setDetails] = useState([]);
  const [query, setQuery] = useState("");
  const [pagination, setPagination] = useState({});
  const [pageNum, setPageNum] = useState(1);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("credentials"));
    if (user) setUserId(user.id);
    setTimeout(() => {
      fetchDetails();

      function handleScroll() {
        const images = document.querySelectorAll("#hover");
        images.forEach((image) => {
          const imagePosition = image.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          if (imagePosition - windowHeight <= 0) {
            image.classList.add("visible");
          }
        });
      }
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, 3000);
  }, []);

  // useEffect(() => {
  //   const fetchData = asy?nc () => {
  //     const res = await axios.get(`http://localhost:4000/search?q=${query}`);
  //     setDetails(res.data);
  //   };
  //   if (query.length === 0 || query.length > 2)
  //    fetchData();
  // }, [query]);

  const fetchDetails = async () => {
    const response = await api("/Details/allHouses", "GET", {}, {});

    setDetails(response?.allHousesWithImage);
    setPagination(response?.pagination);
    setIsLoading(false);
  };

  const handleNext = async () => {
    const nextPage = pagination.currentPage + 1;
    setPageNum(nextPage);

    try {
      // Fetch data for the next page
      const response = await api(
        `/Details/allHouses/?page=${nextPage}`,
        "GET",
        {},
        {}
      );
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error as needed
    }
  };

  const handleprev = async () => {
    const prevPage = pagination.currentPage - 1;
    setPageNum(prevPage);

    try {
      const response = await api(
        `/Details/allHouses/?page=${prevPage}`,
        "GET",
        {},
        {}
      );
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-6 pt-10">
        <h3 className="text-center font-bold text-3xl pb-5">Houses</h3>

        {isLoading ? (
          <div className="flex justify-center mx-auto">
            <div className="animate-spin rounded-full h-40 w-40 border-t-2 border-teal-600 border-opacity-50"></div>
          </div>
        ) : (
          pagination?.currentPage && (
            <div className="grid grid-cols-1 p-20 sm:p-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pagination?.currentPosts?.map((detail, index) => (
                <div
                  key={index}
                  className="col-span-1 border rounded-lg shadow-lg overflow-hidden"
                >
                  {detail?.images?.map(
                    (img, imgIndex) =>
                      imgIndex === 0 && (
                        <Link key={imgIndex} to={`/MoreDetails/${detail.id}`}>
                          <img
                            className="w-full h-48 object-cover"
                            src={img.image}
                            alt="Daily Apartment"
                          />
                        </Link>
                      )
                  )}
                  <div className="p-4">
                    <h3 className="text-md font-semibold  text-center">
                      {detail?.title}
                    </h3>
                    <h3 className="text-md">{detail.description}</h3>
                    <p className="text-gray-600 pb-2">
                      {detail?.details?.locaton}
                    </p>
                    <div className="flex flex-wrap justify-around items-center text-gray-600 text-sm mt-2">
                      <div>
                        <span className="text-gray-600 font-bold text-sm">
                          Units :
                        </span>
                        <span className="font-bold">{detail.units}</span>
                      </div>
                      <div>
                        <p>
                          <span className="text-gray-600 font-bold text-sm">
                            {" "}
                            Price :
                          </span>
                          <span className="text-gray-500 text-sm">
                            {" "}
                            Ksh{detail.price}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <div className="flex flex-row justify-center items-center  gap-4">
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

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Details;
