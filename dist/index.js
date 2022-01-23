"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const csvProcessor_1 = __importDefault(require("./services/csvProcessor"));
const main = async () => {
    const app = (0, express_1.default)();
    await (0, typeorm_1.createConnection)()
        .then(async (_) => {
        console.log("Connected to DB");
    })
        .catch((error) => console.log("Data Access Error : ", error));
    const schema = await (0, csvProcessor_1.default)("/Users/annaliadestefano/Documents/payroll/time-report-42.csv");
    const apolloServer = new apollo_server_express_1.ApolloServer({
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
//# sourceMappingURL=index.js.map