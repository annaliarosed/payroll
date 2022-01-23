import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { EmployeeReport } from "./EmployeeReport.entity";

@ObjectType()
@Entity()
export class PayrollReport extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  @Field(() => [EmployeeReport])
  @Column()
  employeeReports: [EmployeeReport];
}
