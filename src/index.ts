import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PayrollReportResolver } from "./resolvers/payrollReport";

import { parse } from "csv-parse";
import fs from "fs";
import CSVProcessor from "./services/csvProcessor";

const main = async () => {
  const app = express();
  await createConnection()
    .then(async (_) => {
      console.log("Connected to DB");
    })
    .catch((error) => console.log("Data Access Error : ", error));

  const schema = await CSVProcessor(
    "/Users/annaliadestefano/Documents/payroll/time-report-42.csv"
  );

  // app.get("/", () => "hi");

  const apolloServer = new ApolloServer({
    schema: schema,
    context: ({ res, req }) => ({
      res,
      req,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server has started on 4000");
  });
};

main();
