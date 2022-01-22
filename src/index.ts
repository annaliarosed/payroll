import "reflect-metadata";
// import path from "path";
// import { createConnection } from "typeorm";
// import { PayrollReport } from "./entities/PayrollReport.entity";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PayrollResolver } from "./resolvers/payroll";
import { PayrollReportResolver } from "./resolvers/getEmployeeReports";

const main = async () => {
  // const conn = await createConnection({
  //   type: "postgres",
  //   database: "payroll",
  //   logging: true,
  //   entities: [PayrollReport],
  //   migrations: [path.join(__dirname, "./migrations/*")],
  // });

  // await conn.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PayrollResolver, PayrollReportResolver],
      validate: false,
    }),
    context: ({ res, req }) => ({
      res,
      req,
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => {
    res.send("hi");
  });

  app.listen(4000, () => {
    console.log("server has started on 4000");
  });
};

main();
