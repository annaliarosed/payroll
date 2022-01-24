import { GraphQLList, GraphQLObjectType, GraphQLSchema } from "graphql";
import { PayrollReportType, EmployeeReportType } from "../types";
import csvProcessor from "./csvProcessor";
import { getAmountPaid, getPayPeriod } from "./helpers";

const buildSchema = async (file: string) => {
  const rows = await csvProcessor(file);

  const getType = () => {
    return {
      name: "payrollReport",
      type: PayrollReportType,
      fields: () => ({
        employeeReports: {
          type: new GraphQLList(EmployeeReportType),
        },
      }),
    };
  };

  const generateSchema = () => {
    return new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "Query",
        fields: () => ({
          payrollReport: {
            type: new GraphQLObjectType(getType()),
            resolve: (_root) => {
              const objs = rows.map((row) => {
                return {
                  employeeId: row["employeeId"],
                  payPeriod: getPayPeriod(row["date"]),
                  amountPaid: getAmountPaid(
                    row["jobGroup"],
                    row["hoursWorked"]
                  ),
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

  return generateSchema();
};

export default buildSchema;
