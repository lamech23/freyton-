import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function SignUpProcess({ email, closeModal }) {
  const [selectedMessage, setSelectedMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const handleSelectMessage = (e) => {
    const selected = e.target.value;
    setSelectedMessage(selected);
    setCustomMessage("");
  };

  const handleCustomMessageChange = (e) => {
    setCustomMessage(e.target.value);
    setSelectedMessage("Other (please specify below).");
  };

  const message =
    selectedMessage === "Other (please specify below)."
      ? customMessage
      : selectedMessage;


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("before request");

    const createRequest = await axios.post("http://localhost:4000/proccess/", {
      email,
      message,
    });
    console.log("after request");

    if (createRequest) {
      toast.success("Request sent please wait ");
      // setMessage("")
      email = null;
      closeModal();
    }
  };

  const PredefinedMessages = [
    "I have a question about signing up.",
    "I would like to request access to the platform.",
    "I am interested in learning more about your services.",
    "I need assistance with my account.",
    "Other (please specify below).",
  ];

  return (
    <>
      <section className="flex justify-center items-center ">
        <div className=" ">
          <h2 className="text-center text-lg  font-medium text-gray-500 mb-8 capitalize">
            Please fill in the form below to send a request account registration
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Your email"
              value={email}
              className="border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <select
              value={selectedMessage}
              onChange={handleSelectMessage}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="" disabled hidden>
                Select a message...
              </option>
              {PredefinedMessages.map((message, index) => (
                <option key={index} value={message}>
                  {message}
                </option>
              ))}
            </select>
            {selectedMessage === "Other (please specify below)." && (
              <textarea
                placeholder="Enter your custom message..."
                rows={3}
                value={customMessage}
                onChange={handleCustomMessageChange}
                className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              ></textarea>
            )}

            <button
              type="submit"
              className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-8 py-3"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
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

export default SignUpProcess;
