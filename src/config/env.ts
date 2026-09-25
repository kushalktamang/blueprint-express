import { config } from "dotenv";
import { z } from "zod";
import path from "path";

// load env files from only dev/test only
if (process.env.NODE_ENV !== "production") {
  const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
  config({
    path: path.resolve(process.cwd(), envFile),
    quiet: true,
  });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  PORT: z.string().default("8081"),
});

const env = envSchema.parse(process.env);

export default env;
