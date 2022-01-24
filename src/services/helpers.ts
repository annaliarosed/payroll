import moment from "moment";

export const getPayPeriod = (date: string) => {
  const momentDate = moment(date, "DD/MM/YYYY");

  const dayOfMonth = momentDate.date();
  const year = momentDate.year();
  const endOfMonth = momentDate.endOf("month").format("YYYY-MM-DD");
  const firstOfMonth = momentDate.startOf("month").format("YYYY-MM-DD");

  const firstPayPeriodEndingDate = moment(
    `${year}-${momentDate.month() + 1}-15`,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  const secondPayPeriodBeginningDate = moment(
    `${year}-${momentDate.month() + 1}-16`,
    "YYYY-MM-DD"
  ).format("YYYY-MM-DD");

  const firstPayPeriod = {
    startDate: firstOfMonth,
    endDate: firstPayPeriodEndingDate,
  };

  const secondPayPeriod = {
    startDate: secondPayPeriodBeginningDate,
    endDate: endOfMonth,
  };

  if (dayOfMonth >= 1 && dayOfMonth <= 15) {
    return firstPayPeriod;
  }

  return secondPayPeriod;
};