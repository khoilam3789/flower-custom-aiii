import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import generationRoutes from "./routes/generationRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "*"
  })
);
app.use(express.json({ limit: "25mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, "../uploads");

app.use("/uploads", express.static(uploadsPath));
app.use("/api/generate", generationRoutes);

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

export default app;
