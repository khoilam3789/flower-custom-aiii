import React from 'react';
import { Link } from 'react-router-dom';

export default function Custombags(){
  return (
<div className="w-[1440px] h-[1000px] px-10 relative bg-Color-3 inline-flex flex-col justify-start items-center overflow-hidden">
  <div className="w-[525px] h-[532px] left-[816px] top-[280px] absolute bg-white rounded-[10px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
    <div className="w-[619px] h-36 left-0 top-[404px] absolute bg-[#AF2E38] rounded-[10px]" />
    <div className="w-40 h-10 left-[16px] top-[472px] absolute text-center justify-center text-white text-3xl font-semibold font-['Geologica'] leading-10">Tạm tính</div>
    <div className="w-52 h-10 left-[296px] top-[472px] absolute text-right justify-center text-white text-3xl font-light font-['Geologica'] leading-10">450.000</div>
  </div>
  <div className="w-[623px] h-[612px] left-[120px] top-[280px] absolute bg-[#AF2E38] rounded-[20px] outline outline-1 outline-offset-[-1px] outline-[#AF2E38] overflow-hidden">
    <div className="w-[580px] h-[612px] left-[13px] top-[0px] absolute overflow-hidden">
      {/* 1. Tim Xanh Pastel */}
      <img className="w-64 h-80 left-[39px] top-[24px] absolute shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="/images/CustomizeHoa/nenhoa.png" />
      <img className="w-48 h-48 left-[70px] top-[61px] absolute object-contain" src="/images/customtui/source_1.png" />
      <div className="w-[140px] h-[56px] left-[97px] top-[248px] absolute bg-white" />
      <div className="w-[140px] h-6 left-[97px] top-[253px] absolute text-center justify-center text-[#215E98] text-sm font-black font-['Geologica'] leading-5">Tim Xanh Pastel</div>
      <div className="w-[140px] h-6 left-[97px] top-[275px] absolute text-center justify-center text-[#AF2E38] text-sm font-light font-['Geologica'] leading-5">39.000đ</div>
      <div className="w-6 h-6 left-[60px] top-[45px] absolute bg-[#B8DAFF] rounded-full" />

      {/* 2. Tim Hồng Pastel */}
      <img className="w-64 h-80 left-[326px] top-[24px] absolute shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="/images/CustomizeHoa/nenhoa.png" />
      <img className="w-48 h-48 left-[356px] top-[61px] absolute object-contain" src="/images/customtui/source_2.png" />
      <div className="w-[140px] h-[56px] left-[384px] top-[248px] absolute bg-white" />
      <div className="w-[140px] h-6 left-[384px] top-[253px] absolute text-center justify-center text-[#215E98] text-sm font-black font-['Geologica'] leading-5">Tim Hồng Pastel</div>
      <div className="w-[140px] h-6 left-[384px] top-[275px] absolute text-center justify-center text-[#AF2E38] text-sm font-light font-['Geologica'] leading-5">39.000đ</div>
      <div className="w-5 h-5 left-[348px] top-[46px] absolute bg-white rounded-full shadow-inner" />

      {/* 3. Tim Vàng Pastel */}
      <img className="w-64 h-80 left-[39px] top-[316px] absolute shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="/images/CustomizeHoa/nenhoa.png" />
      <img className="w-48 h-48 left-[70px] top-[353px] absolute object-contain" src="/images/customtui/source_5.png" />
      <div className="w-[140px] h-[56px] left-[97px] top-[546px] absolute bg-white" />
      <div className="w-[140px] h-6 left-[97px] top-[551px] absolute text-center justify-center text-[#215E98] text-sm font-black font-['Geologica'] leading-5">Tim Vàng Pastel</div>
      <div className="w-[140px] h-6 left-[97px] top-[573px] absolute text-center justify-center text-[#AF2E38] text-sm font-light font-['Geologica'] leading-5">39.000đ</div>
      <div className="w-5 h-5 left-[60px] top-[338px] absolute bg-white rounded-full shadow-inner" />

      {/* 4. Hồng Bi Hoa */}
      <img className="w-64 h-80 left-[326px] top-[316px] absolute shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" src="/images/CustomizeHoa/nenhoa.png" />
      <img className="w-48 h-48 left-[356px] top-[353px] absolute object-contain" src="/images/customtui/source_6.png" />
      <div className="w-[140px] h-[56px] left-[384px] top-[546px] absolute bg-white" />
      <div className="w-[140px] h-6 left-[384px] top-[551px] absolute text-center justify-center text-[#215E98] text-sm font-black font-['Geologica'] leading-5">Hồng Bi Hoa</div>
      <div className="w-[140px] h-6 left-[384px] top-[573px] absolute text-center justify-center text-[#AF2E38] text-sm font-light font-['Geologica'] leading-5">59.000đ</div>
      <div className="w-5 h-5 left-[348px] top-[338px] absolute bg-white rounded-full shadow-inner" />
    </div>
  </div>

  <div className="w-[1131px] h-28 left-[150px] top-[135px] absolute overflow-hidden">
    <div className="w-[982px] h-[1px] left-[70px] top-[47px] absolute bg-black"></div>
    <div className="w-10 h-10 left-[50px] top-[27px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-10 h-10 left-[290px] top-[25px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-10 h-10 left-[538px] top-[25px] absolute bg-[#AF2E38] rounded-full"></div>
    <div className="w-10 h-10 left-[785px] top-[25px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-10 h-10 left-[1032px] top-[25px] absolute bg-[#B8DAFF] rounded-full"></div>
    <div className="w-16 h-6 left-[39px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Hoa</div>
    <div className="w-16 h-6 left-[281px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Lá</div>
    <div className="w-16 h-6 left-[526px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Túi</div>
    <div className="w-16 h-6 left-[770px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Thiệp</div>
    <div className="w-32 h-6 left-[982px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9">Thanh toán</div>
  </div>

  <Link to="/custom-cards" className="w-80 h-24 left-[1000px] top-[830px] absolute overflow-hidden block">
    <div className="w-48 h-12 left-[152px] top-[24px] absolute bg-[#B8DAFF] rounded-[10px]" />
    <div className="left-[192px] top-[35px] absolute text-center justify-center text-[#AF2E38] text-2xl font-normal font-['Geologica'] leading-7">TIẾP TỤC</div>
  </Link>
  
</div>
  );
}
