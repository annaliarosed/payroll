import { Field, ID, Int, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { PayPeriod } from "./PayPeriod.entity";

@Entity()
@ObjectType()
export class EmployeeReport {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  employeeId!: string;

  @Field(() => PayPeriod)
  payPeriod: PayPeriod;

  @Field(() => Int)
  amountPaid: number;
}
