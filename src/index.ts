import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import buildSchema from "./services/BuildSchema";
import { createConnection } from "typeorm";
import multer from "multer";
import sqlite3 from "sqlite3";
import { camelCase } from "lodash";
import csvProcessor from "./services/csvProcessor";

const main = async () => {
  let baseCount = 22;

  var storage = multer.diskStorage({
    //@ts-expect-error: unused param
    destination: (_, res, cb) => {
      cb(null, "uploads");
    },

    //@ts-expect-error: unused param
    filename: (_, res, cb) => {
      baseCount = baseCount++;
      cb(null, `time-report-${baseCount}.csv`);
    },
  });

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

  const app = express();

  createConnection()
    .then(() => console.log("connection created!"))
    .catch((error) => console.log("error: ", error));

  app.get("/", (_, res) => {
    res.sendFile("/Users/annaliadestefano/Documents/payroll/src/index.html");
  });

  await app.post("/", upload.single("csv"), async (req, res) => {
    // handle upload of a csv file
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

    // create new table in the database
    await db.run(
      `CREATE TABLE ${camelCase(
        req.file?.filename
      )}(date, hoursWorked, employeeId, jobGroup )`
    );

    // add the correct columns
    const sql = `INSERT INTO ${camelCase(
      req.file?.filename
    )} (date, "hoursWorked", "employeeId", "jobGroup")
      VALUES(?,?,?,?)`;

    const rows = await csvProcessor(
      "/Users/annaliadestefano/Documents/payroll/" + req.file?.path
    );

    // insert the data from the csv file into corresponding colomns
    await rows.forEach((row) => {
      db.run(
        sql,
        [
          `${row.date}`,
          `${row.hoursWorked}`,
          `${row.employeeId}`,
          `${row.jobGroup}`,
        ],
        (err) => (err ? console.error(err) : console.log("row created"))
      );
    });

    db.close((err) =>
      err ? console.error(err.message) : console.log("successfuly closed")
    );

    const apolloServer = new ApolloServer({
      schema: await buildSchema(
        "/Users/annaliadestefano/Documents/payroll/" + req.file?.path
      ),
      context: ({ res, req }) => ({
        res,
        req,
      }),
    });

    apolloServer.applyMiddleware({ app });
  });

  app.listen(4000, () => {
    console.log("server has started on 4000");
  });
};

main();
