import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";

// Route
import UserRoute from "./route/User"
import ConsultationRoute from "./route/Consultation"

(
  async () => {
    const app = express();
    const port = 80
    app.use(express.json());

    app.use("/user", UserRoute)
    app.use("/consultation", ConsultationRoute)
    
    await createConnection();

    app.listen(port, () => {
      console.log(`express server started at http://localhost:${port}`);
    });
  }
)()