import React, { useState } from "react";
import emailjs from "emailjs-com";
import "../css/DetailsAdmin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

function ClientMessageForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const  userEmail = useLocation().state
  const [email, setEmail] = useState(userEmail);
  // console.log(state);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const mail = emailjs.sendForm(
        "service_8az8a42",
        "template_vghzarh",
        e.target,
        "AQqt9z0UQsOI_hUez"
      );
      setStatus("success");

      if (mail) {
        setMessage("");
        toast.success("succesfuly sent");
      }
    } catch (err) {}
  };
  return (
    <>
      <div className=" flex flex-col mt-10 justifiy-center items-center w-full">
        <form onSubmit={handleSubmit} className="client card shadow-lg mt-5">
          <input
            className=" border p-2 rounded-lg mt-4"
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            // onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className=" border  mt-5"
            id="textarea"
            placeholder="Message"
            value={message}
            name="message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-danger mt-4">
            submit
          </button>
        </form>
      </div>
    </>
  );
}

export default ClientMessageForm;
