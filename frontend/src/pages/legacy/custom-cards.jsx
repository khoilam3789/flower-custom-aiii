import React from 'react';
import { Link } from 'react-router-dom';

export default function Customcards(){
  return (
<div className="w-[1440px] h-[1200px] px-10 relative bg-Color-3 inline-flex flex-col justify-start items-center overflow-hidden">
  {/* Right pane summary */}
  <div className="w-[525px] h-[532px] left-[816px] top-[280px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
    <div className="w-[619px] h-36 left-0 top-[404px] absolute bg-[#AF2E38] rounded-[10px]" />
    <div className="w-40 h-10 left-[16px] top-[472px] absolute text-center justify-center text-white text-3xl font-semibold font-['Geologica'] leading-10">Tạm tính</div>
    <div className="w-52 h-10 left-[296px] top-[472px] absolute text-right justify-center text-white text-3xl font-light font-['Geologica'] leading-10">450.000</div>
  </div>

  <Link to="/payment" className="w-80 h-24 left-[1000px] top-[830px] absolute overflow-hidden block z-10 cursor-pointer">
    <div className="w-48 h-12 left-[152px] top-[24px] absolute bg-[#B8DAFF] rounded-[10px]" />
    <div className="left-[192px] top-[35px] absolute text-center justify-center text-[#AF2E38] text-2xl font-normal font-['Geologica'] leading-7 z-20">TIẾP TỤC</div>
  </Link>

  {/* Left Pane Part 1: Top 3 Cards Area */}
  <div className="w-[707px] h-60 left-[61px] top-[280px] absolute bg-[#AF2E38] rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
    <img className="w-48 h-56 left-[698.86px] top-[22px] absolute origin-top-left rotate-[89.65deg] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="/images/CustomizeHoa/nenhoa.png" />
    <img className="w-52 h-40 left-[470px] top-[23px] absolute object-contain" src="/images/customizethiep/source_Untitled design (7).png" />
    
    <div className="w-[693px] h-[671px] left-[7px] top-[-19px] absolute overflow-hidden">
      <img className="w-48 h-56 left-[231.86px] top-[41px] absolute origin-top-left rotate-[89.65deg] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="/images/CustomizeHoa/nenhoa.png" />
      <img className="w-48 h-40 left-[22px] top-[41px] absolute object-contain" src="/images/customizethiep/source_Untitled design (5).png" />
      <img className="w-48 h-56 left-[459.86px] top-[41px] absolute origin-top-left rotate-[89.65deg] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="/images/CustomizeHoa/nenhoa.png" />
      <img className="w-48 h-40 left-[250px] top-[44px] absolute object-contain" src="/images/customizethiep/source_Untitled design (6).png" />
      
      <div className="w-8 h-8 left-[92px] top-[224px] absolute bg-white rounded-full"></div>
      <div className="w-8 h-8 left-[557px] top-[224px] absolute bg-white rounded-full"></div>
      <div className="w-8 h-8 left-[329px] top-[224px] absolute bg-[#B8DAFF] rounded-full"></div>
      {/* Assuming the middle one is selected */}
      <img className="w-9 h-9 left-[327px] top-[222px] absolute" src="https://placehold.co/35x35" />
    </div>
  </div>

  {/* Left Pane Part 2: Custom Message Area */}
  <div className="w-[703px] h-[532px] left-[61px] top-[560px] absolute bg-[#AF2E38] rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
    <div className="w-[492px] h-10 left-[105px] top-[26px] absolute text-center justify-center text-white text-3xl font-semibold font-['Geologica'] leading-10">Thêm lời nhắn gửi</div>
    
    <div className="w-[638px] h-72 left-[34px] top-[86px] absolute bg-white rounded-[20px]"></div>
    <div className="w-[594px] h-48 left-[49px] top-[140px] absolute bg-[#FCE5EB] rounded-[20px]"></div>
    <div className="w-48 h-6 left-[69px] top-[105px] absolute justify-center text-[#215E98] text-base font-black font-['Geologica'] leading-6">Nội dung lời nhắn</div>
    <div className="w-72 h-10 left-[69px] top-[149px] absolute justify-center text-neutral-400 text-base font-light font-['Geologica'] leading-6">Viết lời nhắn gửi của bạn tại đây</div>
    
    <div className="w-[638px] h-28 left-[34px] top-[391px] absolute bg-[#FCE5EB] rounded-[20px]"></div>
    <div className="w-48 h-6 left-[64px] top-[397px] absolute justify-center text-[#215E98] text-base font-black font-['Geologica'] leading-6">Lời nhắn nhanh</div>
    
    {/* Buttons Row 1 */}
    <div className="w-36 h-8 left-[64px] top-[423px] absolute bg-white rounded-[10px] shadow-sm"></div>
    <div className="w-40 h-6 left-[70px] top-[427px] absolute justify-center text-black text-[13px] font-bold font-['Geologica'] leading-6">Congratuations!</div>
    
    <div className="w-48 h-8 left-[247px] top-[423px] absolute bg-white rounded-[10px] shadow-sm"></div>
    <div className="w-40 h-8 left-[289px] top-[425px] absolute justify-center text-black text-[13px] font-bold font-['Geologica'] leading-6">Happy Birthday!</div>
    
    <div className="w-36 h-8 left-[479px] top-[423px] absolute bg-white rounded-[10px] shadow-sm"></div>
    <div className="w-24 h-10 left-[511px] top-[425px] absolute justify-center text-black text-[13px] font-bold font-['Geologica'] leading-6">Anh yêu em!</div>
    
    {/* Buttons Row 2 */}
    <div className="w-40 h-8 left-[64px] top-[460px] absolute bg-white rounded-[10px] shadow-sm"></div>
    <div className="w-40 h-6 left-[70px] top-[464px] absolute justify-center text-black text-[13px] font-bold font-['Geologica'] leading-6">Happy Anniversary</div>
    
    <div className="w-48 h-8 left-[247px] top-[460px] absolute bg-white rounded-[10px] shadow-sm"></div>
    <div className="w-44 h-10 left-[262px] top-[464px] absolute justify-center text-black text-[13px] font-bold font-['Geologica'] leading-6">Đừng giận tớ nữa nhé!</div>
    
    <div className="w-36 h-8 left-[479px] top-[460px] absolute bg-white rounded-[10px] shadow-sm"></div>
    <div className="w-20 h-10 left-[517px] top-[464px] absolute justify-center text-black text-[13px] font-bold font-['Geologica'] leading-6">I miss you</div>
  </div>

  <div className="w-[1131px] h-28 left-[150px] top-[135px] absolute overflow-hidden">
    <div className="w-[982px] h-[1px] left-[70px] top-[47px] absolute bg-black"></div>
    <div className="w-10 h-10 left-[50px] top-[27px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-10 h-10 left-[290px] top-[25px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-10 h-10 left-[538px] top-[25px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-10 h-10 left-[785px] top-[25px] absolute bg-[#AF2E38] rounded-full"></div>
    <div className="w-10 h-10 left-[1032px] top-[25px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-16 h-6 left-[39px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Hoa</div>
    <div className="w-16 h-6 left-[281px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Lá</div>
    <div className="w-16 h-6 left-[526px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Túi</div>
    <div className="w-16 h-6 left-[770px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Thiệp</div>
    <div className="w-32 h-6 left-[982px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Thanh toán</div>
  </div>
</div>
  );
}
