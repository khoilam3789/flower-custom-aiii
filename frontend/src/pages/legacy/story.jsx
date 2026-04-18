import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

const exhibitionImages = [
  "/images/story/1.png",
  "/images/story/2.png",
  "/images/story/3.png",
  "/images/story/4.png"
];

const overviewBlogs = [
  {
    title: "Ý nghĩa các loài hoa trong ngày Valentine: Chọn hoa tặng người thương sao cho đúng?",
    excerpt: "Hoa hồng được mệnh danh là nữ hoàng của các loài hoa. Theo thần thoại Hy Lạp, hoa hồng không chỉ là một loài hoa bình thường mà được tạo ra từ chính các vị thần...",
    date: "12/3/2026",
    image: "/images/blog1/anh1.png",
    link: "/blog-1"
  },
  {
    title: "Túi hoa tự thiết kế: Khi việc mang hoa trở thành một trải nghiệm trọn vẹn",
    excerpt: "Một bó hoa luôn mang theo những cảm xúc đẹp. Đó có thể là lời yêu, sự trân trọng, hay đơn giản là một khoảnh khắc muốn lưu giữ...",
    date: "24/2/2026",
    image: "/images/blog2/anh1.png",
    link: "/blog-2"
  },
  {
    title: "Cách bảo quản hoa tươi: Giữ trọn vẻ đẹp và cảm xúc theo thời gian",
    excerpt: "Một bó hoa không chỉ đẹp ở khoảnh khắc được trao đi, mà còn nằm ở cách nó được nâng niu và gìn giữ sau đó...",
    date: "20/12/2026",
    image: "/images/blog3/anh1.png",
    link: "/blog-3"
  }
];

export default function Story() {
  const { slug } = useParams();
  const [story, setStory] = useState(defaultStory);
  const [overviewStories, setOverviewStories] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  const storySlug = useMemo(() => slug || "", [slug]);

  useEffect(() => {
    let isMounted = true;

    const fetchOverviewStories = async () => {
      setOverviewLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/stories`);
        if (!response.ok) {
          if (isMounted) setOverviewStories([]);
          return;
        }

        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setOverviewStories(data.filter((item) => item?.slug));
        }
      } catch (_error) {
        if (isMounted) setOverviewStories([]);
      } finally {
        if (isMounted) setOverviewLoading(false);
      }
    };

    fetchOverviewStories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchStory = async () => {
      // Route /story khong co slug: hien thi trang tong quan Ngon Ngu Hoa.
      if (!slug) {
        setLoading(false);
        setNotFound(false);
        setLoadError("");
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

  if (!slug) {
    return (
      <div className="w-full bg-Color-3 pb-24">
        <section className="max-w-[1180px] mx-auto px-4 md:px-8 lg:px-10 mt-10">
          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-7xl text-rose-700 font-semibold font-['Gowun_Batang']">Triển Lãm</h1>
            <p className="mt-4 text-rose-700/90 text-lg md:text-2xl font-normal font-['Geologica']">
              Đủ nắng hoa sẽ nở, đủ gió mây sẽ bay và đủ yêu thương hạnh phúc sẽ đong đầy!
            </p>
          </div>

          <div className="rounded-[30px] bg-gradient-to-r from-[#fbe8e1] via-[#f7f4ff] to-[#e8f3ff] p-4 md:p-6 border border-white shadow-[0_25px_60px_-45px_rgba(2,6,23,0.85)]">
            <div className="overflow-x-auto pb-2">
              <div className="inline-flex items-center gap-6 md:gap-14 min-w-max mx-auto">
                {exhibitionImages.slice(0, 4).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`Triển lãm ${index + 1}`}
                  className="w-[280px] md:w-[340px] lg:w-96 h-[420px] md:h-[500px] lg:h-[541px] object-cover rounded-2xl shadow-md"
                />
              ))}
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                type="button"
                className="rounded-full bg-rose-700 text-white px-8 py-3 md:px-10 md:py-4 text-base md:text-xl font-semibold font-['Geologica'] border-4 border-white"
              >
                Khám phá khu vườn đa sắc màu
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10 mt-20">
          <div className="text-center mb-10">
            <h2 className="text-6xl md:text-7xl text-rose-700 font-normal font-['Goudy_Bookletter_1911'] leading-tight">Ý Nghĩa</h2>
          </div>

          {overviewLoading ? (
            <div className="text-center text-slate-600 font-['Geologica']">Đang tải danh sách ý nghĩa...</div>
          ) : overviewStories.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
              {overviewStories.map((item, index) => (
                <article
                  key={item._id || `${item.slug}-${index}`}
                  className="relative h-[340px] md:h-[380px] border-[6px] border-[#C26A74] rounded-sm overflow-hidden"
                  style={{
                    backgroundImage: "url('/images/story/anhnen.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                >
                  <div className="absolute inset-0 bg-white/35"></div>

                  <img
                    src={item.heroImage || defaultStory.heroImage}
                    alt={item.title || 'Story'}
                    className="absolute left-0 top-0 z-10 h-full w-[132px] md:w-[164px] object-cover object-bottom"
                  />

                  <div className="relative z-20 h-full pl-[142px] md:pl-[176px] pr-4 md:pr-5 py-4 md:py-5 flex flex-col">
                    <h3 className="text-3xl md:text-4xl text-black font-normal font-['Geologica'] italic">
                      {item.title || 'Story'}
                    </h3>
                    <p className="mt-3 text-black text-xl md:text-2xl font-extralight font-['Geologica'] leading-8 text-justify line-clamp-5 md:line-clamp-6">
                      {item.subtitle || item.storyBody || 'Khám phá ý nghĩa của loài hoa này.'}
                    </p>
                    <Link
                      to={`/story/${item.slug}`}
                      className="mt-4 inline-flex self-start items-center justify-center rounded-full border-2 border-slate-500 bg-white/50 px-7 py-2 text-black text-2xl font-extralight font-['Geologica'] hover:bg-rose-700 hover:text-white hover:border-rose-700 transition"
                    >
                      Đọc thêm
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-600 font-['Geologica']">Chưa có dữ liệu story để hiển thị.</div>
          )}

          <div className="mt-8 md:mt-10 text-center">
            <button
              type="button"
              className="rounded-full bg-rose-700 border-[5px] border-white px-8 md:px-12 py-3 text-white text-2xl md:text-3xl font-semibold font-['Geologica']"
            >
              Chi tiết những hoa khác
            </button>
          </div>
        </section>

        <section className="max-w-[1180px] mx-auto px-4 md:px-8 lg:px-10 mt-24">
          <div className="relative rounded-[32px] overflow-hidden border border-white/70 shadow-[0_26px_70px_-50px_rgba(15,23,42,0.95)]">
            <img
              src="https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=1600&h=640&fit=crop"
              alt="Dear, Chérie Blog"
              className="w-full h-72 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/40"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center px-6 text-center">
              <h2 className="text-white text-5xl md:text-7xl font-['Italianno'] leading-none">Dear, Chérie’s Blog</h2>
              <p className="mt-4 max-w-3xl text-white/90 text-base md:text-2xl font-extralight font-['Geologica'] tracking-wide">
                Sự nở rộ của hạnh phúc, hoàn mỹ, thịnh vượng và phú quý
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {overviewBlogs.map((post, index) => (
              <article key={`${post.title}-${index}`} className="bg-white rounded-[28px] border border-rose-100 overflow-hidden shadow-sm">
                <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-black text-base font-medium font-['Geologica'] leading-6 line-clamp-3 min-h-[72px]">{post.title}</h3>
                  <p className="text-black/75 text-sm font-extralight font-['Geologica'] leading-6 mt-3 line-clamp-4 min-h-[96px]">{post.excerpt}</p>
                  <div className="mt-4 pt-3 border-t border-rose-200 flex items-center justify-between gap-4">
                    <span className="text-black/75 text-sm font-extralight font-['Geologica']">{post.date}</span>
                    <Link to={post.link} className="text-rose-700 text-sm font-semibold font-['Geologica'] hover:underline">
                      Đọc chi tiết
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
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
    <div className="w-full bg-Color-3 pb-24">
        <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-14 flex flex-col items-center text-center">
          <div className="mb-8 w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-slate-500/20">
            <img src={story.heroImage} alt={story.title} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-5xl md:text-6xl text-rose-700 font-['Italianno'] mb-3 leading-none">{story.title}</h1>
          <p className="text-xl md:text-3xl font-extralight text-black/80 font-['Geologica'] tracking-wide">{story.subtitle}</p>
        </section>

        <section className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
          <div className="bg-white/80 rounded-[30px] p-8 md:p-12 shadow-[inset_5px_5px_70px_0px_rgba(175,46,56,0.35)] border-[3px] border-slate-500/70 relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-12 bg-rose-700 blur-[1px]"></div>
              <h2 className="text-4xl md:text-5xl text-rose-700 font-normal font-['Geologica'] tracking-wide">
                {normalizeCommonVietnamese(story.storyTitle, "Câu chuyện")}
              </h2>
            </div>

            <p className="text-justify text-black/80 text-lg md:text-2xl font-extralight font-['Geologica'] leading-relaxed tracking-wide">
              {story.storyBody}
            </p>

            {story.poemLines?.length > 0 && (
              <div className="mt-8 text-center italic font-light font-['Geologica'] space-y-2 text-black/80">
                <p className="font-medium text-rose-700 not-italic">{story.poemTitle}</p>
                {story.poemLines.map((line, idx) => (
                  <p key={`${line}-${idx}`}>{line}</p>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-6 md:px-12 mt-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-12 bg-rose-700 blur-[1px]"></div>
            <h2 className="text-4xl md:text-5xl text-rose-700 font-normal font-['Geologica'] tracking-wide">
              {normalizeCommonVietnamese(story.colorsTitle, "Các sắc màu")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {story.colors?.map((item, index) => (
              <article
                key={`${item.color}-${index}`}
                className={`bg-white rounded-[30px] px-5 py-4 shadow-lg border border-rose-50 ${shadowClassByIndex[index % shadowClassByIndex.length]}`}
              >
                <div className="flex items-center gap-4">
                  <img src={item.icon} alt={item.color} className="w-14 h-14 rounded-full object-cover" />
                  <p className="text-black/80 text-lg font-normal font-['Geologica'] leading-7 tracking-wide">
                    <span className="font-semibold">{item.color}</span> - {item.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-6 md:px-12 mt-14 text-center">
          <h2 className="text-5xl md:text-6xl text-blue-600 font-normal font-['Italianno'] tracking-widest mb-8">
            {normalizeCommonVietnamese(story.exploreTitle, "Khám phá thêm về")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(story.explore || []).map((item, index) => (
              <Link
                key={`${item.slug}-${index}`}
                to={`/story/${item.slug}`}
                className="bg-white rounded-[10px] py-6 text-black/80 text-xl font-bold font-['Geologica'] leading-9 tracking-wide shadow-[0px_4px_4px_0px_rgba(175,46,56,0.50)] hover:bg-rose-700 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
  );
}
