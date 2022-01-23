import { Ctx, Query, Resolver } from "type-graphql";
import { PayrollReport } from "../entities/PayrollReport.entity";
import { Context } from "../types";

@Resolver()
export class PayrollReportResolver {
  @Query(() => PayrollReport)
  async payrollReport(@Ctx() context: Context): Promise<{ id: number }> {
    console.log("here", context);
    return context.db;
  }
}
