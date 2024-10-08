const tenantRegistration = require("../../models/RentingModels/RegisterTenantModel");

const users = require("../../models/UserModels");
const waterStore = require("../../models/RentingModels/waterBackupModel");
const payments = require("../../models/RentingModels/additionalPaymentsModel");
const { lease } = require("./tenantIncoince");
const balanceCf = require("../../models/balanceCF");
const { where } = require("sequelize");
const water = require("../../models/RentingModels/waterModel");
const continousPayments = require("../../models/RentingModels/continousPaymentModel");

const tenatRegistration = async (req, res) => {
  const {
    tenantsName,
    houseNumber,
    rent,
    email,
    rentDeposit,
    waterReading,
    waterDeposite,
    userName,
    phoneNumber,
    previousBalance,
    houseName,
    nextOfKingNumber,
    prevReadings,
    payableRent,
    rentPaymentDate,
  } = req.body;

  try {
    const findUser = await users.findOne({ where: { email: email } });
    if (!findUser) return res.status(401).json({ msg: "Invalid User" });

    // Checking if the user is already registered as a tenant
    let checkUser = await tenantRegistration.findOne({
      where: { userId: findUser.id },
    });

    if (checkUser) {
      return res
        .status(409)
        .send({ error: `${checkUser.email} is already a Tenant!` });
    } else {
      // Create a new tenant registration entry
      const newTenantData = {
        userId: findUser.id,
        tenantsName,
        houseNumber,
        rent,
        email,
        rentDeposit,
        waterReading,
        waterDeposite,
        userName,
        houseName,
        rentPaymentDate,
        previousBalance,
        phoneNumber,
        nextOfKingNumber,
        prevReadings,
        payableRent,
        houseId: req.body.houseId,
      };

      const createdTenant = await tenantRegistration.create(newTenantData);
      res.status(200).json(createdTenant);
      await lease(newTenantData);

      balanceCf.create({
        amount: 0,
        tenatId: createdTenant.id,
      });
    }
  } catch (error) {
    console.error(error.message);
    // res.status(400).json({ error: error.message });
  }
};

const tentantUpdating = async (req, res) => {
  const { id } = req.params;

  const token = req.user;
  const user_id = token?.id;

  const tenantDetails = {
    tenantsName: req.body.tenantsName,
    rent: req.body.rent,
    email: req.body.email,
    waterReading: req.body.waterReading,
    userName: req.body.userName,
    previousBalance: req.body.previousBalance,
    phoneNumber: req.body.phoneNumber,
    nextOfKingNumber: req.body.nextOfKingNumber,
    prevReadings: req.body.prevReadings,
    currentReadings: req.body.currentReadings,
  };

  try {
    const updatedTenant = await tenantRegistration.update(tenantDetails, {
      where: { id: id },
    });

    const waterBackupDetails = {
      currentReadings: req.body.currentReadings,
      user_id: user_id,
      tenant_id: req.body.tenant_id,
      house_id: req.body.house_id,
    };

    const waterBackup = await waterStore.create(waterBackupDetails);

    res.status(200).json({
      success: true,
      createPayments: updatedTenant,
      waterBackup: waterBackup,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const paymentsCreations = async (req, res) => {
  const { updatedPayment } = req.body;

  try {
    const updatedPaymentArray = Object.values(updatedPayment);
    // const tenant = await tenantRegistration.findAll({
    //   where: {
    //     houseId: 2,
    //   },
    // });

    // Iterate over user IDs and create payments for each user
    for (const tenantUpdate of updatedPaymentArray) {
      const { id, amount, paymentType, dateTime } = tenantUpdate;

      // Create a payment for the current user
      const paymentData = await payments.create({
        amount: amount,
        paymentType: paymentType,
        dateTime: dateTime,
        tenantId: id,
      });

      await balanceCf.create({
        where: {
          tenatId: id,
        },
        amount: amount,
        tenatId: id,
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const ContinousPaymentsCreations = async (req, res) => {
  const { updatedPayment } = req.body;

  try {
    const updatedPaymentArray = Object.values(updatedPayment);

  
    // Iterate over user IDs and create payments for each user
    for (const tenantUpdate of updatedPaymentArray) {
      const { id, amount, paymentType, dateTime } = tenantUpdate;

      // Create a payment for the current user
      await continousPayments.create({
        tenantId: id,
        amount: amount,
        paymentType: paymentType,
        dateTime: dateTime,
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
const getPayments = async (req, res) => {
  try {
    // Find payment data for the specified user
    const tenant = await tenantRegistration.findAll({});
    const tenantsId = tenant.map((data) => data.id);

    const paymentData = await payments.findAll({
      where: { tenantId: tenantsId },
    });

    const totalAdditionalPayments = await Promise.all(
      tenantsId.map(async (id) => {
        const paymentData = await payments.findAll({
          where: { tenantId: id },
        });

        const totalAmount = paymentData.reduce((acc, detail) => {
          return acc + Number(detail.amount);
        }, 0);

        return {
          ...paymentData,
          totalAmount,
        };
      })
    );

    // console.log(totalAdditionalPayments);
    if (paymentData) {
      res.status(200).json({
        success: true,
        totalAdditionalPayments,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Payment data not found for the user",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const fetchAllAdditinalPaymentsForDashboard = async (req, res) => {
  try {
    const paymentData = await payments.findAll();

    const totalAmount = paymentData.reduce((acc, detail) => {
      return acc + Number(detail.amount);
    }, 0);

    const mergedData = {
      paymentData: paymentData,
      totalAmount: totalAmount,
    };

    if (mergedData) {
      return res.status(200).json({
        mergedData,
        success: true,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Payment data not found for the user",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const updateWaterBill = async (req, res) => {
  const { updatedTenants } = req.body;

  try {
    for (const tenant of updatedTenants) {
      const { id, currentReadings, entryDate } = tenant;

      // Find the tenant in the tenantRegistration table
      const tenantRecord = await tenantRegistration.findByPk(id);

      if (!tenantRecord) {
        return res
          .status(404)
          .json({ error: `Tenant with ID ${id} not found` });
      }

      // Update the waterStore entry
      let waterStoreEntry = await waterStore.findOne({
        where: { tenant_id: id },
      });

      if (!waterStoreEntry) {
        // If the entry doesn't exist, create a new one
        waterStoreEntry = await waterStore.create({
          currentReadings,
          tenant_id: id,
          house_id: req.body.house_id,
        });
      } else {
        // If the entry exists, update it
        await waterStore.update(
          { currentReadings },
          { where: { tenant_id: id } }
        );
      }

      // Update the fields in the tenantRegistration table
      if (currentReadings !== undefined) {
        tenantRecord.currentReadings = currentReadings;
      }
      if (entryDate !== undefined) {
        tenantRecord.entryDate = entryDate;
      }

      // Save the changes in the tenantRegistration table
      await tenantRecord.save();
    }

    res.json({ message: "Tenants updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getallTeants = async (req, res) => {
  try {
    const alltenants = await tenantRegistration.findAll();
    if (alltenants) {
      res.status(200).json({
        alltenants,
        success: true,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: "no tenats avialable " + error,
    });
  }
};

const getContinousPayment = async (req, res) => {
  const tenant = await tenantRegistration.findAll({});
  const tenantsId = tenant.map((data) => data.id);

  const payment = await continousPayments.findAll({
    where: {
      tenantId: tenantsId,
    },
  });

  const contPayment = payment
    .map((item) => Number(item.amount))
    .reduce((prev, next) => prev + next, 0);

  if (payment && contPayment) {
    const mergedPayment = {
      payment,
      contPayment,
    };

    res.status(200).json({
      success: true,
      payment,
    });
  } else {
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteTenant = async (req, res) => {
  try {
    const id = req.query.id;

    await tenantRegistration.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      message: "tenant deleted  successfully ",
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to Delete Tenant" + error,
    });
  }
};

module.exports = {
  tenatRegistration,
  tentantUpdating,
  paymentsCreations,
  updateWaterBill,
  getPayments,
  deleteTenant,
  fetchAllAdditinalPaymentsForDashboard,
  getallTeants,
  ContinousPaymentsCreations,
  getContinousPayment,
};
