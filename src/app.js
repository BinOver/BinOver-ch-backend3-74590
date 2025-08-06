import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import mockingRouter from "./routes/mocking.router.js";
import { errorHandler } from "./middleware/errorHandler.js";

import { addLogger } from "./middleware/loggerMiddleware.js";
import { logger } from "./utils/logger.js";
import loggerTest from "./routes/loggerTest.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const connection = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("Conectado con Mongo Atlas"))
  .catch((err) => logger.error("Error de coneccion con MongoDB", err));

app.use(express.json());
app.use(cookieParser());
app.use(addLogger);

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);

app.use("/mocking", mockingRouter);

app.use("/", loggerTest);

app.get("/", (req, res) => {
  res.send("API Adoptme funcionando");
});

app.use(errorHandler);

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
