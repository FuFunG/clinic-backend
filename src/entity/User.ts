import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Consultation } from "./Consultation";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column("text")
  password?: string;

  @Column("text")
  name: string;

  @Column("text")
  clinic: string;

  @Column("text")
  phoneNumber: string;

  @Column("text")
  address: string;

  @Column("int", { default: 0 })
  tokenVersion?: number;

  @Column("text", { nullable: true })
  role: string | null;

  @OneToMany(() => Consultation, consultation => consultation.doctor)
  doctorConsultation: [Consultation];

  @OneToMany(() => Consultation, consultation => consultation.patient)
  patientConsultation: [Consultation];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt?: Date;

  toJSON() {
    delete this.password;
    delete this.tokenVersion;
    delete this.createdAt;
    delete this.updatedAt;
    return this;
  }
}
