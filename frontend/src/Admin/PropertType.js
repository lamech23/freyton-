import axios from "axios";
import React, { useEffect, useState } from "react";
import { api } from "../utils/Api";

function PropertType() {
  const [type, setType] = useState([]);
  const [category, setCategory] = useState([]);

  const handleSbubmit = async (e) => {
    e.preventDefault();

    const response = await api("/type/","POST", {}, {
      type: type,
    });
    if (response) {
      setType("");
      fetchPropertyType()
    }
  };

  const fetchPropertyType = async () => {

    const response = await api("/type/fetch","GET", {},{});
    setCategory(response.allPropertyType);
  };

  console.log(category);
  useEffect(() => {
    fetchPropertyType();
  }, []);

  return (
    <>
      <form onSubmit={handleSbubmit}>
        <div class="flex flex-wrap items-stretch mb-4 relative w-full lg:w-4/12 mt-20">
								<div class="flex">
									<span class="flex items-center leading-normal bg-grey-lighter border-1 rounded-r-none border border-r-0 border-blue-300 px-3 whitespace-no-wrap text-grey-dark text-sm w-12 h-10 bg-blue-300 justify-center items-center  text-xl rounded-lg text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                </svg>
                                   </span>
								</div>
						<input  value={type} onChange={(e) => setType(e.target.value)} type="text"
              class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border border-l-0 h-10 border-grey-light rounded-lg rounded-l-none px-3 relative focus:outline-none" placeholder="property type"/>
         </div>

             <div class="mt-5  md:space-x-3 md:block flex flex-col-reverse">
		
									<button class="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-500">Save</button>
							</div>
      </form>




      <div className="card w-full p-6 bg-base-100 shadow-xl mt-20">
                    <p>Property Types</p>
            <div className="divider mt-2"></div>
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="w-full">
                    <thead className="bg-green-400">
                    <tr>
                        <th class="text-left text-sm text-white px-4 py-1">id</th>
                        <th class="text-left text-sm text-white px-4 py-1">Type</th>
                        <th class="text-left text-sm text-white px-4 py-1">Edit</th>
                    </tr>
                    </thead>
                   
            {category &&
              category.map((type) => (
                <tbody className="divide-y divide-gray-200">
                <tr className="border-b border-green-200 px-4 py-2" key={type.id}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {type.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {type.type}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    <button class="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm text-green-500 hover:text-gray-700 focus:relative">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-4 w-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      View
                    </button>
                  </td>
                  </tr>
          </tbody>
              ))}

                </table>
            </div>
       </div>

    </>
  );
}

export default PropertType;
