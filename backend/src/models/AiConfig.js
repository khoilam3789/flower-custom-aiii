import mongoose from 'mongoose';

const aiConfigSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, required: true, unique: true, default: 'default' },
    imageProvider: {
      type: String,
      enum: ['auto', 'gemini-only', 'pollinations-only'],
      default: 'auto'
    },
    geminiApiKey: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

const AiConfig = mongoose.model('AiConfig', aiConfigSchema);
export default AiConfig;
