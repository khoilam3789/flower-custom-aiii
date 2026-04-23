import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../../api";

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-slate-500 text-xl font-['Geologica']">Đang tải bài viết...</div>;
  if (!blog) return <div className="text-center py-20 text-slate-500 text-xl font-['Geologica']">Không tìm thấy bài viết</div>;

  return (
    <div className="w-full bg-Color-3 pb-24 pt-10">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 lg:px-10">
        <section className={`relative rounded-[28px] ${blog.themeColor || 'bg-pink-300/40'} border border-red-50 p-6 md:p-8`}>
          <h1 className="text-2xl md:text-5xl text-rose-700 font-bold font-['Gentium_Book_Plus'] leading-tight md:leading-[60px]">
            {blog.title}
          </h1>
          <p className="mt-6 text-black text-base md:text-2xl font-thin font-['Geologica'] leading-7 md:leading-8 text-justify whitespace-pre-line">
            {blog.summary}
          </p>
        </section>

        {blog.tableOfContents && blog.tableOfContents.length > 0 && (
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className={`lg:col-span-2 ${blog.themeColor || 'bg-pink-300/40'} rounded-[30px] border border-slate-500 p-6 md:p-8`}>
              <h2 className="text-slate-500 text-2xl md:text-4xl font-extrabold font-['Geologica'] leading-tight">MỤC LỤC BÀI VIẾT</h2>
              <div className="h-[2px] bg-slate-500 mt-4 mb-5"></div>
              <div className="text-black text-base md:text-2xl font-thin font-['Geologica'] leading-8 space-y-2">
                {blog.tableOfContents.map((item, idx) => (
                  <p key={idx}>{item}</p>
                ))}
              </div>
            </article>

            <aside className="bg-slate-500 rounded-[30px] border border-red-50 p-6 md:p-7 flex flex-col justify-center text-center">
              <h3 className="text-white text-2xl md:text-3xl font-bold font-['Geologica'] leading-tight">
                Bạn muốn chọn một bó hoa độc đáo để tặng cho người thương?
              </h3>
              <p className="mt-4 text-white text-sm md:text-base font-thin font-['Geologica'] leading-5">
                Tự tay tạo bó hoa của chính mình cùng Dear, Chérie
              </p>
              <Link
                to="/custom-flowers"
                className="mt-6 inline-flex items-center justify-center bg-white rounded-[30px] px-8 py-3 text-slate-500 text-xl md:text-2xl font-bold font-['Geologica'] hover:bg-rose-50 transition"
              >
                TẠO NGAY
              </Link>
            </aside>
          </section>
        )}

        {blog.sections && blog.sections.map((section, idx) => (
          <div key={idx}>
            {section.type === 'text' && (
              <section className="mt-8">
                {section.heading && (
                  <>
                    <h2 className="text-slate-500 text-2xl md:text-4xl font-bold font-['Google_Sans_Flex'] leading-tight">
                      {section.heading}
                    </h2>
                    <div className="h-[2px] bg-slate-500 mt-3 mb-5 max-w-[760px]"></div>
                  </>
                )}
                {section.content && (
                  <p className="text-black text-base md:text-2xl font-thin font-['Geologica'] leading-7 md:leading-8 text-justify whitespace-pre-line">
                    {section.content}
                  </p>
                )}
              </section>
            )}
            
            {section.type === 'image' && section.imageUrl && (
              <section className="mt-8 rounded-[30px] overflow-hidden border border-red-50 flex items-center justify-center">
                <img src={section.imageUrl} alt={section.heading || "Blog Image"} className="w-full h-auto object-cover" />
              </section>
            )}
          </div>
        ))}

        {blog.date && (
          <div className="mt-8 text-right text-black text-xl md:text-2xl font-bold font-['Geologica']">{blog.date}</div>
        )}
      </div>
    </div>
  );
}
