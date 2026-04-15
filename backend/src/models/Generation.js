import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const generationSchema = new mongoose.Schema(
  {
    flowers: { type: [itemSchema], default: [] },
    leaves: { type: [itemSchema], default: [] },
    bagColor: { type: String, default: "#d1a36f" },
    bagShape: { type: String, default: "classic" },
    outputImagePath: { type: String, required: true }
  },
  { timestamps: true }
);

export const Generation = mongoose.model("Generation", generationSchema);
