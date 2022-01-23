import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PayrollReportResolver } from "./resolvers/employeeReports";

const main = async () => {
  const app = express();
  await createConnection()
    .then(async (_) => {
      console.log("Connected to DB");
    })
    .catch((error) => console.log("Data Access Error : ", error));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PayrollReportResolver],
      validate: false,
    }),
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
