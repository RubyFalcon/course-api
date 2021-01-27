const Router = require("express").Router();
const db = require("../db/coursedb");
const moment = require("moment");
const ValidateUser = require("../middlewares/ValidateUser");
Router.get("/info/:id", (req, res) => {
  if (req.params.id == null) {
    return res.status(500).json({
      result: false,
      msg: ["User not found"],
    });
  }
  db.get(
    {
      fields: ["*"],
      table: "user",
      where: { ID: req.params.id },
      limit: 1,
    },
    (results) => {
      if (results.result) {
        const returnResult = { result: results.result, user: results.data[0] };
        res.status(200).json(returnResult);
      } else {
        res.status(500).json(results);
      }
    }
  );
});

Router.get("/", (req, res) => {
  db.get(
    {
      fields: ["*"],
      table: "user",
    },
    (results) => {
      if (results.result) {
        res.status(200).json(results);
      } else {
        res.status(500).json(results);
      }
    }
  );
});
Router.post("/", ValidateUser, (req, res) => {
  //db get to check if email already exists in the db
  db.create(
    "user",
    {
      email: req.body.email,
      hashed_password: req.body.hashed_password,
      First_Name: req.body.First_Name,
      is_Admin: 0,
      Last_Name: req.body.Last_Name,
      address: req.body.address,
      DOB: moment(req.body.DOB, "DD MM YYYY").format("YYYY-MM-DD"),
    },
    (results) => {
      if (results.result) {
        res.status(200).json(results.data.user);
      } else {
        res.status(500).json(results);
      }
    }
  );
});

Router.post("/login", (req, res) => {
  console.log(req.body);
  db.get(
    {
      fields: ["*"],
      table: "user",
      where: { email: req.body.email },
      limit: 1,
    },
    (results) => {
      //Results -> { result: [bool], data: [array] }
      if (results.result) {
        console.log(results.data);
        //result from datab then unhash password then unhashed pass from db = password from req body, logged-in= true else pass doesnt matc
        if (
          results.data[0].hashed_password == req.body.password &&
          results.data[0].email == req.body.email
        ) {
          res.status(200).json(results.data[0]);
        } else {
          res.status(403).json({
            message: "email or password incorrect",
          });
        }
      } else {
        res.status(403).send("email was not found");
      }
    }
  );
});

// users can update  address, hashed_password but admins can manually update a users email or or name if a typo was
//todo: hash the password
Router.patch(
  "/:id",
  /*(userAuth),*/ (req, res) => {
    //no user s
    if (req.body == null) {
      return { result: false, msg: ["No data has been sent"] };
    }
    let updateObject = {};
    if (req.body.address != null) updateObject.address = req.body.address;
    if (req.body.hashed_password != null)
      updateObject.hashed_password = req.body.hashed_password;
    //this will let a user get admin privileges, thereby letting user see all modules on the client
    if (req.body.admin_token == "ModuleAdmin1901") updateObject.Is_Admin = 1;
    db.update("user", updateObject, { ID: req.params.id }, (results) => {
      if (results.result) {
        res.status(200).json(results);
      } else {
        res.status(500).json(results);
      }
    });
  }
);

Router.delete("/:code", (req, res) => {
  db.delete("modules", { Module_Code: req.params.code }, (result) => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }
  });
});

module.exports = Router;
