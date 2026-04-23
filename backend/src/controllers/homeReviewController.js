import HomeReviewConfig from "../models/HomeReviewConfig.js";

const DEFAULT_HOME_REVIEW_CONFIG = {
  sectionTitle: "ĐÁNH GIÁ TỪ HỘI YÊU HOA",
  reviews: [
    {
      name: "Đỗ Thị Hà",
      age: 22,
      role: "Sinh viên",
      imageUrl: "/images/anhnguoi/1.jpg",
      content:
        "Túi giữ form hoa rất tốt, nhìn gọn gàng và tinh tế hơn nhiều. Mình mang đi chụp ảnh thấy tổng thể đẹp hơn hẳn, không còn cảm giác cầm bó hoa bị lạc quẻ nữa. Quan trọng là bó hoa vẫn giữ được vẻ đẹp ban đầu, nhìn lúc nào cũng chỉn chu.",
      isActive: true
    },
    {
      name: "Trần Thanh Tú",
      age: 25,
      role: "Lập trình viên",
      imageUrl: "/images/anhnguoi/2.jpg",
      content:
        "Lần đầu tặng hoa mà thấy thật sự có ý nghĩa. Mình chọn hoa hồng đỏ vì muốn nói điều mà bình thường khó nói thành lời. Lúc trao hoa, thấy người ấy hiểu ngay ý mình mà không cần nói nhiều. Có thêm túi nên mọi thứ gọn gàng, tinh tế hơn với bạn ấy, không cần cầm cả bó vướng víu.",
      isActive: true
    },
    {
      name: "Ngô Thùy Linh",
      age: 30,
      role: "Doanh nhân",
      imageUrl: "/images/anhnguoi/3.jpg",
      content:
        "Ban đầu mình chỉ định đặt nhanh một bó hoa thôi, nhưng lúc được tự mình chọn từng loại hoa, màu sắc với ý nghĩa, tự nhiên thấy rất thú vị. Cảm giác như mình đang tự tay thiết kế một bó hoa mang đúng thông điệp của mình vậy.",
      isActive: true
    }
  ]
};

const sanitizeReview = (raw = {}) => ({
  name: String(raw?.name || "").trim(),
  age: raw?.age === "" || raw?.age === null || raw?.age === undefined ? null : Number(raw.age),
  role: String(raw?.role || "").trim(),
  imageUrl: String(raw?.imageUrl || "").trim(),
  content: String(raw?.content || "").trim(),
  isActive: raw?.isActive !== false
});

const sanitizePayload = (body = {}) => {
  const sectionTitle = String(body?.sectionTitle || DEFAULT_HOME_REVIEW_CONFIG.sectionTitle).trim();

  const reviews = (Array.isArray(body?.reviews) ? body.reviews : [])
    .map((item) => sanitizeReview(item))
    .filter((item) => item.name && item.imageUrl && item.content);

  return {
    sectionTitle: sectionTitle || DEFAULT_HOME_REVIEW_CONFIG.sectionTitle,
    reviews
  };
};

const getOrCreateConfig = async () => {
  let config = await HomeReviewConfig.findOne({ singletonKey: "default" });
  if (!config) {
    config = await HomeReviewConfig.create({
      singletonKey: "default",
      ...DEFAULT_HOME_REVIEW_CONFIG
    });
  }
  return config;
};

export const getPublicHomeReviews = async (_req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json({
      sectionTitle: config.sectionTitle,
      reviews: (config.reviews || []).filter((item) => item.isActive !== false)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminHomeReviews = async (_req, res) => {
  try {
    const config = await getOrCreateConfig();
    res.json({
      sectionTitle: config.sectionTitle,
      reviews: config.reviews || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminHomeReviews = async (req, res) => {
  try {
    const payload = sanitizePayload(req.body);
    const updated = await HomeReviewConfig.findOneAndUpdate(
      { singletonKey: "default" },
      {
        singletonKey: "default",
        sectionTitle: payload.sectionTitle,
        reviews: payload.reviews
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({
      sectionTitle: updated.sectionTitle,
      reviews: updated.reviews || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
