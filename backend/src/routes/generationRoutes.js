import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Generation } from "../models/Generation.js";
import { composeBoothImage } from "../services/imageComposer.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { flowers = [], leaves = [], bag = {} } = req.body;
    const fileName = `${uuidv4()}.png`;
    const outputAbsolutePath = path.resolve("uploads/generated", fileName);

    await composeBoothImage({
      flowers,
      leaves,
      bagColor: bag.color || "#c58f64",
      bagShape: bag.shape || "classic",
      bagImage: bag.image || null,
      outputAbsolutePath
    });

    const created = await Generation.create({
      flowers: flowers.map((item) => ({ label: item.label, quantity: item.quantity })),
      leaves: leaves.map((item) => ({ label: item.label, quantity: item.quantity })),
      bagColor: bag.color || "#c58f64",
      bagShape: bag.shape || "classic",
      outputImagePath: `/uploads/generated/${fileName}`
    });

    res.status(201).json(created);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot generate image" });
  }
});

router.get("/", async (_req, res) => {
  const records = await Generation.find().sort({ createdAt: -1 }).limit(20);
  res.json(records);
});

export default router;
