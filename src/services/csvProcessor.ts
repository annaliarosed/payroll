import csv from "csv-parser";
import fs from "fs";
import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { snakeCase } from "lodash";
import { InitialDataImport } from "src/types";
import { getPayPeriod } from "./helpers";

const CSVProcessor = async (file: string) => {
  const parseCSVFile = async (file: string): Promise<InitialDataImport[]> => {
    return new Promise((resolve) => {
      const results: any = [];
      try {
        fs.createReadStream(file)
          .pipe(
            csv({
              mapHeaders: ({ header }) => snakeCase(header.trim()),
              mapValues: ({ value }) => (value ? value.trim() : null),
            })
          )
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results));
      } catch (error) {
        console.error("error: ", error);
      }
    });
  };

  const PayPeriodType = new GraphQLObjectType({
    name: "payPeriod",
    fields: {
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
    },
  });

  const EmployeeReportType = new GraphQLObjectType({
    name: "employeeReport",
    fields: {
      employeeId: { type: GraphQLID },
      payPeriod: { type: PayPeriodType },
      amountPaid: { type: GraphQLString },
    },
  });

  const PayrollReportType = new GraphQLObjectType({
    name: "payrollReport",
    fields: {
      employeeReports: { type: new GraphQLList(EmployeeReportType) },
    },
  });

  const getType = () => {
    return {
      name: "payrollReport",
      description: "...",
      type: PayrollReportType,
      fields: () => ({
        employeeReports: {
          type: new GraphQLList(EmployeeReportType),
        },
      }),
    };
  };

  const generateSchema = (rows: InitialDataImport[]) => {
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: () => ({
          payrollReport: {
            type: new GraphQLObjectType(getType()),
            resolve: (_root) => {
              const objs = rows.map((row) => {
                return {
                  employeeId: row["employee_id"],
                  payPeriod: getPayPeriod(row["date"]),
                  amountPaid:
                    row["job_group"] === "A"
                      ? `$${row["hours_worked"] * 20}.00`
                      : `$${row["hours_worked"] * 30}.00`,
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

  const rows: InitialDataImport[] = await parseCSVFile(file);

  return generateSchema(rows);
};

export default CSVProcessor;
