const { DataTypes } = require("sequelize");
const db = require("../../config/Database");
const tenantRegistration = require("./RegisterTenantModel");

const continousPayments = db.define(
  "continouspayments",
  {
    amount: {
      type: DataTypes.STRING,
    },
    paymentType: {
      type: DataTypes.STRING,
    },
    dateTime: {
      type: DataTypes.STRING,
    },
    tenantId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTablesName: true,
    timestamps: true,
  }
);
continousPayments.belongsTo(tenantRegistration, {
  foreignKey: "tenantId",
  as: "contPayment",
});

db.sync()
  .then(() => {
    console.log("continousPayments table created successfully!");
  })
  .catch((error) => {
    console.log("Unable to create continousPayments table", error);
  });

module.exports = continousPayments;
