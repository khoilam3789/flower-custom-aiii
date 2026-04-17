import mongoose from 'mongoose';

const storyColorSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    icon: { type: String, required: true },
    desc: { type: String, required: true }
  },
  { _id: false }
);

const storyExploreSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    slug: { type: String, required: true }
  },
  { _id: false }
);

const storySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    heroImage: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    storyTitle: { type: String, default: 'Cau chuyen', trim: true },
    storyBody: { type: String, default: '', trim: true },
    poemTitle: { type: String, default: '', trim: true },
    poemLines: { type: [String], default: [] },
    colorsTitle: { type: String, default: 'Cac sac mau', trim: true },
    colors: { type: [storyColorSchema], default: [] },
    exploreTitle: { type: String, default: 'Kham pha them ve', trim: true },
    explore: { type: [storyExploreSchema], default: [] },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Story = mongoose.model('Story', storySchema);
export default Story;
