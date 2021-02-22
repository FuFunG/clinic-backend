import { Request } from "express";

export interface MyContextPayLoad {
  userId: number,
  role: string
}

export interface MyRequest extends Request {
  payload: MyContextPayLoad
}