import { Router } from "express";

const router = Router();

router.get("/loggerTest", (req, res) => {
  req.logger.debug("Debug log");
  req.logger.http("HTTP log");
  req.logger.info("Info log");
  req.logger.warning("Warning log");
  req.logger.error("Error log");
  req.logger.fatal("Fatal log");

  res.send("Logs enviados. Ver consola y/o archivo errors.log");
});

export default router;
