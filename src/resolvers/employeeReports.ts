import { Query, Resolver } from "type-graphql";
import { PayrollReport } from "../entities/PayrollReport.entity";

@Resolver()
export class PayrollReportResolver {
  @Query(() => PayrollReport)
  async payrollReport(): Promise<PayrollReport[]> {
    return PayrollReport.find();
  }
}
