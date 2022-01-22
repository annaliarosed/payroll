import { Query, Resolver } from "type-graphql";

@Resolver()
export class PayrollResolver {
    @Query(() => String)
    payroll() {
        return "test"
    }
}