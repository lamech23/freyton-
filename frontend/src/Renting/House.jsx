import React, { useEffect, useState, Fragment, useRef } from "react";
// import MainNav from "../Admin/MainNav";
import SideNavigation from "../Admin/SideNavigation";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast, ToastContainer } from "react-toastify";
import { usePDF } from "react-to-pdf";
import RegisterTenant from "./RegisterTenant";
import { Dialog, Transition } from "@headlessui/react";
import { api } from "../utils/Api";
import moment from "moment";
import { DownloadTableExcel } from "react-export-table-to-excel";
import * as XLSX from "xlsx";
import { LogarithmicScale } from "chart.js";

function House() {
  const [tenant, setTenant] = useState([]);
  const [house, setHouse] = useState([]);
  const [agent, setAgent] = useState([]);
  const navigate = useNavigate();

  let houseName = useLocation().pathname.split("/")[2];
  const [price, setPrice] = useState("");
  const [getWater, setGetWater] = useState([]);
  const [getGarbage, setGetGarbage] = useState([]);
  const [display, setDisplay] = useState(false);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });
  const [payments, setPayments] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenRate, setIsOpenRate] = useState(false);
  const [isGarbage, setIsGarbage] = useState(false);
  const [query, setQuery] = useState("");
  const keys = ["tenantsName", "phoneNumber", "houseNumber", "createdAt"];

  const [currentMonth, setCurrentMonth] = useState(moment().format("MMM"));
  const tableRef = useRef(null);

  const [pagination, setPagination] = useState({});
  const [pageNum, setPageNum] = useState(1);
  const [contPayment, setContPayment] = useState([]);

  const [bcf, setBcf] = useState([]);
  // Function to handle starting a new month
  const startNewMonth = (direction) => {
    const currentMoment = moment(currentMonth, "MMM");

    let nextMonth;

    if (direction === "next") {
      nextMonth = currentMoment.add(1, "months").format("MMM");
    } else if (direction === "previous") {
      nextMonth = currentMoment.subtract(1, "months").format("MMM");
    }

    setCurrentMonth(nextMonth);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModalRate() {
    setIsOpenRate(false);
  }

  function openModalRate() {
    setIsOpenRate(true);
  }

  function openGarbage() {
    setIsGarbage(true);
  }
  function closeGarbage() {
    setIsGarbage(false);
  }
  // water bill total
  const waterUnits = getWater
    ?.map((house) => {
      return house.price;
    })
    .slice(-1)[0];

  // let houseIdArray = house?.map((house) => house.id);
  let houseIdArray = house?.map((house) => house.id);

  let houseId = houseIdArray ? houseIdArray[0] : null;

  const visitedHouseId = house?.find(
    (house) => house?.houseName === houseName
  )?.id;

  const getHouse = async () => {
    const response = await api(
      `/Details/housesLinkedToTenants/`,
      "GET",
      {},
      {}
    );
    setHouse(response.details);
  };

  const getAgent = async () => {
    const response = await api(`/Details/relevant-agent/`, "GET", {}, {});
    setAgent(response?.relevantAgent);
  };

  const assignedAgent = agent?.find((house) => house.houseId == visitedHouseId);

  useEffect(() => {
    const getTenantinfo = async () => {
      try {
        const response = await api(
          `/houseRegister/${visitedHouseId}`,
          "GET",
          {},
          {}
        );
        setPagination(response?.pagination);
      } catch (error) {
        console.log(error);
      }
    };
    getTenantinfo();
    getHouse();
    getAgent();
  }, [houseName, houseId]);

  const handleNext = async () => {
    const nextPage = pagination.currentPage + 1;
    setPageNum(nextPage);

    try {
      // Fetch data for the next page
      const response = await api(
        `/houseRegister/${visitedHouseId}/?page=${nextPage}`,
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
        `/houseRegister/${visitedHouseId}/?page=${prevPage}`,
        "GET",
        {},
        {}
      );
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // guard clause
  if (isNaN(price) || price < 0) {
    toast.error("Number must be a positive value");
    // return;
  }

  // creating water reading
  const createWater = async (e) => {
    e.preventDefault();
    const waterDetails = {
      price: price,
      house_id: visitedHouseId,
    };
    try {
      const res = await api("/water/", "POST", {}, waterDetails);
      if (res) {
        setPrice("");
        toast.success("added succesfuly");
        setIsOpen(false);
      }
    } catch (error) {
      toast.error(JSON.stringify(error.message) || "field cannot be empty");
    }
  };

  // creating garbage reading
  const createGarbage = async (e) => {
    e.preventDefault();
    const garbageDetails = {
      price: price,
      house_id: visitedHouseId,
    };
    try {
      const res = await api("/garbage/", "POST", {}, garbageDetails);
      if (res) {
        setPrice("");
        toast.success("added succesfuly");
        setIsOpen(false);
      }
    } catch (error) {
      toast.error(JSON.stringify(error.message) || "field cannot be empty");
    }
  };

  // getting water retes

  useEffect(() => {
    const getWaterRates = async () => {
      try {
        const res = await api(
          `/water/fetchWater/${visitedHouseId}`,
          "GET",
          {},
          {}
        );
        setGetWater(res?.getWater);
      } catch (error) {
        toast.error("water rates not found " || error.massage);
      }
    };
    getWaterRates();

    const getGarbagePrice = async () => {
      try {
        const res = await api(
          `/garbage/fetch-garbage/${visitedHouseId}`,
          "GET",
          {},
          {}
        );
        setGetGarbage(res?.getGarbage);
      } catch (error) {
        toast.error("garbage price not found " || error.massage);
      }
    };
    getGarbagePrice();

    const getPayments = async (id) => {
      try {
        const response = await api(
          `/Tenant/fetchPayment/?userId=${id}`,
          "GET",
          {},
          {}
        );
        setPayments(response?.totalAdditionalPayments);
      } catch (error) {}
    };
    if (visitedHouseId) {
      getPayments(visitedHouseId);
    }
  }, [visitedHouseId]);

  //getting continous payment

  const handleFetchPayments = async (id) => {
    try {
      const response = await api(
        `/Tenant/all-cont-payments/?userId=${id}`,
        "GET",
        {},
        {}
      );
      setContPayment(response?.payment);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAmount = contPayment?.map((item) => item.amount == "");

  // getting balance carried foward

  useEffect(() => {
    const getBcf = async () => {
      try {
        const res = await api(`/balance-cf/bcf/`, "GET", {}, {});
        setBcf(res?.totalAmount);
      } catch (error) {
        console.log(error);
      }
    };
    console.log(bcf);

    getBcf();
    handleFetchPayments();
  }, []);

  const filteredProducts = pagination?.currentPosts?.filter((item) => {
    const matchesQuery = keys.some((key) => {
      const value = item[key];
      const formatedDate = moment(value).format("MMM").toLowerCase();

      return (
        (value &&
          typeof value === "string" &&
          value.toLowerCase().includes(query)) ||
        formatedDate.includes(query)
      );
    });

    return matchesQuery;
  });

  // console.log(query);
  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const finalReport = filteredProducts?.map((tenants) => {
    // Initialize total amount for the current tenant
    let totalAmountForTenant = 0;

    let totalAmountsObj = {};

    payments &&
      Object.values(payments).map((paymentData, index) => {
        const matchingObjects = Object.values(paymentData)?.filter(
          (obj) => obj.userId === tenants.id
        );

        if (matchingObjects.length > 0) {
          totalAmountForTenant = matchingObjects.reduce(
            (sum, obj) => sum + Number(obj.amount),
            0
          );

          // Map amount values frommonth
          const amountValues = matchingObjects.map(
            (matchObj) => matchObj.amount
          );

          return amountValues;
        }

        totalAmountsObj[tenants.id] = 0;
      });

    if (!totalAmountForTenant) {
      totalAmountForTenant = Number(tenants.rent);
    } else {
      totalAmountForTenant += Number(tenants.rent);
    }
    const totalBalance =
      Number(tenants.balance) + totalAmountForTenant - tenants.rent;
    let water_bill =
      tenants?.totalWaterReadings * waterUnits <= 0
        ? 0
        : tenants?.totalWaterReadings * waterUnits;
    return {
      ...tenants,
      totalAmount: totalAmountForTenant,
      totalBalance: totalBalance,
      water_bill: water_bill,
    };
  });

  useEffect(() => {}, [finalReport]);
  //tenanant deleting
  const handleDeleteTenant = async (id) => {
    const isConfirmed = window.confirm(
      +"Are you sure you want to delete this tenant?"
    );
    if (isConfirmed) {
      await api(`/Tenant/removeTenant/?id=${id}`, "DELETE", {}, {});
      // getTenantinfo();
    } else {
      alert("Action Cancelled");
    }
  };

  const handleDownload = () => {
    // flatten object like this {id: 1, title:'', category: ''};
    const rows = pagination?.currentPosts?.map((house) => ({
      id: house.id,
      tenantsName: house.tenantsName,
      houseNumber: house.houseNumber,
    }));

    // create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.book_append_sheet(workbook, worksheet, "house");

    // customize header names
    XLSX.utils.sheet_add_aoa(worksheet, [
      ["house ID", " TenantsName", " houseNumber"],
    ]);

    XLSX.writeFile(workbook, "ReportFor2023.xlsx", { compression: true });
  };

  // navigating a user to additinal payment

  const handleUser = (id) => {
    navigate(`/addtionalPayments/${visitedHouseId}`, { state: id });
  };

  return (
    <>
      <article class=" bg-white p-4  sm:p-6 lg:p-8 mt-4  ">
        <div class="flex items-start sm:gap-8 ">
          <div className="border p-10 rounded-lg shadow-md shadow-green-200 ">
            <div className="flex flex-row gap-10 flex-wrap ">
              <div
                class=" sm:grid sm:size-20 sm:shrink-0 sm:place-content-center sm:rounded-full sm:border-2 sm:border-green-500 "
                aria-hidden="true"
              >
                <div class="flex items-center gap-1">
                  <span class="h-8 w-0.5 rounded-full bg-green-500"></span>
                  <span class="h-6 w-0.5 rounded-full bg-green-500"></span>
                  <span class="h-4 w-0.5 rounded-full bg-green-500"></span>
                  <span class="h-6 w-0.5 rounded-full bg-green-500"></span>
                  <span class="h-8 w-0.5 rounded-full bg-green-500"></span>
                </div>
              </div>
              <div>
                <strong class="rounded border border-green-500 bg-green-500 px-3 py-1.5 text-[10px] font-medium text-white">
                  Landlord / Owner
                </strong>

                <h3 class="mt-4 text-lg font-medium sm:text-xl">
                  <span class="hover:underline">
                    {house && house.length > 0 && house[0].houses.email}
                  </span>
                </h3>
              </div>

              <div>
                <strong class="rounded border border-green-500 bg-green-500 px-3 py-1.5 text-[10px] font-medium text-white">
                  Landlord-since
                </strong>

                <h3 class="mt-4 text-lg font-medium sm:text-xl">
                  <span class="hover:underline">
                    {moment(
                      house && house.length > 0 && house[0].houses.createdAt
                    ).format("MMM Do YY")}
                  </span>
                </h3>
              </div>

              <div>
                <strong class="rounded border border-green-500 bg-green-500 px-3 py-1.5 text-[10px] font-medium text-white">
                  House Agent
                </strong>

                <h3 class="mt-4 text-lg font-medium sm:text-xl">
                  <span class="hover:underline">
                    {assignedAgent?.agent?.email}
                  </span>
                </h3>
              </div>
            </div>

            <div class="mt-4 sm:flex sm:items-center sm:gap-2">
              <div class="flex items-center gap-1 text-gray-500">
                <svg
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>

                <p class="text-xs font-medium">
                  {moment(
                    house && house.length > 0 && house[0].houses.createdAt,
                    "YYYYMMDD"
                  ).fromNow()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <header className=" mt-10 mb-20">
        <div className="px-10 flex justify-center  gap-4  items-center justify- md:justify-between">
          <div className="sm:flex  sm:gap-4 space-y-5 lg:space-y-0">
            <button
              type="button"
              onClick={openModal}
              className=" w-full    text-center   no-underline rounded-md bg-gradient-to-r from-green-400 via-green-500 to-green-600  text-lg font-serif  font-bold text-white transition hover:bg-teal-700 capitalize"
            >
              Add Tenant
            </button>

            <button
              type="button"
              onClick={openModalRate}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
            >
              Add Water Rate
            </button>
            <button
              type="button"
              onClick={openGarbage}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
            >
              Garbage
            </button>

            <Link
              to={`/payments/${visitedHouseId}`}
              state={getWater}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
              href="/"
            >
              bill water
            </Link>

            <Link
              to={`/continuous-payment/${visitedHouseId}`}
              state={contPayment}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
            >
              Continous Payment
            </Link>

            <Link
              to={`/addtionalPayments/${visitedHouseId}`}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
              href="/"
            >
              additinal payments
            </Link>
            <Link
              to={`/final-report`}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
              state={finalReport}
            >
              Generate House Report
            </Link>

            <Link
              to={`/addtionalPayments/${houseId}`}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
              href="/"
            >
              Water Report
            </Link>

            <button
              onClick={() => toPDF()}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
            >
              Download
            </button>
            <Link
              to="/report"
              state={houseName}
              className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize"
            >
              report
            </Link>

            <div>
              <DownloadTableExcel
                filename="users table"
                sheet="users"
                currentTableRef={tableRef.current}
              >
                <button className="block w-full text-center   no-underline bg-gradient-to-r from-green-400 via-green-500 to-green-600  rounded-md bg-teal-600 px-5 py-2.5 text-lg  font-bold font-serif  text-white transition hover:bg-teal-700 capitalize">
                  Export excel{" "}
                </button>
              </DownloadTableExcel>
            </div>
          </div>
        </div>
      </header>
      <div className="card w-full p-6 bg-base-100  ">
        <div className="flex flex-row justify-between items-center ">
          <p className="text-3xl font-bold text-teal-600">Tenants</p>

          <div className="flex flex-row gap-4">
            <input
              type="text"
              className="border p-4  rounded-lg "
              value={query}
              placeholder="Search.."
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              onClick={() => startNewMonth("previous")}
              class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Previous Month
            </button>
            <button
              onClick={() => startNewMonth("next")}
              class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-bold rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Start Month
            </button>
          </div>
        </div>

        <div className="divider mt-2"></div>
        {/* Team Member list in table format loaded constant */}
        <div class="mt-24 mx-10 sm:w-3/4 sm:overflow-scroll sm:mx-5 md:mx-10 lg:mx-auto lg:w-full xl:w-full">
          <table
            // ref={targetRef}
            ref={tableRef}
            class="font-inter w-full table-auto border-separate border-spacing-y-1 overflow-scroll text-left md:overflow-auto"
          >
            <thead class="w-full rounded-lg bg-green-400  text-base font-semibold text-gray-800">
              {" "}
              <tr>
                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  House Number
                </th>
                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  Tenant Name{" "}
                </th>
                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  payable Rent
                </th>
                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  {" "}
                  Paid Rent
                </th>
                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white  text-center">
                  Payments
                </th>
                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  Rent Deposit
                </th>

                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  Water Bill
                </th>

                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  Garbage
                </th>

                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  balance
                </th>

                <th className="  uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  Phone Number
                </th>

                <th className=" text-center    uppercase   whitespace-nowrap px-2.5 py-3 text-lg font-normal text-white ">
                  {" "}
                  Actions
                </th>
              </tr>
            </thead>

            {filteredProducts?.map((tenants, index) =>
              contPayment &&
              // contPayment?.find((amnt) => amnt.tenantId === tenants.id) ? (
                <tbody onClick={() => handleUser(tenants.id)}>
                  <tr
                    key={index}
                    class="cursor-pointer bg-[#f6f8fa] drop-shadow-[0_0_10px_rgba(34,46,58,0.02)] hover:shadow-2xl"
                  >
                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {tenants.houseNumber}
                    </td>
                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {tenants.tenantsName}
                    </td>
                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {tenants.payableRent}
                    </td>
                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {moment(tenants.createdAt).format("MMM") !== currentMonth
                        ? 0
                        : tenants.rent}
                    </td>
                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {payments &&
                        Object.values(payments).map((paymentData, index) => {
                          const matchingObjects = Object.values(
                            paymentData
                          ).filter((obj) => obj.tenantId === tenants.id);

                          const paymentsForCurrentMonth =
                            matchingObjects.filter((payment) => {
                              const isCurrentMonth =
                                moment(payment.dateTime).format("MMM") ===
                                currentMonth;

                              return isCurrentMonth;
                            });

                          if (paymentsForCurrentMonth.length > 0) {
                            const totalAmount = paymentsForCurrentMonth.reduce(
                              (sum, obj) => sum + Number(obj.amount),
                              0
                            );

                            return (
                              <React.Fragment key={index}>
                                {paymentsForCurrentMonth.map(
                                  (matchingObject, innerIndex) => (
                                    <tr
                                      key={`${index}-${innerIndex}`}
                                      className="flex flex-row justify-center items-center   "
                                    >
                                      <td className="flex flex-row gap-2 text-gray-600 text-sm   p-2">
                                        <p className="whitespace-nowrap rounded-full bg-greeen-100 px-2.5 py-0.5 bg-rose-200 text-sm text-rose-700">
                                          {" "}
                                          {
                                            monthsShort[
                                              new Date(
                                                matchingObject.createdAt
                                              ).getMonth()
                                            ]
                                          }
                                          -{innerIndex + 1}{" "}
                                        </p>
                                        <p className="text-green-400">
                                          {matchingObject.amount}
                                        </p>
                                      </td>
                                      <td className=" text-gray-600 text-sm  ">
                                        {moment(matchingObject.dateTime).format(
                                          "MMM Do YY"
                                        )}
                                      </td>
                                      <td className=" text-gray-600 text-sm  ">
                                        {matchingObject.paymentType}
                                      </td>
                                    </tr>
                                  )
                                )}
                                <tr className="flex flex-row justify-around  items-center">
                                  <td className="    text-green-600">
                                    New Rent:{" "}
                                    {moment(tenants.createdAt).format("MMM") ===
                                    currentMonth
                                      ? totalAmount + 0
                                      : totalAmount + Number(tenants.payableRent)}
                                  </td>
                                </tr>
                              </React.Fragment>
                            );
                          }

                          return null;
                        })}{" "}
                    </td>
                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {tenants.rentDeposit}
                    </td>

                    <td
                      className={`  ${
                        moment(tenants.createdAt).format("MMM") !== currentMonth
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {moment(tenants.createdAt).format("MMM") === currentMonth
                        ? tenants?.totalWaterReadings < 0
                          ? 0 * Number(waterUnits)
                          : tenants?.totalWaterReadings * Number(waterUnits)
                        : 0}
                    </td>

                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {getGarbage &&
                        getGarbage?.map((house) => house.price).slice(-1)[0]}
                    </td>

                    <td className="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {(() => {
                        const currentMonthPayments = bcf
                          .filter((item) => item.tenantId === tenants.id)
                          .map((item) => item.amount);

                        // const latestPaymentMonth = moment(
                        //   bcf
                        //     .filter((item) => item.tenatId === tenants.id)
                        //     .map((item) => item.createdAt)
                        //     .sort((a, b) => moment(b).diff(a))[0]
                        // ).format("MMM");

                        // const tenantCreation =
                        //   moment(tenants.createdAt).format("MMM") ===
                        //   currentMonth;
                        // const isNewMonth = currentMonth !== latestPaymentMonth;

                        // const totalAmount = currentMonthPayments;

                       

                        // const adjustedAmount = isNewMonth
                        //   ? totalAmount - Number(tenants.payableRent)
                        //   : totalAmount;

                        return currentMonthPayments;
                      })()}
                    </td>

                    <td class="rounded-l-lg py-4 pl-3 text-sm font-normal text-[#637381]">
                      {tenants.phoneNumber}
                    </td>

                    <td>
                      <Link
                        to={`/RegisterTenant/?edit=${tenants.id}`}
                        state={pagination?.currentPosts?.find(
                          (meteData) => meteData.id === tenants.id
                        )}
                        class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        {" "}
                        update{" "}
                      </Link>
                      <button
                        onClick={() => handleDeleteTenant(tenants.id)}
                        type="button "
                        class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        Delete
                      </button>{" "}
                      <button
                        onClick={handleDownload}
                        type="button "
                        class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        Excel
                      </button>{" "}
                    </td>
                  </tr>
                </tbody>
              // ) : null
            )}
          </table>
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
      <Transition appear show={isOpenRate} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={createWater}>
                    <div>
                      <label className="  text-gray-600 text-sm   gap-4 mb-4">
                        Water Rates{" "}
                      </label>
                      <input
                        type="text"
                        class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                        placeholder="Enter water rates"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />

                      <div className="mt-4 space-x-3">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          {" "}
                          Add
                        </button>

                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModalRate}
                        >
                          close
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isGarbage} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex  items-center justify-center min-h-full  p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {/* garbage creation  */}

                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form onSubmit={createGarbage}>
                    <div>
                      <label className="  text-gray-600 text-sm   gap-4 mb-4">
                        Gabage Rate{" "}
                      </label>
                      <input
                        type="text"
                        class="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6"
                        placeholder="Enter garbage  rate (ksh/month)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />

                      <div className="mt-4 space-x-3">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          {" "}
                          Add
                        </button>

                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeGarbage}
                        >
                          close
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <RegisterTenant
                    setIsOpen={setIsOpen}
                    closeModal={closeModal}
                    visitedHouseId={visitedHouseId}
                    tenant={pagination}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default House;
