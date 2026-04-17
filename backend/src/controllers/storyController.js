import Story from '../models/Story.js';

const normalizeSlug = (raw = '') =>
  raw
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const sanitizeLines = (lines = []) =>
  (Array.isArray(lines) ? lines : [])
    .map((line) => String(line || '').trim())
    .filter(Boolean);

const sanitizeColors = (colors = []) =>
  (Array.isArray(colors) ? colors : [])
    .map((item) => ({
      color: String(item?.color || '').trim(),
      icon: String(item?.icon || '').trim(),
      desc: String(item?.desc || '').trim()
    }))
    .filter((item) => item.color && item.icon && item.desc);

const sanitizeExplore = (explore = []) =>
  (Array.isArray(explore) ? explore : [])
    .map((item) => ({
      label: String(item?.label || '').trim(),
      slug: normalizeSlug(item?.slug || item?.label || '')
    }))
    .filter((item) => item.label && item.slug);

const storyPayloadFromBody = (body) => ({
  title: String(body?.title || '').trim(),
  slug: normalizeSlug(body?.slug || body?.title || ''),
  heroImage: String(body?.heroImage || '').trim(),
  subtitle: String(body?.subtitle || '').trim(),
  storyTitle: String(body?.storyTitle || 'Cau chuyen').trim(),
  storyBody: String(body?.storyBody || '').trim(),
  poemTitle: String(body?.poemTitle || '').trim(),
  poemLines: sanitizeLines(body?.poemLines),
  colorsTitle: String(body?.colorsTitle || 'Cac sac mau').trim(),
  colors: sanitizeColors(body?.colors),
  exploreTitle: String(body?.exploreTitle || 'Kham pha them ve').trim(),
  explore: sanitizeExplore(body?.explore),
  isPublished: Boolean(body?.isPublished)
});

export const getStories = async (_req, res) => {
  try {
    const stories = await Story.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminStories = async (_req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStoryBySlug = async (req, res) => {
  try {
    const slug = normalizeSlug(req.params.slug || '');
    const story = await Story.findOne({ slug, isPublished: true });

    if (!story) {
      return res.status(404).json({ message: 'Khong tim thay bai viet' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStory = async (req, res) => {
  try {
    const payload = storyPayloadFromBody(req.body);

    if (!payload.title || !payload.slug || !payload.heroImage) {
      return res.status(400).json({ message: 'Vui long nhap title, slug va heroImage.' });
    }

    const exists = await Story.findOne({ slug: payload.slug });
    if (exists) {
      return res.status(400).json({ message: 'Slug da ton tai, vui long doi slug khac.' });
    }

    const created = await Story.create(payload);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStory = async (req, res) => {
  try {
    const existing = await Story.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Khong tim thay bai viet' });
    }

    const payload = storyPayloadFromBody({ ...existing.toObject(), ...req.body });

    if (!payload.title || !payload.slug || !payload.heroImage) {
      return res.status(400).json({ message: 'Vui long nhap title, slug va heroImage.' });
    }

    const slugOwner = await Story.findOne({ slug: payload.slug });
    if (slugOwner && slugOwner._id.toString() !== existing._id.toString()) {
      return res.status(400).json({ message: 'Slug da ton tai, vui long doi slug khac.' });
    }

    Object.assign(existing, payload);
    const updated = await existing.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Khong tim thay bai viet' });
    }

    await story.deleteOne();
    res.json({ message: 'Da xoa bai viet' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
