const express = require("express");
const router = express.Router();

const {
  tenatRegistration,
  tentantUpdating,
  paymentsCreations,
  updateWaterBill,
  getPayments,
  deleteTenant,
  fetchAllAdditinalPaymentsForDashboard,
  getallTeants,
  getContinousPayment,

  ContinousPaymentsCreations,
} = require("../../controllers/Renting/TenantRegistrationController");
const { requireAuth } = require("../../middlleware/requireAuth");

const { hasAdmin, hasAgent } = require("../../middlleware/checkRoles");
const { verifyToken } = require("../../middlleware/token");

router.post("/registerTenant", verifyToken, hasAdmin, tenatRegistration);
router.post("/registerPayment", verifyToken, hasAdmin, paymentsCreations);
router.post("/cont-payment", verifyToken, hasAdmin, ContinousPaymentsCreations);
router.patch("/change/:id", verifyToken, hasAdmin, tentantUpdating);
router.put("/updateWaterBill", verifyToken, hasAdmin, updateWaterBill);
router.get("/fetchPayment/", verifyToken, hasAdmin, getPayments);
router.get("/all-tenants", verifyToken, hasAdmin, getallTeants);
router.get("/all-cont-payments", verifyToken, hasAdmin, getContinousPayment);
router.get(
  "/payments-analytics/",
  verifyToken,
  hasAdmin,
  fetchAllAdditinalPaymentsForDashboard
);
router.delete("/removeTenant/", verifyToken, hasAdmin, deleteTenant);

module.exports = router;
