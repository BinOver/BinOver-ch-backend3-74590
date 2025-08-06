export const errorHandler = (err, req, res, next) => {
  console.error(`Error - ${err.name}: ${err.message}`);

  res.status(err.status || 500).json({
    status: "error",
    error: err.name || "Internal Server Error.",
    message: err.message || "Error inesperado.",
  });
};
