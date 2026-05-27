import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

connectDB();

const server = app.listen(env.PORT, env.HOST, () => {
  console.log(`🚀 Server running on http://${env.HOST}:${env.PORT}`);
});

server.on("error", (error) => {
  console.error("❌ Error starting server:", error.message);
  process.exit(1);
});
