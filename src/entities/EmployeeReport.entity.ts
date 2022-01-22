import { Field, ID, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class EmployeeReport {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  employeeId!: number;

  //   @Field(() => String)
  //   //change to object with more fields
  //   payPeriod: string;

  //   @Field(() => Int)
  //   amountPaid: number;
}
