const moment = require("moment");

module.exports = (req, res, next) => {
  if (req.body == null) {
    return { result: false, msg: ["No data has been sent"] };
  }
  let DOB = moment(req.body.DOB, "DD MM YYYY");
  let responseObject = {
    result: true,
    msg: [],
  };
  if (!req.body.email) {
    responseObject.result = false;
    responseObject.msg.push("missing email");
  }
  if (!req.body.hashed_password) {
    responseObject.result = false;
    responseObject.msg.push("missing password");
  }
  if (!req.body.First_Name) {
    responseObject.result = false;
    responseObject.msg.push("missing first name");
  }
  if (!req.body.Last_Name) {
    responseObject.result = false;
    responseObject.msg.push("Module Last_Name invalid");
  }
  if (!req.body.address) {
    responseObject.result = false;
    responseObject.msg.push("missing address");
  }
  if (DOB instanceof String) {
    responseObject.result = false;
    responseObject.msg.push("Date of Birth invalid");
  }

  if (responseObject.result) {
    next();
  } else {
    return res.status(500).json(responseObject);
  }
};
