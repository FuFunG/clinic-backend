import express from "express"

import { createConsultation, getConsultation, getConsultationByClinic } from "../query/Consultation";

import BasicResponse from "../Response/BasicResponse";

import isDoctor from "../Auth/isDoctor";
import { getTokenPayload } from "../Auth";

import Constants from '../Constants'
import { getUserById } from "../query/User";

const consultation = express.Router();

consultation.get('/', async (req, res) => {
    const date = req.query.date ? req.query.date.toString() : ""
    const type = req.query.type ? req.query.type.toString() : "date"
    const payload = getTokenPayload(req.headers['authorization'])
    if (!payload) {
        res.status(401).send(BasicResponse(false, 'Unauthorized'))
        return
    }
    const user = await getUserById(payload.userId)
    if (!user) {
        res.status(401).send(BasicResponse(false, 'Unauthorized'))
        return
    }
    if (user.role == Constants.DOCTOR) {
        const consultations = await getConsultationByClinic(user.clinic, date, type)
        res.status(200).send(BasicResponse(true, 'get consultation success', { consultations }))
        return
    } else {
        const consultations = await getConsultation(user.id, date, type)
        res.status(200).send(BasicResponse(true, 'get consultation success', { consultations }))
        return
    }
});

consultation.post('/', isDoctor, async (req, res) => {
    const { clinic, doctorId, patientId, diagnosis, medication, consultationFee, date, time, followUp } = req.body

    if (!clinic || !doctorId || !patientId || !diagnosis || !medication || consultationFee <= 0 || !date || !time) {
        res.status(400).send(BasicResponse(false, 'input wrong'))
        return
    }

    const consultation = await createConsultation(clinic, doctorId, patientId, diagnosis, medication, consultationFee, date, time, followUp)
    if (!consultation) {
        res.status(500).send(BasicResponse(false, 'consultation create failed'))
    } else {
        res.status(200).send(BasicResponse(true, 'consultation created'))
    }
});

export default consultation