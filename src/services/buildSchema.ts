import { GraphQLList, GraphQLObjectType, GraphQLSchema } from "graphql";
import { PayrollReportType, EmployeeReportType } from "../types";
import csvProcessor from "./csvProcessor";
import { getPayPeriod } from "./helpers";

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

  return generateSchema();
};

export default buildSchema;
