import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import generationRoutes from "./routes/generationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import homeReviewRoutes from "./routes/homeReviewRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

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
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/home-reviews", homeReviewRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

export default app;
