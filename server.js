const { urlencoded } = require("express");
const express = require("express");
const cors = require("cors");

//init  server and db
const app = express();
const port = 5000;
const Database = require("./db/coursedb");
Database.init();

//import routes
const Modules = require("./routes/modules");
const user = require("./routes/user");
const adminRoute = require("./routes/staff");
const studentRoute = require("./routes/student");

//Configure Server
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

//routes
app.use("/modules", Modules);
app.use("/user", user);
app.use("/admin", adminRoute);
app.use("/student", studentRoute);

//home
app.get("/", (req, res) => {
  res.status(200).send("HomePage");
});

//error handler
app.use((err, req, res, next) => {
  let errStatus = 500;
  let message = err.message || "SERVER ERROR";
  if (err.status) errStatus = err.status;
  if (err.statusCode) errStatus = err.statusCode;
  if (process.env.NODE_ENV === "development") {
    res
      .status(errStatus)
      .json({ status: errStatus, message, stack: err.stack });
  } else {
    res.status(errStatus).json({ status: errStatus, message });
  }
});

//startup server
app.listen(port, () => console.log(`Server running at port ${port}`));

//proper exit
process.on("SIGTERM", exitProgram);
process.on("SIGINT", exitProgram);
function exitProgram() {
  Database.connection.end();
  server.close(() => {
    process.exit(0);
  });
}
