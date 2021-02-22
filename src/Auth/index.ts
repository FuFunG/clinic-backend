import { User } from "../entity/User";
import { sign, verify } from "jsonwebtoken";
import { MyContextPayLoad } from "../MyContext";

export const createAccessToken = (user: User) => {
    return sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            // expiresIn: "60000",
            expiresIn: "1d"
        }
    );
};

export const createRefreshToken = (user: User) => {
    return sign(
        { userId: user.id, tokenVersion: user.tokenVersion },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "30d"
        }
    );
};

export const getTokenPayload = (authorization: string | undefined): MyContextPayLoad | undefined => {
    if (!authorization) return
    try {
        const token = authorization.split(" ")[1];
        return verify(token, process.env.ACCESS_TOKEN_SECRET!) as MyContextPayLoad
    } catch (err) {
        return
    }
}