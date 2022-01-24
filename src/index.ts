import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import buildSchema from "./services/BuildSchema";

const main = async () => {
  const app = express();
  await createConnection()
    .then(async (_) => {
      console.log("Connected to DB");
    })
    .catch((error) => console.log("Data Access Error : ", error));

  const schema = await buildSchema(
    "/Users/annaliadestefano/Documents/payroll/time-report-42.csv"
  );

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
