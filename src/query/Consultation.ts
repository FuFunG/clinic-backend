import { getManager, getRepository } from "typeorm";
import _ from "lodash"
import moment from 'moment'

import { Consultation } from "../entity/Consultation";
import { getUserById } from "./User";

export enum TYPE {
    DATE = 'DATE',
    WEEK = 'WEEK',
    MONTH = 'MONTH'
}

export const getConsultation = async (patientId: number, date = "", type = "date"): Promise<Consultation[]> => {
    const repository = getRepository(Consultation);
    const query = repository.createQueryBuilder("consultation")
        .innerJoinAndSelect("consultation.doctor", "doctor")
        .innerJoinAndSelect("consultation.patient", "user", "user.id = :patientId", { patientId })

    if (date) {
        switch (type.toUpperCase()) {
            case TYPE.DATE.toString():
                query.where("DATE(consultation.date) = :date", { date })
                break
            case TYPE.WEEK.toString():
                query.where("EXTRACT(WEEK FROM consultation.date) = :week", { week: moment(date, 'YYYY-MM-DD').isoWeek() })
                query.andWhere("EXTRACT(YEAR FROM consultation.date) = :year", { year: moment(date).year() })
                break
            case TYPE.MONTH.toString():
                query.where("EXTRACT(MONTH FROM consultation.date) = :month", { month: moment(date).month() + 1 })
                query.andWhere("EXTRACT(YEAR FROM consultation.date) = :year", { year: moment(date).year() })
                break
        }
    }
    console.log('getConsultation', date, type)
    const consultations = await query.getMany()

    consultations.map(c => {
        c.doctor.toJSON()
        c.patient.toJSON()
    })

    return consultations
}

export const getConsultationByClinic = async (clinic: string, date = "", type = "date"): Promise<Consultation[]> => {
    const repository = getRepository(Consultation);
    const query = repository.createQueryBuilder("consultation")
        .innerJoinAndSelect("consultation.doctor", "doctor")
        .innerJoinAndSelect("consultation.patient", "user", "user.clinic = :clinic", { clinic })

    if (date) {
        switch (type.toUpperCase()) {
            case TYPE.DATE.toString():
                query.where("DATE(consultation.date) = :date", { date })
                break
            case TYPE.WEEK.toString():
                query.where("EXTRACT(WEEK FROM consultation.date) = :week", { week: moment(date, 'YYYY-MM-DD').isoWeek() })
                query.andWhere("EXTRACT(YEAR FROM consultation.date) = :year", { year: moment(date).year() })
                break
            case TYPE.MONTH.toString():
                query.where("EXTRACT(MONTH FROM consultation.date) = :month", { month: moment(date).month() + 1 })
                query.andWhere("EXTRACT(YEAR FROM consultation.date) = :year", { year: moment(date).year() })
                break
        }
    }

    console.log('getConsultationByClinic', date, type)
    const consultations = await query.getMany()

    return consultations
}

export const createConsultation = async (clinic: string, doctorId: number, patientId: number, diagnosis: string, medication: string, consultationFee: number, date: string, time: string, followUp: boolean): Promise<Boolean> => {

    const doctor = await getUserById(doctorId)
    if (!doctor) return false

    const patient = await getUserById(patientId)
    if (!patient) return false

    const consultation = new Consultation()
    consultation.clinic = clinic
    consultation.doctor = doctor
    consultation.patient = patient
    consultation.diagnosis = diagnosis
    consultation.medication = medication
    consultation.consultationFee = consultationFee
    consultation.date = date
    consultation.time = time
    consultation.followUp = followUp

    const result = await getManager().save(consultation)

    return !_.isEmpty(result)
}