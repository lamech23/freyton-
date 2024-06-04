import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";

function NewsLetter() {
  const [NewsLetter, setNewsLetter] = useState([]);
  const [date, setDate] = useState(new Date());
  

  useEffect(() => {
    getNewssletter();
  }, []);

  const getNewssletter = async () => {
    const response = await axios.get("http://localHost:4000/news/newsLetter");
    setNewsLetter(response.data);
  };

  const handelDelete = async (id) => {
    await axios.delete(`http://localhost:4000/news/deleteNewsLetter/${id} `);
    getNewssletter();
  };
  return (
    <>

        <div className="card w-full p-6 bg-base-100 shadow-xl ">
                    <p>News Latter</p>
            <div className="divider mt-2"></div>
                {/* Team Member list in table format loaded constant */}
            <div className="overflow-x-auto w-full">
                <table className="w-full">
                <thead className="bg-green-400">
                    <tr>
                    <th class="text-left text-sm text-white px-4 py-1">Email</th>
                    <th class="text-left text-sm text-white px-4 py-1">Date</th>
                    <th class="text-left text-sm text-white px-4 py-1">Delete</th>
                    </tr>
                    </thead>
                    <tbody >
                    {NewsLetter.map((news) => (
                       <tr className="border-b border-green-200 px-4 py-2" key={news.id}>
                        <td class="text-left text-gray-500 px-4 py-2">{news.email}</td>
                       <td class="text-left text-gray-500 px-4 py-2">  {moment(news.createdAt).format("YYYY/MM/DD   h:mm:ss")}</td>
                        <td class="text-left text-gray-500 px-4 py-2">  
                        <span
                          onClick={() => handelDelete(news.id)}
                          type="button"
                          className="material-symbols-outlined"
                          style={{ color: "red" }}
                        >
                          delete
                        </span>
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

export default NewsLetter;
