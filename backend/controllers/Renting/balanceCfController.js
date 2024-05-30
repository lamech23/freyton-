const { where } = require("sequelize");
const balanceCf = require("../../models/balanceCF");

const fetchRecentBalance = async (req, res) => {
  try {
    const allAmount = await balanceCf.findAll({});

    const recentAmount = allAmount?.map((item) => item.amount).slice(-1)[0];

    console.log(allAmount, "this amunt");

    res.status(200).json({
      status: true,

      allAmount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  fetchRecentBalance,
};
