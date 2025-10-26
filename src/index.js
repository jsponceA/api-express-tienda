import app from "./app.js";
import sequelize from "./db/config.js";
import { env } from "./env.js";

// Sync database and start server
sequelize.sync({ alter: env.NODE_ENV === "development" })
  .then(() => {
    /* eslint-disable no-console */
    console.log("Database connected and synced");
    /* eslint-enable no-console */

    const server = app.listen(env.PORT, () => {
      /* eslint-disable no-console */
      console.log(`Listening: http://localhost:${env.PORT}`);
      /* eslint-enable no-console */
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
      }
      else {
        console.error("Failed to start server:", err);
      }
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  });
