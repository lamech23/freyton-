import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Link } from "react-router-dom";

function ClientContactUs() {
  const [contact, setContact] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getContact();
  }, []);
  const getContact = async () => {
    const response = await axios.get(
      "http://localhost:4000/contacts/contactUs/"
    );
    setContact(response.data);
  };
  const handelDelete = async (id) => {
    await axios.delete(`http://localhost:4000/contacts/${id} `);
    getContact();
  };

  return (
    <>
  

        <div className="card w-full p-6 bg-base-100 shadow-xl ">
                    <p>Questions</p>
            <div className="divider mt-2"></div>
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="w-full">
                <thead className="bg-green-400">
                    <tr >
                    <th class="text-left text-sm text-white px-4 py-1">email</th>
                    <th class="text-left text-sm text-white px-4 py-1">subject</th>
                    <th class="text-left text-sm text-white px-4 py-1">Descripton</th>
                    <th class="text-left text-sm text-white px-4 py-1">Posted Date</th>
                    <th class="text-left text-sm text-white px-4 py-1">Delete</th>
                    <th class="text-left text-sm text-white px-4 py-1">mail</th>
                    </tr>
                    </thead>
                    <tbody >
                    {contact.map((information) => (

                       <tr className="border-b border-green-200 px-4 py-2" key={information.id}>
                        <td class="text-left text-gray-500 px-4 py-2">{information.email}</td>
                        <td class="text-left text-gray-500 px-4 py-2">{information.subject}</td>
                        <td class="text-left text-gray-500 px-4 py-2">{information.description}</td>
                        <td class="text-left text-gray-500 px-4 py-2">     
                           <strong>
                           {}{moment(information.createdAt).format(
                             "YYYY/MM/DD   h:mm:ss"
                           )}
                        </strong>
                      </td>
                       <td class="text-left text-gray-500 px-4 py-2">    
                        <span
                          onClick={() => handelDelete(information.id)}
                          type="button"
                          className="material-symbols-outlined"
                          style={{ color: "red" }}
                        >
                        delete
                       </span>
                       </td>
                      < td>  
                        <Link
                        to={"/ClientMessageForm"}
                         state={information.email}
                        type="button"
                        className="material-symbols-outlined"
                        style={{ color: "blue" }}
                    >
                      email
                    </Link>
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

export default ClientContactUs;
