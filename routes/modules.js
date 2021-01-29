const Router = require("express").Router();
const db = require("../db/coursedb");
const moment = require("moment");

const validateModule = require("../middlewares/ValidateModule.js");

Router.post("/add", validateModule, (req, res) => {
  db.create(
    "module",
    {
      Name: req.body.Name,
      Code: req.body.Code,
      Start_Date: moment(req.body.Start_Date, "DD MM YYYY").format(
        "YYYY-MM-DD"
      ),
      End_Date: moment(req.body.End_Date, "DD MM YYYY").format("YYYY-MM-DD"),
      Course_Name: req.body.Course_Name,
    },
    (results) => {
      /* {
            result: true|false
            rows: []
        }*/
      if (results.result) {
        res.status(200).json(results);
      } else {
        res.status(500).json(results);
      }
    }
  );
});

Router.get("/code/:code", (req, res) => {
  if (req.params.code == null) {
    return res.status(500).json({
      result: false,
      msg: ["Module_Code not found"],
    });
  }
  db.get(
    {
      fields: ["*"],
      table: "module",
      where: { Code: req.params.code },
      limit: 1,
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

Router.get("/all", (req, res) => {
  db.get(
    {
      fields: ["*"],
      table: "module",
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

Router.patch("/code/:id", (req, res) => {
  if (req.body == null) {
    return { result: false, msg: ["No data has been sent"] };
  }
  let updateObject = {};
  if (req.body.Name != null) updateObject.Module_Name = req.body.Module_Name;
  let Start_Date;
  if (req.body.Start_Date != null) {
    Start_Date = moment(req.body.Start_Date, "DD MM YYYY");
    if (!Start_Date) updateObject.Start_Date = Start_Date.format("DD MMM YYYY");
  }
  let End_Date;
  if (req.body.End_Date != null) {
    End_Date = moment(req.body.End_Date, "DD MM YYYY");
    if (!End_Date) updateObject.End_Date = End_Date.format("DD MMM YYYY");
  }

  db.update("modules", updateObject, { ID: req.params.id }, (results) => {
    if (results.result) {
      res.status(200).json(results);
    } else {
      res.status(500).json(results);
    }
  });
});

Router.delete("/:code", (req, res) => {
  db.delete("module", { Code: req.params.code }, (results) => {
    if (results.result) {
      res.status(200).json(results);
    } else {
      res.status(500).json(results);
    }
  });
});

Router.get("/user-module", (req, res) => {
  db.get(
    {
      table: "user",
      fields: ["module.Name", "module.Code"],
      joins: [
        {
          type: "RIGHT JOIN",
          table: "user_has_module",
          on: ["user.ID", "user_has_module.User_Id"],
        },
        {
          type: "RIGHT JOIN",
          table: "module",
          on: ["module.ID", "user_has_module.Module_ID"],
        },
      ],
      where: { "user.ID": 5 },
    },
    (results) => {
      results.data.forEach((result) => {
        console.log(result.Name);
      });
    }
  );
});

module.exports = Router;
