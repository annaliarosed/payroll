"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const graphql_1 = require("graphql");
const lodash_1 = require("lodash");
const CSVProcessor = async (file) => {
    const parseCSVFile = async (file) => {
        return new Promise((resolve) => {
            const results = [];
            try {
                fs_1.default.createReadStream(file)
                    .pipe((0, csv_parser_1.default)({
                    mapHeaders: ({ header }) => (0, lodash_1.snakeCase)(header.trim()),
                    mapValues: ({ value }) => (value ? value.trim() : null),
                }))
                    .on("data", (data) => results.push(data))
                    .on("end", () => resolve(results));
            }
            catch (error) {
                console.error("error: ", error);
            }
        });
    };
    const PayPeriodType = new graphql_1.GraphQLObjectType({
        name: "payPeriod",
        fields: {
            startDate: { type: graphql_1.GraphQLString },
            endDate: { type: graphql_1.GraphQLString },
        },
    });
    const EmployeeReportType = new graphql_1.GraphQLObjectType({
        name: "employeeReport",
        fields: {
            employeeId: { type: graphql_1.GraphQLString },
            payPeriod: { type: PayPeriodType },
            amountPaid: { type: graphql_1.GraphQLString },
        },
    });
    const PayrollReportType = new graphql_1.GraphQLObjectType({
        name: "payrollReport",
        fields: {
            employeeReports: { type: new graphql_1.GraphQLList(EmployeeReportType) },
        },
    });
    const getType = () => {
        return {
            name: "payrollReport",
            description: "...",
            type: PayrollReportType,
            fields: () => ({
                employeeReports: {
                    type: new graphql_1.GraphQLList(EmployeeReportType),
                },
            }),
        };
    };
    const generateSchema = (rows) => {
        return new graphql_1.GraphQLSchema({
            query: new graphql_1.GraphQLObjectType({
                name: "Query",
                fields: () => ({
                    payrollReport: {
                        type: new graphql_1.GraphQLObjectType(getType()),
                        resolve: (_root) => {
                            const objs = rows.map((row) => {
                                return {
                                    employeeId: row["employee_id"],
                                    payPeriod: {
                                        startDate: row["date"],
                                        endDate: row["date"],
                                    },
                                    amountPaid: row["job_group"] === "A"
                                        ? row["hours_worked"] * 20
                                        : row["hours_worked"] * 30,
                                };
                            });
                            return {
                                employeeReports: objs,
                            };
                        },
                    },
                }),
            }),
        });
    };
    const rows = await parseCSVFile(file);
    return generateSchema(rows);
};
exports.default = CSVProcessor;
//# sourceMappingURL=csvProcessor.js.map