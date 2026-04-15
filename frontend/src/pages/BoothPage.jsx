import { useMemo, useState } from "react";
import { API_BASE, toBase64 } from "../api";

const makeItem = () => ({ id: crypto.randomUUID(), label: "", quantity: 1, imageFile: null });

const bagShapes = [
  { label: "Cổ điển (Classic)", value: "classic" },
  { label: "Bo tròn (Round)", value: "round" },
  { label: "Vuông (Square)", value: "square" }
];

export default function BoothPage() {
  const [flowers, setFlowers] = useState([makeItem()]);
  const [leaves, setLeaves] = useState([makeItem()]);
  const [bag, setBag] = useState({ label: "Túi chính", shape: "classic", color: "#c58f64", imageFile: null });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const totalStem = useMemo(() => {
    const flowerTotal = flowers.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const leafTotal = leaves.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    return flowerTotal + leafTotal;
  }, [flowers, leaves]);

  const updateItem = (type, id, patch) => {
    const setter = type === "flower" ? setFlowers : setLeaves;
    setter((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addSlot = (type) => {
    const setter = type === "flower" ? setFlowers : setLeaves;
    setter((prev) => [...prev, makeItem()]);
  };

  const removeSlot = (type, id) => {
    const setter = type === "flower" ? setFlowers : setLeaves;
    setter((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  };

  const buildPayload = async () => {
    const mapItems = async (items) =>
      Promise.all(
        items
          .filter((item) => item.imageFile)
          .map(async (item) => ({
            label: item.label || "Không tên",
            quantity: Math.max(1, Number(item.quantity || 1)),
            image: await toBase64(item.imageFile)
          }))
      );

    return {
      flowers: await mapItems(flowers),
      leaves: await mapItems(leaves),
      bag: {
        label: bag.label || "Túi đựng",
        shape: bag.shape,
        color: bag.color,
        image: bag.imageFile ? await toBase64(bag.imageFile) : null
      }
    };
  };

  const onGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = await buildPayload();

      if (payload.flowers.length === 0) {
        throw new Error("Cần tải lên ít nhất 1 ảnh hoa.");
      }

      const response = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Tạo ảnh tĩnh vật thất bại!");
      }

      const data = await response.json();
      setResult(`${API_BASE}${data.outputImagePath}`);
    } catch (err) {
      setError(err.message || "Lỗi hệ thống không xác định.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-24 py-12">
      <header className="mb-12 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-rose-700 font-['Geologica'] mb-4">Phòng Thiết Kế Hoa (Booth Generator)</h1>
        <p className="text-slate-500 font-light text-base md:text-lg">Nhập ảnh hoa + lá + túi, điều chỉnh số lượng và bấm tạo để tự động mô phỏng ánh sáng, góc chụp 3D.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Hoa */}
        <section className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-rose-700/10 flex flex-col space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-rose-700 font-['Geologica'] uppercase">Hoa</h2>
          {flowers.map((item) => (
            <div key={item.id} className="flex flex-col space-y-3 bg-[#FAF9F5] p-4 rounded-2xl border border-zinc-200">
              <input className="w-full px-4 py-2 bg-white rounded-xl border border-zinc-300 focus:outline-none focus:border-rose-500 text-sm" placeholder="Tên loại hoa" value={item.label} onChange={(e) => updateItem("flower", item.id, { label: e.target.value })} />
              <input className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" type="file" accept="image/*" onChange={(e) => updateItem("flower", item.id, { imageFile: e.target.files?.[0] || null })} />
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold whitespace-nowrap">Số lượng:</span>
                <input className="w-20 px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:outline-none" type="number" min="1" value={item.quantity} onChange={(e) => updateItem("flower", item.id, { quantity: e.target.value })} />
              </div>
              <button className="text-red-500 hover:text-red-700 font-semibold text-sm border-t border-zinc-200 pt-2 mt-2 text-left" type="button" onClick={() => removeSlot("flower", item.id)}>Xoá ô này</button>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-rose-700/50 text-rose-700 font-bold rounded-2xl hover:bg-rose-50 transition" type="button" onClick={() => addSlot("flower")}>+ Thêm hoa loại khác</button>
        </section>

        {/* Panel Lá */}
        <section className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-rose-700/10 flex flex-col space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-slate-500 font-['Geologica'] uppercase">Lá</h2>
          {leaves.map((item) => (
            <div key={item.id} className="flex flex-col space-y-3 bg-[#FAF9F5] p-4 rounded-2xl border border-zinc-200">
              <input className="w-full px-4 py-2 bg-white rounded-xl border border-zinc-300 focus:outline-none focus:border-slate-500 text-sm" placeholder="Tên loại lá" value={item.label} onChange={(e) => updateItem("leaf", item.id, { label: e.target.value })} />
              <input className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200" type="file" accept="image/*" onChange={(e) => updateItem("leaf", item.id, { imageFile: e.target.files?.[0] || null })} />
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold whitespace-nowrap">Số lượng:</span>
                <input className="w-20 px-3 py-2 bg-white rounded-xl border border-zinc-300 focus:outline-none" type="number" min="1" value={item.quantity} onChange={(e) => updateItem("leaf", item.id, { quantity: e.target.value })} />
              </div>
              <button className="text-red-500 hover:text-red-700 font-semibold text-sm border-t border-zinc-200 pt-2 mt-2 text-left" type="button" onClick={() => removeSlot("leaf", item.id)}>Xoá ô này</button>
            </div>
          ))}
          <button className="w-full py-3 border-2 border-dashed border-slate-500/50 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition" type="button" onClick={() => addSlot("leaf")}>+ Thêm lá loại khác</button>
        </section>

        {/* Panel Túi */}
        <section className="bg-white p-6 md:p-8 rounded-[30px] shadow-sm border border-rose-700/10 flex flex-col space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#EAB308] font-['Geologica'] uppercase">Túi Đựng</h2>
          <div className="flex flex-col space-y-4">
             <input className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-300 focus:outline-none text-sm" placeholder="Tên túi" value={bag.label} onChange={(e) => setBag((prev) => ({ ...prev, label: e.target.value }))} />
             
             <div className="flex items-center gap-4">
               <span className="text-sm font-semibold">Màu túi:</span>
               <input className="w-12 h-12 rounded cursor-pointer border-0 p-0" type="color" value={bag.color} onChange={(e) => setBag((prev) => ({ ...prev, color: e.target.value }))} />
             </div>
             
             <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Hình dáng:</span>
                <select className="w-full px-4 py-3 bg-zinc-50 rounded-xl border border-zinc-300 focus:outline-none text-sm" value={bag.shape} onChange={(e) => setBag((prev) => ({ ...prev, shape: e.target.value }))}>
                  {bagShapes.map((shape) => (
                    <option key={shape.value} value={shape.value}>{shape.label}</option>
                  ))}
                </select>
             </div>

             <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">Ảnh mặt túi (Không bắt buộc):</span>
                <input className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100" type="file" accept="image/*" onChange={(e) => setBag((prev) => ({ ...prev, imageFile: e.target.files?.[0] || null }))} />
             </div>
          </div>

          <div className="mt-8 bg-rose-50 p-6 rounded-2xl border border-rose-100 flex flex-col items-center">
            <p className="text-lg font-bold text-rose-800 mb-4">Tổng số hoa/lá: {totalStem}</p>
            <button className="w-full bg-rose-700 text-white font-bold text-lg px-6 py-4 rounded-full hover:bg-rose-800 transition shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed uppercase" type="button" onClick={onGenerate} disabled={loading}>{loading ? "Đang render 3D..." : "TẠO THIẾT KẾ NGAY"}</button>
          </div>

          {error && <p className="text-red-600 font-medium text-center bg-red-50 p-3 rounded-lg">⚠ {error}</p>}
        </section>
      </div>

      <section className="mt-12 bg-[#FAF9F5] p-8 md:p-12 rounded-[40px] shadow-inner border-[4px] border-white flex flex-col items-center">
        <h2 className="text-3xl font-bold text-slate-700 font-['Geologica'] mb-8 uppercase tracking-widest text-center">Kết Quả (Preview)</h2>
        {result ? (
          <img src={result} alt="Sản phẩm hoa sau khi gắn" className="max-w-full h-auto rounded-[30px] shadow-2xl border-8 border-white" />
        ) : (
          <div className="w-full max-w-2xl h-[400px] border-4 border-dashed border-zinc-300 rounded-[30px] flex items-center justify-center bg-white/50">
             <p className="text-zinc-400 font-light text-lg text-center px-8">Chưa có ảnh.<br/>Vui lòng nhập tài nguyên ở trên và bấm "Tạo Thiết Kế" để xem thử nghiệm AI.</p>
          </div>
        )}
      </section>
    </div>
  );
}
