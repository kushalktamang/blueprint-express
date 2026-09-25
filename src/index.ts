import env from "./config/env.js";
import createServer from "./server.js";

const PORT = Math.trunc(Number(env.PORT));

const server = createServer().listen(PORT, () => {
  console.log(`SERVER READY AT: http://localhost:${PORT}`);
});

const shutdown = (exitCode: number): number => {
  process.exit(exitCode);
};

const closeServer = (exitCode: number): void => {
  server.close(() => {
    void shutdown(exitCode);
  });
};

// handle unhandled promise rejection (e.g database connection error)
process.on("unhandledRejection", (error) => {
  console.error("unhandled rejection", error);
  closeServer(1);
});

// handles uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("uncaught exception", error);
  closeServer(1);
});

// graceful shutdown
process.on("SIGTERM", () => {
  console.error("SIGTERM received, shutting down gracefully");
  closeServer(1);
});
