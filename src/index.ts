import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import buildSchema from "./services/BuildSchema";
import { createConnection, Db } from "typeorm";
import multer from "multer";
import sqlite3 from "sqlite3";
import { camelCase } from "lodash";
import csvProcessor from "./services/csvProcessor";

var storage = multer.diskStorage({
  destination: (_, x, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, `time-report-${Math.floor(Math.random() * 20)}.csv`);
  },
});

const main = async () => {
  const app = express();
  const upload = multer({
    storage,
    fileFilter: (_, file, cb) => {
      if (file.mimetype == "text/csv") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Only .csv format allowed!"));
      }
    },
  });

  createConnection()
    .then(() => console.log("connected created!"))
    .catch((error) => console.log("error: ", error));

  app.get("/", (_, res) => {
    res.sendFile("/Users/annaliadestefano/Documents/payroll/src/index.html");
  });

  await app.post("/", upload.single("csv"), async (req, res) => {
    console.log(req.file?.filename);

    res.sendFile(
      "/Users/annaliadestefano/Documents/payroll" +
        "/uploads" +
        "/" +
        req.file?.filename
    );

    const db = new sqlite3.Database(
      "./payroll.db",
      sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          return console.error(err.message);
        }

        console.log("connection successful");
      }
    );

    console.log(req.file);

    db.run(
      `CREATE TABLE ${camelCase(
        req.file?.filename
      )}(date, hours_worked, employee_id, job_group )`
    );

    const rows = await csvProcessor(
      "/Users/annaliadestefano/Documents/payroll/" + req.file?.path
    );

    const headers = rows[0];

    const sql = `INSERT INTO ${camelCase(req.file?.filename)} (${
      headers.date
    }, ${headers.hoursWorked}, ${headers.employeeId}, ${headers.jobGroup} )
        VALUES(?,?,?,?)`;

    rows.forEach((row, index) => {
      db.run(
        sql,
        [`${row.date}, ${row.hoursWorked}, ${row.employeeId}, ${row.jobGroup}`],
        (err) => (err ? console.error(err) : console.log("row worked!", index))
      );
    });

    db.close((err) =>
      err ? console.error(err.message) : console.log("successfuly closed")
    );

    // does not work that well when switching files quickly.
    const apolloServer = new ApolloServer({
      schema: await buildSchema(
        "/Users/annaliadestefano/Documents/payroll/" + req.file?.path
      ),
      context: ({ res, req }) => ({
        res,
        req,
      }),
    });

    // TODO: history.push(/graphql after this)
    apolloServer.applyMiddleware({ app });
  });

  // TODO try to push to data base for sure
  app.listen(4000, () => {
    console.log("server has started on 4000");
  });
};

main();
