import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity("consultation")
export class Consultation extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  clinic: string;

  @ManyToOne(() => User, user => user.doctorConsultation)
  doctor: User;

  @ManyToOne(() => User, user => user.patientConsultation)
  patient: User;

  @Column("text")
  diagnosis: string;

  @Column("text")
  medication: string;

  @Column("float")
  consultationFee: number;

  @Column("date")
  date: string;

  @Column("time")
  time: string;

  @Column("boolean", { default: false })
  followUp: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
