import { Request, Response, NextFunction } from 'express'
import { getTokenPayload } from '.';
import BasicResponse from '../Response/BasicResponse';

export default (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers["authorization"];
    if (authorization) {
        const payload = getTokenPayload(authorization)
        if (!payload) {
            res.status(401).send(BasicResponse(false, 'Unauthorized'))
            return
        } else {
            next()
        }
    } else {

        res.status(401).send(BasicResponse(false, 'Unauthorized'))
        return
    }
}