import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity } from "typeorm";

@Entity()
@ObjectType()
export class PayPeriod extends BaseEntity {
  @Field(() => String)
  @Column()
  startDate!: string;

  @Field(() => String)
  @Column()
  endDate!: string;
}
