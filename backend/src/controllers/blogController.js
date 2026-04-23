import Blog from '../models/Blog.js';

export const getBlogs = async (req, res) => {
  try {
    const { isPublished, showOnHome, showOnStoryPage } = req.query;
    let filter = {};

    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (showOnHome !== undefined) filter.showOnHome = showOnHome === 'true';
    if (showOnStoryPage !== undefined) filter.showOnStoryPage = showOnStoryPage === 'true';

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Loi lay danh sach blog', error: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true });
    if (!blog) return res.status(404).json({ message: 'Khong tim thay blog' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Loi lay thong tin blog', error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Slug blog da ton tai, vui long chon slug khac' });
    res.status(400).json({ message: 'Loi tao blog', error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedBlog) return res.status(404).json({ message: 'Khong tim thay blog' });
    res.json(updatedBlog);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: 'Slug blog da ton tai, vui long chon slug khac' });
    res.status(400).json({ message: 'Loi cap nhat blog', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) return res.status(404).json({ message: 'Khong tim thay blog' });
    res.json({ message: 'Xoa blog thanh cong' });
  } catch (error) {
    res.status(500).json({ message: 'Loi xoa blog', error: error.message });
  }
};
