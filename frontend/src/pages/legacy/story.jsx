import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE } from "../../api";

const defaultStory = {
  title: "Y nghia cua hoa mau don",
  slug: "hoa-mau-don",
  heroImage: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=300&h=300&fit=crop",
  subtitle: "Su no ro cua hanh phuc, hoan my, thinh vuong va phu quy",
  storyTitle: "Cau chuyen",
  storyBody:
    "Tuong truyen rang, Trung Quoc ngay xua chi co trong cung cua vua chua moi duoc trong loai hoa nay. Ngoai y nghia ve su vuong gia, mau don tai Nhat con duoc xem la loai hoa cua hanh phuc gia dinh. Trong van hoa phuong Tay, chung thuong duoc lien ket voi su lang man, thinh vuong va e then.",
  poemTitle: "Bai tho: Mau don",
  poemLines: [
    "Mau don yeu diem loan nhan tam,",
    "Nhat quoc nhu cuong bat tich kim.",
    "Hat nhuoc dong vien dao du ly,",
    "Qua thanh vo ngu tu thuy am."
  ],
  colorsTitle: "Cac sac mau cua mau don",
  colors: [
    { color: "Xanh", icon: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=50&h=50&fit=crop", desc: "su tuoi mat, em dem, niem tin, hy vong" },
    { color: "Hong", icon: "https://images.unsplash.com/photo-1549472350-dfd358178122?w=50&h=50&fit=crop", desc: "tinh mau tu, su bao dung, long nhan ai va su thau hieu" },
    { color: "Do", icon: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=50&h=50&fit=crop", desc: "su may man, giau sang, quyen luc" },
    { color: "Trang", icon: "https://images.unsplash.com/photo-1490750967868-88cb44cb2ecd?w=50&h=50&fit=crop", desc: "su tinh khoi, thuan khiet, chan thanh" }
  ],
  exploreTitle: "Kham pha them ve",
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
  const [story, setStory] = useState(defaultStory);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  const storySlug = useMemo(() => slug || "hoa-mau-don", [slug]);

  useEffect(() => {
    const fetchStory = async () => {
      // Route /story khong co slug thi dung trang mau mac dinh.
      if (!slug) {
        setStory(defaultStory);
        setNotFound(false);
        setLoadError("");
        setLoading(false);
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
    <div className="w-full flex-col bg-Color-3 pb-24">
      <section className="max-w-[1280px] mx-auto px-12 md:px-24 py-16 flex flex-col items-center text-center">
        <div className="mb-8 w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-slate-500/20">
          <img src={story.heroImage} alt={story.title} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-6xl md:text-7xl text-rose-700 font-['Italianno'] mb-4 leading-none">{story.title}</h1>
        <p className="text-xl md:text-2xl font-light text-black/80 font-['Geologica'] drop-shadow-sm">{story.subtitle}</p>
      </section>

      <section className="max-w-[1280px] mx-auto px-12 md:px-24 relative z-10">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-slate-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-rose-700/10 rounded-full blur-2xl"></div>

        <div className="bg-gradient-to-br from-white via-[#fcf6f8] to-[#f2ecf3] rounded-3xl p-12 md:p-16 shadow-lg border border-red-50 relative">
          <div className="absolute top-4 left-12 flex">
            <div className="w-4 h-12 bg-rose-700 mr-3"></div>
            <h2 className="text-4xl text-rose-700 font-['Geologica'] flex items-end font-light">{story.storyTitle || "Cau chuyen"}</h2>
          </div>

          <p className="text-justify font-light text-black/80 font-['Geologica'] leading-loose mb-10 text-lg mt-6">
            {story.storyBody}
          </p>

          {story.poemLines?.length > 0 && (
            <div className="text-center italic font-light font-['Geologica'] space-y-2 text-black/80">
              <p className="font-medium text-rose-700">{story.poemTitle}</p>
              {story.poemLines.map((line, idx) => (
                <p key={`${line}-${idx}`}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-12 md:px-24 mt-24">
        <div className="flex mb-12">
          <div className="w-4 h-12 bg-rose-700 mr-3"></div>
          <h2 className="text-4xl text-rose-700 font-['Geologica'] flex items-end">{story.colorsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {story.colors?.map((item, index) => (
            <div
              key={`${item.color}-${index}`}
              className={`flex items-center bg-white rounded-full p-2 pr-6 shadow-lg border border-white/40 hover:scale-[1.02] transition cursor-default ${shadowClassByIndex[index % shadowClassByIndex.length]}`}
            >
              <img src={item.icon} alt={item.color} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
              <p className="ml-4 font-light text-black/80 text-sm md:text-base">
                <span className="font-bold">{item.color} </span> - {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto px-12 md:px-24 mt-32 text-center">
        <h2 className="text-5xl text-[#598CBC] font-['Italianno'] mb-12">{story.exploreTitle}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(story.explore || []).map((item, index) => (
            <Link
              to={`/story/${item.slug}`}
              key={`${item.slug}-${index}`}
              className="bg-white/80 py-4 rounded-xl border border-rose-700/30 border-dashed text-black/80 font-bold hover:bg-rose-700 hover:text-white transition shadow-sm hover:shadow-md"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
