import express from "express"
import Constants from "../Constants";

import { createAccessToken, createRefreshToken, getTokenPayload } from "../Auth";
import { createUser, getDoctor, getPatient, getUserByEmail, getUserById, login } from "../query/User";
import BasicResponse from "../Response/BasicResponse";

var user = express.Router();

user.get('/', async (req, res) => {
    const role = req.query.role
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
    if (user.role !== Constants.DOCTOR) {
        res.status(403).send(BasicResponse(false, 'Forbidden'))
        return
    } else {
        const users = role === 'doctor' ? await getDoctor(user.clinic) : await getPatient(user.clinic)
        res.status(200).send(BasicResponse(true, 'get users success', { users }))
        return
    }
});

user.post('/login', async (req, res) => {
    const { email, password } = req.body

    const user = await login(email, password)
    if (!user) {
        res.status(400).send(BasicResponse(false, 'email or password was wrong'))
    } else {
        res.status(200).send(BasicResponse(true, 'login sccess', {
            accessToken: createAccessToken(user),
            refreshToken: createRefreshToken(user),
            userId: user.id,
            role: user.role,
        }))
    }
});

user.post('/register', async (req, res) => {
    const { email, password, name, clinic, phoneNumber, address } = req.body

    if (!email || !password || !name || !clinic || !phoneNumber || !address) {
        res.status(400).send(BasicResponse(false, 'input wrong'))
        return
    }

    const findUser = await getUserByEmail(email)

    if (findUser != undefined) {
        res.status(400).send(BasicResponse(false, 'email exist'))
        return
    }

    const success = await createUser(email, password, name, clinic, phoneNumber, address)

    success
        ? res.status(200).send(BasicResponse(true, 'user created'))
        : res.status(500).send(BasicResponse(false, 'sometings wrong'));
});

export default user