import { Link } from "react-router-dom";

const bagImages = [
  "/images/bag/1.png",
  "/images/bag/2.png",
  "/images/bag/3.png",
  "/images/bag/4.png",
  "/images/bag/5.png",
  "/images/bag/6.png",
  "/images/bag/7.png",
  "/images/bag/8.png",
  "/images/bag/9.png"
];

const sections = [
  {
    title: "Túi",
    bgClass: "bg-[#5B8EBD]",
    cards: bagImages.slice(0, 3)
  },
  {
    title: "Túi",
    bgClass: "bg-white",
    cards: bagImages.slice(3, 6)
  },
  {
    title: "Túi",
    bgClass: "bg-[#5B8EBD]",
    cards: bagImages.slice(6, 9)
  }
];

export default function BagGalleryPage() {
  return (
    <div className="w-full bg-Color-3 flex justify-center pb-16 md:pb-24">
      <div className="w-full max-w-[1440px] px-3 md:px-5">
        <section className="pt-6 md:pt-8">
          <div className="mx-auto max-w-[772px] bg-rose-700/50 px-4 py-3 text-center">
            <p className="text-white text-sm md:text-lg font-light font-['Geologica'] leading-6 md:leading-7">
              Đây là website phục vụ môn học Digital Marketing và không nhằm mục đích thương mại
            </p>
          </div>
        </section>

        <div className="mt-5 md:mt-8 overflow-hidden rounded-[8px] border border-white/70">
          {sections.map((section, sectionIndex) => (
            <section
              key={`${section.title}-${sectionIndex}`}
              className={`${section.bgClass} px-4 md:px-10 py-8 md:py-12`}
            >
              <h2 className="text-rose-700 text-4xl md:text-5xl font-normal font-['Geologica'] tracking-widest leading-tight">
                {section.title}
              </h2>

              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                {section.cards.map((image, index) => (
                  <article
                    key={`${image}-${index}`}
                    className="mx-auto w-full max-w-[260px] bg-[#5B8EBD] p-4 md:p-5"
                  >
                    <img
                      src={image}
                      alt={`Túi mẫu ${sectionIndex * 3 + index + 1}`}
                      className="w-full h-[280px] md:h-[320px] object-contain bg-white"
                    />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            to="/custom-flowers"
            className="rounded-full bg-rose-700 text-white px-8 py-3 md:px-10 md:py-4 text-base md:text-xl font-semibold font-['Geologica'] border-4 border-white"
          >
            Bắt đầu thiết kế ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
