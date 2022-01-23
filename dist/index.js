"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const payroll_1 = require("./resolvers/payroll");
const getEmployeeReports_1 = require("./resolvers/getEmployeeReports");
const main = async () => {
    const app = (0, express_1.default)();
    await (0, typeorm_1.createConnection)()
        .then(async (_) => {
        console.log("Connected to DB");
    })
        .catch((error) => console.log("Data Access Error : ", error));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [payroll_1.PayrollResolver, getEmployeeReports_1.PayrollReportResolver],
            validate: false,
        }),
        context: ({ res, req }) => ({
            res,
            req,
        }),
    });
    await apolloServer.applyMiddleware({ app });
    app.get("/", (_, res) => {
        res.send("hi");
    });
    app.listen(4000, () => {
        console.log("server has started on 4000");
    });
};
main();
//# sourceMappingURL=index.js.map