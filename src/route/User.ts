import express from "express"

import { createAccessToken, createRefreshToken } from "../Auth";
import { createUser, getUserByEmail, login } from "../query/User";
import BasicResponse from "../Response/BasicResponse";

var user = express.Router();

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