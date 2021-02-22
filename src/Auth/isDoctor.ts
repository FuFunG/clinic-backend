import { Request, Response, NextFunction } from 'express'

import BasicResponse from '../Response/BasicResponse';
import { getUserById } from '../query/User'

import Constants from '../Constants'
import { getTokenPayload } from '.';

export default async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers["authorization"];
    if (authorization) {
        const payload = getTokenPayload(authorization);
        if (!payload) {
            res.status(401).send(BasicResponse(false, 'Unauthorized'))
            return
        }
        const user = await getUserById(payload.userId)
        if (!user) {
            res.status(401).send(BasicResponse(false, 'Unauthorized'))
            return
        } else if (user.role != Constants.DOCTOR) {
            res.status(403).send(BasicResponse(false, 'Forbidden'))
            return
        }
        next()
    } else {
        res.status(401).send(BasicResponse(false, 'Unauthorized'))
        return
    }
}