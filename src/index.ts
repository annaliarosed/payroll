import "reflect-metadata";
import path from "path";
import { createConnection } from "typeorm";
import { PayrollReport } from "./entities/payrollReport.entity";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PayrollResolver } from "./resolvers/payroll";

const main = async () => {
  //   const conn = await createConnection({
  //     type: "postgres",
  //     database: "payroll",
  //     logging: true,
  //     entities: [PayrollReport],
  //     migrations: [path.join(__dirname, "./migrations/*")],
  //   });

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PayrollResolver],
      validate: false,
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
