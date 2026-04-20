const bagRows = [
  {
    title: "Túi Petalé",
    bgClass: "bg-[#F9EEEC]",
    cards: [
      "/images/bag/1.png",
      "/images/bag/2.png",
      "/images/bag/3.png"
    ]
  },
  {
    title: "Túi Blooming Heart",
    bgClass: "bg-white",
    cards: [
      "/images/bag/4.png",
      "/images/bag/5.png",
      "/images/bag/6.png"
    ]
  },
  {
    title: "Túi La vie en rose",
    bgClass: "bg-[#F9EEEC]",
    cards: [
      "/images/bag/7.png",
      "/images/bag/8.png",
      "/images/bag/9.png"
    ]
  }
];

export default function BagGalleryPage() {
  return (
    <div className="w-full bg-Color-3 text-[#1E1E1E]">
      <div className="mx-auto w-full max-w-[1440px] bg-[#FBFAF7]">
        <main>
          <section className={`${bagRows[0].bgClass} px-4 sm:px-6 lg:px-10 pt-8 pb-12`}>
            <h2 className="text-center text-[#AF2E38] text-5xl lg:text-6xl font-normal font-['Italianno'] leading-[1.05] tracking-[2.56px]">
              {bagRows[0].title}
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 items-end gap-8 lg:gap-10">
              {bagRows[0].cards.map((image, index) => (
                <div key={`petale-${index}`} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Túi Petalé mẫu ${index + 1}`}
                    className="h-[290px] sm:h-[350px] lg:h-[390px] w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white px-4 sm:px-6 lg:px-10 pt-8 pb-12">
            <h2 className="text-center text-[#AF2E38] text-5xl lg:text-6xl font-normal font-['Italianno'] leading-[1.05] tracking-[2.56px]">
              {bagRows[1].title}
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 items-end gap-8 lg:gap-10">
              {bagRows[1].cards.map((image, index) => (
                <div key={`blooming-${index}`} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Túi Blooming Heart mẫu ${index + 1}`}
                    className="h-[290px] sm:h-[350px] lg:h-[390px] w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className={`${bagRows[2].bgClass} px-4 sm:px-6 lg:px-10 pt-8 pb-12`}>
            <h2 className="text-center text-[#AF2E38] text-5xl lg:text-6xl font-normal font-['Italianno'] leading-[1.05] tracking-[2.56px]">
              {bagRows[2].title}
            </h2>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 items-end gap-8 lg:gap-10">
              {bagRows[2].cards.map((image, index) => (
                <div key={`la-vie-${index}`} className="flex justify-center">
                  <img
                    src={image}
                    alt={`Túi La vie en rose mẫu ${index + 1}`}
                    className="h-[290px] sm:h-[350px] lg:h-[390px] w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
