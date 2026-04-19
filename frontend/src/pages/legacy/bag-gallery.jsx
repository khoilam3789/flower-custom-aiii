import { Link } from "react-router-dom";

const bagRows = [
  {
    title: "Túi Petalé",
    bgClass: "bg-[#F2BEBE]/20",
    imageClass: "bg-[#FBFAF7]",
    cards: [
      "/images/bag/1.png",
      "/images/bag/2.png",
      "/images/bag/3.png"
    ]
  },
  {
    title: "Túi Blooming Heart",
    bgClass: "bg-white",
    imageClass: "bg-[#F9EEEC]",
    cards: [
      "/images/bag/4.png",
      "/images/bag/5.png",
      "/images/bag/6.png"
    ]
  },
  {
    title: "Túi La vie en rose",
    bgClass: "bg-[#F9EEEC]",
    imageClass: "bg-[#FBFAF7]",
    cards: [
      "/images/bag/7.png",
      "/images/bag/8.png",
      "/images/bag/9.png"
    ]
  }
];

export default function BagGalleryPage() {
  return (
    <div className="w-full bg-Color-3 pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-[1440px] px-3 md:px-10 pt-6 md:pt-10">
        <section className="overflow-hidden rounded-[10px] border border-[#D9D9D9]">
          {bagRows.map((row) => (
            <div key={row.title} className={`${row.bgClass} px-4 md:px-12 py-8 md:py-12`}>
              <h2 className="text-rose-700 text-4xl md:text-6xl font-normal font-['Italianno'] leading-[1.1] tracking-[2.56px] text-center md:text-right pr-0 md:pr-10">
                {row.title}
              </h2>

              <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                {row.cards.map((image, index) => (
                  <article
                    key={`${row.title}-${index}`}
                    className={`rounded-full ${row.imageClass} p-5 md:p-8 shadow-[0_8px_24px_rgba(30,30,30,0.1)]`}
                  >
                    <img
                      src={image}
                      alt={`${row.title} mẫu ${index + 1}`}
                      className="w-full aspect-square object-contain"
                    />
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="mt-10 flex justify-center">
          <Link
            to="/custom-bags"
            className="rounded-full bg-rose-700 text-white px-8 py-3 md:px-10 md:py-4 text-base md:text-lg font-semibold font-['Geologica'] border-2 border-white hover:bg-[#AF2E38] transition"
          >
            Bắt đầu thiết kế túi
          </Link>
        </div>
      </div>
    </div>
  );
}
