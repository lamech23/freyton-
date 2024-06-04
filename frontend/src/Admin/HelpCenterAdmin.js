import axios from "axios";
import React, { useEffect, useState } from "react";


function HelpCenterAdmin() {
  const [email, setEmail] = useState([]);
  const [getInfo, setGetInfo] = useState([]);

  useEffect(() => {
    getinformation();
  }, []);
  const getinformation = async () => {
    const response = await axios.get("http://localhost:4000/help/helpCenter/");
    setGetInfo(response.data);
  };
  return (
    <>
          
      <div className="card w-full p-6 bg-base-100 shadow-xl ">
                    <p>Help Center</p>
            <div className="divider mt-2"></div>
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="w-full">
                <thead className="bg-green-400">
                    <tr>
                        <th class="text-left text-sm text-white px-4 py-1">Email</th>
                        <th class="text-left text-sm text-white px-4 py-1">Issue</th>
                        <th class="text-left text-sm text-white px-4 py-1">Reply</th>
                    </tr>
                    </thead>
                    <tbody >
                    {getInfo.map((help) => (
                       <tr className="border-b border-green-200 px-4 py-2" key={help.id}>
                        <td class="text-left text-gray-500 px-4 py-2">{help.email}</td>
                       <td class="text-left text-gray-500 px-4 py-2">{help.description}</td>
                        <td class="text-left text-gray-500 px-4 py-2">  
                        <a href="/HelpReply" type="button" className="material-symbols-outlined"style={{ color: "blue" }} >
                          email 
                          </a>
                        </td>
                      </tr>  
                     ))}      
                    </tbody>

                </table>
            </div>
       </div>

    

    </>
  );
}

export default HelpCenterAdmin;
