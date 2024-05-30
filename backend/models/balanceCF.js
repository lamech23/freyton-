const { DataTypes } = require("sequelize");
const db = require("../config/Database");

const balanceCf = db.define(
  "balanceCarriedFoward",
  {
    amount: {
      type: DataTypes.BIGINT,
    },
    tenatId: {
      type: DataTypes.INTEGER,
    },
  },

  {
    freezeTablesName: true,
  }
);

db.sync()
  .then(() => {
    console.log("balanceCf table created successfully!");
  })
  .catch((error) => {
    console.log("Unable to create balanceCf table", error);
  });

module.exports = balanceCf;
