import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EmployeeReport } from "./EmployeeReport.entity";

@Entity()
@ObjectType()
export class PayrollReport {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field(() => [EmployeeReport])
  @Column()
  employeeReports: [EmployeeReport];
}
