import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Notice() {
  const state = useLocation().state;

  console.log(state);
  const [email] = useState(state);
  const [message, setMessage]=useState("")
  const [noticeType, setNoticeType]=useState("")
  return (
    <>
      <section class="bg-gray-100">
        <div class="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
            {/* <div class="lg:col-span-2 lg:py-12">
        <p class="max-w-xl text-lg">
          At the same time, the fact that we are wholly owned and totally independent from
          manufacturer and other group control gives you confidence that we will only recommend what
          is right for you.
        </p>

        <div class="mt-8">
          <a href="#" class="text-2xl font-bold text-pink-600"> 0151 475 4450 </a>

          <address class="mt-2 not-italic">282 Kevin Brook, Imogeneborough, CA 58517</address>
        </div>
      </div> */}

            <div class="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
              <form action="#" class="space-y-4">
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
                  <div>
                    <label class="sr-only" for="email">
                      Email
                    </label>
                    <input
                      class="w-full rounded-lg border border-gray-200 p-3 text-sm"
                      placeholder="Email address"
                      type="email"
                      value={email}
                      id="email"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-4 sm:grid-cols-1">
                  <div>
                    <label class="sr-only" for="email">
                      type
                    </label>
                    <select
                      class="w-full rounded-lg border border-gray-200 p-3 text-sm"
                      placeholder="Email address"
                      type="email"
                      value={email}
                      id="email"
                    >
                      <option selected  > Select Notice Type  </option>
                      <option value="eviction" > Eviction  </option>
                      <option value="news" > News</option>
                       </select>
                  </div>
                </div>

                <div>
                  <label class="sr-only" for="message">
                    Message
                  </label>

                  <textarea
                    class="w-full rounded-lg border border-gray-200 p-3 text-sm"
                    placeholder="Message"
                    rows="8"
                    id="message"
                    value={message}
                    onChange={(e)=> setMessage(e.target.value)}
                  ></textarea>
                </div>

                <div class="mt-4">
                  <button
                    type="submit"
                    class="inline-block w-full rounded-lg bg-black px-5 py-3 font-medium text-white sm:w-auto"
                  >
                    Send Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Notice;
