import {Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class PayrollReport {
    @PrimaryGeneratedColumn()
    id!: number;
    
    //employeeReports
}