"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayPeriod = void 0;
const moment_1 = __importDefault(require("moment"));
const getPayPeriod = (date) => {
    const momentDate = (0, moment_1.default)(date, "DD/MM/YYYY");
    const dayOfMonth = momentDate.date();
    const year = momentDate.year();
    const endOfMonth = momentDate.endOf("month").format("YYYY-MM-DD");
    const firstOfMonth = momentDate.startOf("month").format("YYYY-MM-DD");
    const firstPayPeriodEndingDate = (0, moment_1.default)(`${year}-${momentDate.month() + 1}-15`, "YYYY-MM-DD").format("YYYY-MM-DD");
    const secondPayPeriodBeginningDate = (0, moment_1.default)(`${year}-${momentDate.month() + 1}-16`, "YYYY-MM-DD").format("YYYY-MM-DD");
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
exports.getPayPeriod = getPayPeriod;
//# sourceMappingURL=helpers.js.map