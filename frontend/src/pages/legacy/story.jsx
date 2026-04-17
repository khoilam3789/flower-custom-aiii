import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../../api";

const defaultStory = {
  title: "Ý nghĩa của hoa mẫu đơn",
  slug: "hoa-mau-don",
  heroImage: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop",
  subtitle: "Sự nở rộ của hạnh phúc, hoàn mỹ, thịnh vượng và phú quý",
  storyTitle: "Câu chuyện",
  storyBody:
    "Tương truyền rằng, Trung Quốc ngày xưa chỉ có trong cung của vua chúa mới được trồng loài hoa này. Ngoài ý nghĩa về sự vương giả, mẫu đơn tại Nhật còn được xem là loài hoa của hạnh phúc gia đình. Trong văn hóa phương Tây, chúng thường được liên kết với sự lãng mạn, thịnh vượng và e thẹn.",
  poemTitle: "Bài thơ: Mẫu đơn",
  poemLines: [
    "Mẫu đơn yêu diễm loạn nhân tâm,",
    "Nhất quốc như cuồng bất tích kim.",
    "Hạt nhược đông viên đào dữ lý,",
    "Quả thành vô ngữ tự thuỳ âm."
  ],
  colorsTitle: "Các sắc màu của mẫu đơn",
  colors: [
    { color: "Xanh", icon: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=50&h=50&fit=crop", desc: "sự tươi mát, êm đềm, niềm tin, hy vọng" },
    { color: "Hồng", icon: "https://images.unsplash.com/photo-1549472350-dfd358178122?w=50&h=50&fit=crop", desc: "tình mẫu tử, sự bao dung, lòng nhân ái và sự thấu hiểu" },
    { color: "Đỏ", icon: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=50&h=50&fit=crop", desc: "sự may mắn, giàu sang, quyền lực" },
    { color: "Trắng", icon: "https://images.unsplash.com/photo-1490750967868-88cb44cb2ecd?w=50&h=50&fit=crop", desc: "sự tinh khôi, thuần khiết, chân thành" }
  ],
  exploreTitle: "Khám phá thêm về",
  explore: [
    { label: "Linh Lan", slug: "linh-lan" },
    { label: "Hoa Sen", slug: "hoa-sen" },
    { label: "Hoa Ly", slug: "hoa-ly" },
    { label: "Hoa Tulip", slug: "hoa-tulip" },
    { label: "Cam Tu Cau", slug: "cam-tu-cau" },
    { label: "Huong Duong", slug: "huong-duong" },
    { label: "Cuc Dong Tien", slug: "cuc-dong-tien" },
    { label: "Hoa Hong", slug: "hoa-hong" }
  ]
};

const normalizeCommonVietnamese = (value, fallback = "") => {
  const text = String(value || "").trim();
  if (!text) return fallback;

  const map = {
    "Cau chuyen": "Câu chuyện",
    "Cac sac mau": "Các sắc màu",
    "Cac sac mau cua mau don": "Các sắc màu của mẫu đơn",
    "Kham pha them ve": "Khám phá thêm về"
  };

  return map[text] || text;
};

const shadowClassByIndex = [
  "shadow-blue-200",
  "shadow-pink-200",
  "shadow-red-300",
  "shadow-slate-200",
  "shadow-purple-200",
  "shadow-yellow-200"
];

export default function Story() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(defaultStory);
  const [storyList, setStoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  const storySlug = useMemo(() => slug || "hoa-mau-don", [slug]);

  useEffect(() => {
    const fetchStoryList = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/stories`);
        if (!response.ok) return;
        const data = await response.json();
        if (Array.isArray(data)) {
          setStoryList(data);
        }
      } catch (_error) {
        // Keep UI usable with current story even if list endpoint fails.
      }
    };

    fetchStoryList();
  }, []);

  useEffect(() => {
    const fetchStory = async () => {
      // Route /story khong co slug: tu dong tro den bai dau tien trong danh sach story.
      if (!slug) {
        setLoading(true);
        setNotFound(false);
        setLoadError("");
        try {
          const listResponse = await fetch(`${API_BASE}/api/stories`);
          if (listResponse.ok) {
            const stories = await listResponse.json();
            const firstStory = Array.isArray(stories) && stories.length > 0 ? stories[0] : null;
            if (firstStory?.slug) {
              navigate(`/story/${firstStory.slug}`, { replace: true });
              return;
            }
          }
          // Neu danh sach rong thi fallback ve bai mac dinh.
          setStory(defaultStory);
        } catch (_error) {
          setStory(defaultStory);
        } finally {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setNotFound(false);
      setLoadError("");

      try {
        const response = await fetch(`${API_BASE}/api/stories/${encodeURIComponent(storySlug)}`);
        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            setLoadError(`Khong tai duoc noi dung (HTTP ${response.status})`);
          }
          return;
        }

        const data = await response.json();
        setStory(data);
      } catch (_error) {
        setLoadError("Khong ket noi duoc den server story");
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storySlug, slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-Color-3 flex items-center justify-center px-6">
        <div className="text-slate-600 font-semibold">Dang tai noi dung story...</div>
      </div>
    );
  }

  if (notFound || loadError) {
    return (
      <div className="w-full min-h-screen bg-Color-3 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-slate-800">Khong tim thay trang story</h1>
          {slug && <p className="text-slate-500 mt-3">Slug dang mo: <span className="font-semibold text-slate-700">{slug}</span></p>}
          {loadError && <p className="text-rose-700 mt-2">{loadError}</p>}
          <p className="text-slate-500 mt-3">Hay kiem tra lai slug trong Admin - Story Pages va bat Public cho bai viet.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link to="/admin?tab=stories" className="px-4 py-2 rounded-lg bg-rose-700 text-white font-semibold hover:bg-rose-800 transition">Mo Admin Story</Link>
            <Link to="/story" className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition">Ve trang mac dinh</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fbf5f1] pb-24">
      <section className="px-4 pt-6 md:px-8 lg:px-10">
        <div className="max-w-[1180px] mx-auto rounded-2xl bg-rose-700/85 text-white text-center py-3 px-4 font-['Geologica'] text-sm md:text-base font-light tracking-wide">
          Đây là website phục vụ môn học Digital Marketing và không nhằm mục đích thương mại
        </div>
      </section>

      <section className="relative mt-6 px-4 md:px-8 lg:px-10">
        <div className="max-w-[1180px] mx-auto rounded-[32px] overflow-hidden shadow-[0_30px_90px_-40px_rgba(159,18,57,0.55)] border border-white/60 bg-white">
          <div className="relative min-h-[500px] md:min-h-[560px] flex items-end">
            <img src={story.heroImage} alt={story.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f0e15]/80 via-[#3b1a24]/35 to-transparent" />

            <div className="relative z-10 w-full p-6 md:p-12 text-center">
              <p className="text-white/80 uppercase tracking-[0.24em] text-xs md:text-sm font-['Geologica'] mb-3">Triển lãm</p>
              <h1 className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-['Italianno'] leading-none drop-shadow-md">
                {story.title}
              </h1>
              <p className="mt-5 max-w-3xl mx-auto text-white/90 text-base md:text-2xl font-light font-['Geologica'] leading-relaxed">
                {story.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to={`/story/${story.slug || storySlug}`}
                  className="rounded-full bg-rose-700 hover:bg-rose-800 text-white px-7 py-3 font-semibold font-['Geologica'] transition"
                >
                  Đọc câu chuyện
                </Link>
                <a
                  href="#y-nghia"
                  className="rounded-full bg-white/90 text-rose-700 hover:bg-white px-7 py-3 font-semibold font-['Geologica'] transition"
                >
                  Xem ý nghĩa
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-4 md:px-8 lg:px-10 mt-16 relative z-10">
        <div className="absolute -top-6 -left-2 md:left-10 w-36 h-36 bg-[#bfd8ea]/45 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-8 right-6 w-44 h-44 bg-rose-200/45 rounded-full blur-2xl"></div>

        <div className="relative bg-gradient-to-br from-white via-[#fff8fb] to-[#f8f1ff] rounded-[32px] px-6 py-10 md:px-12 md:py-14 shadow-[0_28px_70px_-50px_rgba(15,23,42,0.65)] border border-rose-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-3 h-12 bg-rose-700 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl text-rose-700 font-['Geologica'] font-light">
              {normalizeCommonVietnamese(story.storyTitle, "Câu chuyện")}
            </h2>
          </div>

          <p className="text-justify font-light text-black/80 font-['Geologica'] leading-loose text-base md:text-lg">
            {story.storyBody}
          </p>

          {story.poemLines?.length > 0 && (
            <div className="mt-10 rounded-2xl bg-white/70 border border-rose-100 px-5 py-6 text-center italic font-light font-['Geologica'] space-y-2 text-black/80">
              <p className="font-medium not-italic text-rose-700">{story.poemTitle}</p>
              {story.poemLines.map((line, idx) => (
                <p key={`${line}-${idx}`}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-4 md:px-8 lg:px-10 mt-20">
        <div className="flex items-end gap-4 mb-10">
          <div className="w-3 h-12 bg-rose-700 rounded-full"></div>
          <h2 className="text-3xl md:text-4xl text-rose-700 font-['Geologica']">
            {normalizeCommonVietnamese(story.colorsTitle, "Các sắc màu")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
          {story.colors?.map((item, index) => (
            <article
              key={`${item.color}-${index}`}
              className={`group flex items-center bg-white rounded-3xl p-3 pr-5 shadow-lg border border-rose-50 hover:-translate-y-0.5 transition ${shadowClassByIndex[index % shadowClassByIndex.length]}`}
            >
              <img src={item.icon} alt={item.color} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white shadow-sm" />
              <p className="ml-4 font-light text-black/80 text-sm md:text-base font-['Geologica'] leading-relaxed">
                <span className="font-bold text-rose-700">{item.color}</span> - {item.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {storyList.length > 0 && (
        <section id="y-nghia" className="max-w-[1180px] mx-auto px-4 md:px-8 lg:px-10 mt-24">
          <div className="text-center mb-10">
            <h2 className="text-5xl md:text-6xl text-rose-700 font-['Italianno'] leading-none">Ý Nghĩa</h2>
            <p className="text-black/70 mt-3 font-['Geologica'] text-sm md:text-base">Danh sách các loài hoa và thông điệp nổi bật</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {storyList.map((item) => (
              <article
                key={item._id || item.slug}
                className="group bg-white rounded-[28px] border border-rose-100 shadow-[0_20px_55px_-45px_rgba(15,23,42,0.9)] overflow-hidden hover:-translate-y-1 transition"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.heroImage}
                    alt={item.title}
                    className="w-full h-56 object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-black font-['Geologica'] line-clamp-2 min-h-[56px]">{item.title}</h3>
                  <p className="text-sm text-black/70 mt-3 font-['Geologica'] line-clamp-4 min-h-[84px]">
                    {item.subtitle || item.storyBody || "Khám phá ý nghĩa và câu chuyện phía sau loài hoa này."}
                  </p>
                  <Link
                    to={`/story/${item.slug}`}
                    className="inline-flex items-center gap-2 mt-5 rounded-full bg-rose-700 text-white px-4 py-2 font-semibold font-['Geologica'] hover:bg-rose-800 transition"
                  >
                    Đọc thêm
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-[1180px] mx-auto px-4 md:px-8 lg:px-10 mt-24 text-center">
        <h2 className="text-4xl md:text-5xl text-[#598CBC] font-['Italianno'] mb-3">
          {normalizeCommonVietnamese(story.exploreTitle, "Khám phá thêm về")}
        </h2>
        <p className="font-['Geologica'] text-black/65 mb-10">Chi tiết những hoa khác</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {(story.explore || []).map((item, index) => (
            <Link
              to={`/story/${item.slug}`}
              key={`${item.slug}-${index}`}
              className="group bg-white py-3 px-3 rounded-2xl border border-rose-200/70 text-black/85 font-semibold font-['Geologica'] hover:bg-rose-700 hover:text-white transition shadow-sm hover:shadow-lg"
            >
              <span className="inline-block group-hover:translate-x-0.5 transition">{item.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
