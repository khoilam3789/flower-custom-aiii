import mongoose from "mongoose";

const homeReviewItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, max: 120, default: null },
    role: { type: String, default: "", trim: true },
    imageUrl: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { _id: false }
);

const homeReviewConfigSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "default",
      unique: true,
      index: true
    },
    sectionTitle: {
      type: String,
      default: "ĐÁNH GIÁ TỪ HỘI YÊU HOA",
      trim: true
    },
    reviews: {
      type: [homeReviewItemSchema],
      default: []
    }
  },
  { timestamps: true }
);

const HomeReviewConfig = mongoose.model("HomeReviewConfig", homeReviewConfigSchema);
export default HomeReviewConfig;
