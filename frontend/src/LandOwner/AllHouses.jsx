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
    <div className="grid lg:grid-cols-3 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
      <div className=" rounded-lg bg-gradient-to-r from-gray-300 to-gray-300 shadow-indigo-50 w-full p-6 py-20 bg-base-100 shadow-xl">   
       <p className="text-center text-lg">k-1</p>  
      </div>
      <div className="rounded-lg bg-gradient-to-r from-gray-300 to-gray-300 shadow-indigo-50 w-full p-6 py-20 bg-base-100 shadow-xl ">   
      <p className="text-center text-lg">k-2</p>    
      </div>
      <div className="rounded-lg bg-gradient-to-r from-gray-300 to-gray-300 shadow-indigo-50 w-full p-6 py-20 bg-base-100 shadow-xl ">     
      <p className="text-center text-lg">k-3</p>  
      </div>
      <div className="rounded-lg bg-gradient-to-r from-gray-300 to-gray-300 shadow-indigo-50 w-full p-6 py-20 bg-base-100 shadow-xl "> 
      <p className="text-center text-lg">k-4</p>      
      </div>
    </div>
  );
}

export default AllHouses;
