const mysql = require("mysql2/promise");

const db = new (class database {
  async init() {
    this.connection = await mysql
      .createConnection({
        host: "localhost",
        user: "root",
        database: "Course_Data",
      })
      .catch((error) => {
        console.log("Failed to connect to database: " + error);
      });
    console.log("Db connected");
  }
  /**Create query
   * @param {string} table The table name (for example: Users)
   * @param {object} object An object with key values to be inserted (for example: { id: 1, name: 'ruby' })
   * @param {function} callback The callback function
   */
  create(table, object, callback) {
    //Execute insert query
    this.connection
      .query("INSERT INTO ?? SET ?", [table, object])
      .then(([rows]) => {
        callback({
          result: true,
          data: {
            ...rows,
            user: object,
          },
        });
      })
      .catch((err) => {
        //Check if there was an error
        if (err !== null) {
          callback({
            result: false,
            err: "[DBController.js].create() Failed to query " + err,
          });
        }
      });
  } /*
  get(requirements, callback) {
    let query = "SELECT ";
    let preparedValues = [];
    if (requirements.fields.length > 0 && requirements.fields[0] == "*") {
      query += "*";
    } else {
      query += "??";
      preparedValues.push(requirements.fields);
    }
    if (requirements.table != null) {
      query += " FROM ??";
      preparedValues.push(requirements.table);
    } else {
      callback({ result: false, msg: "No table given" });
    }
    if (requirements.where != null) {
      if (Object.keys(requirements.where).length > 0) {
        query += " WHERE ?";
        preparedValues.push(requirements.where);
      }
    }
    if (requirements.order != null) {
      query += " ORDER BY ??";
      preparedValues.push(requirements.order);
    }
    if (requirements.limit != null) {
      query += " LIMIT ?";
      preparedValues.push(requirements.limit);
    }
    //console.log(query);
    //console.log(preparedValues);
    //console.log(this.connection.format(query, preparedValues));
    //Execute query if everything is succesfull
    this.connection
      .query(query, preparedValues)
      .then(([rows]) => {
        if (rows.length > 0) {
          callback({ result: true, data: rows });
        } else {
          callback({ result: false });
        }
      })
      .catch((err) => {
        //Check if there was an error
        if (err !== null) {
          callback({
            result: false,
            err: "[DBController.js].get() Failed to query " + err,
          });
        }
      });
  }*/

  /** Select query
   *  @param {object} requirements Supports `fields`, `table`, `where`, `order`, `limit`
   *  @param {function} callback The callback function
   */ /** Select query
   *  @param {object} requirements Supports `fields`, `table`, `where`, `order`, `limit`
   *  @param {function} callback The callback function
   */
  get(requirements, callback) {
    let query = "SELECT ";
    let preparedValues = [];

    if (requirements.fields.length > 0 && requirements.fields[0] == "*") {
      query += "*";
    } else {
      query += "??";
      preparedValues.push(requirements.fields);
    }

    if (requirements.table != null) {
      query += " FROM ??";
      preparedValues.push(requirements.table);
    } else {
      callback({ result: false, msg: "No table given" });
    }

    if (requirements.joins != null) {
      if (requirements.joins.length > 0) {
        requirements.joins.forEach((join) => {
          query += ` ${join.type.toUpperCase()} ?? ON ?? = ??`;
          preparedValues.push(join.table);
          preparedValues.push(join.on[0]);
          preparedValues.push(join.on[1]);
        });
      }
    }

    if (requirements.where != null) {
      if (Object.keys(requirements.where).length > 0) {
        query += " WHERE ?";
        preparedValues.push(requirements.where);
      }
    }
    if (requirements.order != null) {
      query += " ORDER BY ??";
      preparedValues.push(requirements.order);
    }
    if (requirements.limit != null) {
      query += " LIMIT ?";
      preparedValues.push(requirements.limit);
    }

    this.connection
      .query(query, preparedValues)
      .then(([rows]) => {
        if (rows.length > 0) {
          callback({ result: true, data: rows });
        } else {
          callback({ result: false });
        }
      })
      .catch((err) => {
        //Check if there was an error
        if (err !== null) {
          callback({
            result: false,
            err: "[DBController.js].get() Failed to query " + err,
          });
        }
      });
  }

  /**Update query
   * @param {string} table The table name (for example: Users)
   * @param {object} object The SET object, where the values and columns are set (for example: { id: 1, name: 'ruby' })
   * @param {object} condition the requirements for the row that needs to be updated (for example if you want the user with the id of 1 updated { id: 1 })
   * @param {function} callback The callback function
   */
  update(table, object, condition, callback) {
    //Execute update query
    //console.log(query);
    //console.log(preparedValues);
    console.log(
      this.connection.format("UPDATE ?? SET ? WHERE ?", [
        table,
        object,
        condition,
      ])
    );
    this.connection
      .query("UPDATE ?? SET ? WHERE ?", [table, object, condition])
      .then(([rows]) => {
        callback({ result: true, data: rows });
      })
      .catch((err) => {
        console.log(err);
        //Check if there was an error
        if (err !== null) {
          callback({
            result: false,
            err: "[DBController.js]:update() Failed to query " + err,
          });
        }
      });
  }

  /**Delete query
   * @param {string} table The table name (for example: Users)
   * @param {object} condition the requirements for the row that needs to be deleted (for example if you want the user with the id of 1 deleted { id: 1 })
   * @param {function} callback The callback function
   */
  delete(table, condition, callback) {
    //Execute delete query
    this.connection
      .query("DELETE FROM ?? WHERE ?", [table, condition])
      .then(([rows]) => {
        callback({ result: true, data: rows });
      })
      .catch((err) => {
        //Check if there was an error
        if (err !== null) {
          callback({
            result: false,
            err: "[DBController.js]:delete() Failed to query " + err,
          });
        }
      });
  }
})();

module.exports = db;
