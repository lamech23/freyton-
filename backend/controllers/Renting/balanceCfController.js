const tenantRegistration = require("../../models/RentingModels/RegisterTenantModel");
const payments = require("../../models/RentingModels/additionalPaymentsModel");
const continousPayments = require("../../models/RentingModels/continousPaymentModel");
const water = require("../../models/RentingModels/waterModel");
const balanceCf = require("../../models/balanceCF");
const moment = require("moment");
const cron = require("node-cron");
var shell = require("shelljs");

const fetchRecentBalance = async (req, res) => {
  try {
    const allAmount = await balanceCf.findAll({});

    const tenants = await tenantRegistration.findAll({});

    const tenantIds = tenants?.map((tenant) => tenant.id);
    const filteredTenants = allAmount?.filter((item) =>
      tenantIds.includes(item.tenatId)
    );
    // Group the amounts by tenantId and sum them up
    const tenantAmounts = filteredTenants?.reduce((acc, item) => {
      if (!acc[item.tenatId]) {
        acc[item.tenatId] = 0;
      }
      acc[item.tenatId] += item.amount;
      return acc;
    }, {});

    const bcfAmount = Object.entries(tenantAmounts).map(
      ([tenantId, amount]) => ({
        tenantId: parseInt(tenantId),
        amount,
      })
    );

    const contPayment = await continousPayments.findAll({});
    const continuedPayments = contPayment?.filter((amnt) =>
      tenantIds.includes(amnt.tenantId)
    );
    const sortedPayments = continuedPayments?.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Use reduce to keep only the most recent payment for each tenantId
    const recentPayments = sortedPayments?.reduce((acc, amnt) => {
      acc[amnt.tenantId] = amnt;
      // Since sorted by date, the last occurrence will be the most recent
      return acc;
    }, {});

    // Convert the result into an array of objects
    const result = Object.values(recentPayments);

    // uodating currentBalance
    const currentBalance = async (amount, tenant) => {
      await tenantRegistration.update(
        { waterReading: amount - tenant.payableRent },
        { where: { id: tenant.id } }
      );
    };
    const waterRate = await water.findAll({});
    const waterPrice = waterRate.map((rate) => rate.price).slice(-1)[0];

    const addtinalPayment = await payments.findAll({});
    const totalAmount = tenants?.map((tenant) => {
      //continous payment
      const continousTransactions = result
        .filter((item) => item.tenantId === tenant.id)
        .map((item) => Number(item.amount))
        .slice(-1)[0];

      // addtinal payment subtotal
      const additinalAmount = addtinalPayment
        .filter((user) => user.tenantId === tenant.id)
        .map((amnt) => amnt.amount)
        .reduce((acc, curr) => acc + Number(curr), 0);

      const waterUnits =
        Number(tenant.currentReadings) - Number(tenant.prevReadings);
      const waterBillPerTenant = waterUnits * waterPrice;
      const waterBill = waterBillPerTenant <= 0 ? 0 : waterBillPerTenant;

      const firstPayment = continousTransactions;

      let firstPaymentDone = false;
      const secondPayment = additinalAmount;

      const paymentOne = bcfAmount
        .filter((user) => user.tenantId === tenant.id)
        .map((arrear) => {
          const arrears = arrear.amount;
          const firstPay = firstPayment;
          const rent = Number(tenant.payableRent);
          const prevAmount = Number(tenant.previousBalance);
          const bill = waterBill;

          const result = arrears + firstPay - rent - prevAmount - bill;

          const totalResult = result;

          return totalResult;
        })[0];

      firstPaymentDone = true;

      if (firstPaymentDone) {
        const latestPaymentMonth = moment(
          filteredTenants
            .map((item) => item.createdAt)
            .sort((a, b) => moment(b).diff(a))[0]
        ).format("MM");

        const currentMonth = moment().format("MM");
      

        const isNewMonth = currentMonth !== latestPaymentMonth;

        const amount = isNewMonth
          ? paymentOne - Number(tenants.payableRent)
          : paymentOne;

        cron.schedule("* * 5 * *", () => {
          currentBalance(amount, tenant);
        });

        return {
          tenantId: tenant.id,
          amount,
        };
      } else {
        return;
      }
    });

    res.status(200).json({
      status: true,
      totalAmount: totalAmount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  fetchRecentBalance,
};
