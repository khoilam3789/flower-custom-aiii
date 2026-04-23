import mongoose from 'mongoose';

const blogSectionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['text', 'image'], required: true },
    heading: { type: String, default: '', trim: true },
    content: { type: String, default: '', trim: true },
    imageUrl: { type: String, default: '', trim: true }
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    coverImage: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    summary: { type: String, required: true, trim: true },
    themeColor: { type: String, default: 'bg-pink-300/40', trim: true },
    tableOfContents: { type: [String], default: [] },
    sections: { type: [blogSectionSchema], default: [] },
    showOnHome: { type: Boolean, default: true },
    showOnStoryPage: { type: Boolean, default: true },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
