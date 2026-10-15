import { defineConfig } from "drizzle-kit";

import env from "./src/config/env.js";

const database_url = env.DATABASE_URL;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: database_url,
  },
});
