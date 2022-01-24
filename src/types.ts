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
  hours_worked: number;
  employee_id: string;
  job_group: string;
};
