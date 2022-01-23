import { Field, ID, ObjectType } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  EntityRepository,
} from "typeorm";
import { EmployeeReport } from "./EmployeeReport.entity";

@Entity()
@ObjectType()
@EntityRepository()
export class PayrollReport extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id?: number;

  // @Field(() => [EmployeeReport])
  // @Column()
  // employeeReports: [EmployeeReport];
}
