import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

function FinalReport() {
  const reportData = useLocation().state;

  // total calculation for rent
  const finalRentSum = reportData
    ?.map((data) => data.totalAmount)
    .reduce((prev, next) => prev + next, 0);

  // total calculation for  water_bill
  const finalWaterBillSum = reportData
    ?.map((data) => data.water_bill)
    .reduce((prev, next) => prev + next, 0);

  // total calculation for  balance
  const finalBalanceSum = reportData
    ?.map((data) => data.totalBalance)
    .reduce((prev, next) => prev + next, 0);


  let totalSum = finalRentSum + finalWaterBillSum + finalBalanceSum;
  let totalSumWithCommision = Math.floor((10 / 100) * totalSum);

  let netTotal = totalSum - totalSumWithCommision;

  return (
    <>
      <div className="px-40 mt-20">

      <table className="mb-10">
      <thead className="bg-green-400">
                <tr className="p-20">
                  <th className="text-center text-white">Info</th>
                </tr>
            </thead>
            <tbody className="">
                <tr>
                  <td className="border border-green-200 text-sm px-4 py-2">CLIENT</td>
                  <td className="border border-green-200 text-sm pl-3 pr-20 py-2">HOUSE K-80</td>
                </tr>
                <tr>
                  <td className="border border-green-200 text-sm px-4 py-2">MONTH</td>
                  <td className="border border-green-200 text-sm pl-3 pr-20 py-2">MAY 2024</td>
                </tr>
                <tr>
                  <td className="border border-green-200 text-sm px-4 py-2">AS AT </td>
                  <td className="border border-green-200 text-sm pl-3 pr-20 py-2">29/05/2024</td>
                </tr>
            </tbody>
        </table>


        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-20">
          <div class="px-4 py-5 flex-auto">
          <table className=" w-full">
            <thead className="bg-green-400">
                <tr>
                  <th class="text-left text-sm text-white px-4 lg:py-2 border-2 ">
                    House Number
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2 border-2 ">
                    Tenant Name
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2 border-2 ">
                    Rent
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2 border-2 ">
                    Rent Paid
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                    Period
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                    Payment Date
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                    AMount Paid
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                   Water
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                    Garbage
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                    Prev Balance
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                    Current  Balance
                  </th>
                  <th class="text-left text-sm text-white px-4 lg:py-2  border-2  ">
                   Comment
                  </th>
                </tr>
              </thead>
              {reportData &&
                reportData.map((metaDeta, index) => (
                  <tbody key={index}>
                    <tr className="border-b border-green-200 px-4 py-2">
                      <th
                        scope="row"
                        class="text-gray-700 px-4 py-2"
                      >
                        {metaDeta.houseNumber}
                      </th>
                      <td class="text-gray-700 px-4 py-2">
                        {metaDeta.tenantsName}
                      </td>
                      <td class="text-gray-700 px-4 py-2">
                        ksh {metaDeta.totalAmount}
                      </td>
                      <td class="text-gray-700 px-4 py-2">
                        Ksh {metaDeta.water_bill}
                      </td>
                      <td
                        className={`
                ${metaDeta.totalBalance < 0 ? "text-red-600" : "text-green-600"}
                px-6 py-4`}
                      >
                        Ksh {metaDeta.totalBalance}
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>            
          </div>
        </div>

    

        <table className=" w-full border border-green-200 text-sm text-left rtl:text-right  text-black dark:text-gray-400 ">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    
                  </th>
                  <th scope="col" className="px-6 py-3">
        
                  </th>
                  <th scope="col" className="px-6 py-3">
               
                  </th>
                </tr>
              </thead>
           
                  <tbody>
                    <tr className=" ">
                    <td class="py-1 border-b  border-green-200 text-center text-lg font-semibold ">
                       Total Rent Collected{" "}
                      </td>

                      <td class="py-1 border-b border-l border-green-200 text-lg font-semibold ">
                      </td>

                    <td class="py-1 border-b  border-green-200 text-green-500 text-lg font-semibold  ">
                      {" "} 
                      {finalRentSum}
                    </td>
                    </tr>

                    <tr className=" ">
                    <td class="py-1 border-b  border-green-200 text-center text-lg font-semibold ">
                      Total Water Bill Collected{" "}
                      </td>

                      <td class="py-1 border-b border-l border-green-200 text-lg font-semibold ">
                      </td>

                    <td class="py-1 border-b  border-green-200 text-green-500 text-lg font-semibold  ">
                      {" "} 
                       {finalWaterBillSum}
                    </td>
                    </tr>

                    <tr className=" ">
                    <td class="py-1 border-b  border-green-200 text-center text-lg font-semibold ">
                       Total Balance
                      </td>

                      <td class="py-1 border-b border-l border-green-200 text-lg font-semibold ">
                      </td>

                    <td class={`text-lg font-semibold py-1 border-b border-green-200  ${
                        finalBalanceSum < 0 ? "text-red-600" : "text-green-600"
                      } `}
                    >
                      {" "}
                      {finalBalanceSum}
                    </td>
                    </tr>

               

                    <tr className=" ">
                     <td class="py-1 border-b  border-green-200 text-center text-lg font-semibold ">
                       Total Collection{" "}
                      </td>

                      <td class="py-1 border-b border-l border-green-200 text-lg font-semibold ">
                      </td>

                    <td class="py-1 border-b  border-green-200 text-green-500 text-lg font-semibold  ">
                      {" "} 
                      {totalSum}
                    </td>
                    </tr>


                    <tr className=" ">
                     <td class="py-1 border-b  border-green-200 text-center text-lg font-semibold ">
                       Commission 10%{" "}
                      </td>

                      <td class="py-1 border-b border-l border-green-200 text-lg font-semibold ">
                      </td>

                    <td class="py-1 border-b  border-green-200 text-green-500 text-lg font-semibold  ">
                      {" "} 
                      {totalSumWithCommision}
                    </td>
                    </tr>

                    <tr className=" ">
                    <td class="py-1 border-b  border-green-200 text-center text-lg font-semibold ">
                       Net Total{" "}
                      </td>

                      <td class="py-1 border-b border-l border-green-200 text-lg font-semibold ">
                      </td>

                    <td class="py-1 border-b  border-green-200 text-green-500 text-lg font-semibold  ">
                      {" "} 
                      {netTotal}
                    </td>
                    </tr>
                  </tbody>
            </table>

            <div>
              <p className="text-gray-500 text-sm pt-10 text-center">NB: Above are the tenant payment details for MAY 2024.. The tenants with minor arrears willclear in due course.</p>
          <div className="text-center">
          <p className="text-black text-sm pt-5">1. We are still marketing to ensure full occupancy</p>
              <p className="text-black text-sm">2. Any other clarification is much welcomed. Thanks for your continued support.</p>
          </div>
              <p className="text-green-500 text-sm text-center pt-5">Thank you for choosing Freytoni Property Agencies. May God bless you!</p>
            </div>
      </div>
    </>
  );
}

export default FinalReport;
