import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

export type PayPeriod = {
  startDate: string;
  endDate: string;
};

export type EmployeeReport = {
  employeeId: string;
  payPeriod: PayPeriod;
  amountPaid: string;
};

export type PayrollReport = {
  employeeReports: EmployeeReport[];
};

export type InitialDataImport = {
  date: string;
  hoursWorked: number;
  employeeId: string;
  jobGroup: string;
};

export const PayPeriodType = new GraphQLObjectType({
  name: "payPeriod",
  fields: {
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
  },
});

export const EmployeeReportType = new GraphQLObjectType({
  name: "employeeReport",
  fields: {
    employeeId: { type: GraphQLID },
    payPeriod: { type: PayPeriodType },
    amountPaid: { type: GraphQLString },
  },
});

export const PayrollReportType = new GraphQLObjectType({
  name: "payrollReport",
  fields: {
    employeeReports: { type: new GraphQLList(EmployeeReportType) },
  },
});
