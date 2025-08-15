import app from "./app.js";
import { logger } from "./utils/logger.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8080;

const connection = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => logger.info("Conectado con Mongo Atlas"))
  .catch((err) => logger.error("Error de coneccion con MongoDB", err));

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
