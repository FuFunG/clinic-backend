import { getManager, getRepository } from "typeorm";
import _ from "lodash"

import { User } from "../entity/User";
import { compare, hash } from "bcryptjs";
import Constants from "../Constants";

export const getUserById = async (id: number): Promise<User | undefined> => {
    const repository = getRepository(User);
    const userQueryBuilder = repository.createQueryBuilder("user").where("user.id = :id", { id })

    const user = await userQueryBuilder.getOne()

    return user
}

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    const repository = getRepository(User);
    const userQueryBuilder = repository.createQueryBuilder("user").where("user.email = :email", { email })

    const user = await userQueryBuilder.getOne()

    return user
}

export const createUser = async (email: string, password: string, name: string, clinic: string, phoneNumber: string, address: string): Promise<Boolean> => {
    const hashedPassword = await hash(password, 12);

    const user = new User()
    user.email = email
    user.password = hashedPassword
    user.name = name
    user.clinic = clinic
    user.phoneNumber = phoneNumber
    user.address = address

    const user2 = await getManager().save(user)

    return !_.isEmpty(user2)
}

export const login = async (email: string, password: string): Promise<User | undefined> => {
    const user = await getUserByEmail(email)

    if (!user) return

    const valid = await compare(password, user.password!!);

    return valid ? user : undefined
}

export const getPatient = async (clinic: string): Promise<User[]> => {
    const repository = getRepository(User);
    const userQueryBuilder = repository.createQueryBuilder("user")
        .where("user.clinic = :clinic", { clinic })
        .andWhere("user.role IS NULL")

    const patient = await userQueryBuilder.getMany()

    return patient
}

export const getDoctor = async (clinic: string): Promise<User[]> => {
    const repository = getRepository(User);
    const userQueryBuilder = repository.createQueryBuilder("user")
        .where("user.clinic = :clinic", { clinic })
        .andWhere("user.role = :role", { role: Constants.DOCTOR })

    const doctor = await userQueryBuilder.getMany()

    return doctor
}