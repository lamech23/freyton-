const Tour = require("../models/TourRequestModel.js");

const CreateClientInfo = async (req, res) => {
  // const {first_name,second_name,phoneNumber,id_number,postal_address,gender}=req.body
  const clientInfo = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    reason: req.body.reason,
    gender: req.body.gender,
    selectedDate: req.body.selectedDate
  };

  try {
    const client = await Tour.create(clientInfo);

    res.status(200).send(client);
  } catch (error) {
    console.log(error)
    res.status(400).json({
       mssg: error.message ,
       error: "failed to create "
      });
  }
};

const gettingClientInfo = async (req, res) => {
  const tour_id = req.query.tour_id;
  try {
    const client = await Tour.findOne({
      where: {
        tour_id: tour_id,
      },
    });

    res.status(200).json({ client });
  } catch (error) {
    return res.status(400)
  }
};

module.exports = {
  CreateClientInfo,
  gettingClientInfo,
};
