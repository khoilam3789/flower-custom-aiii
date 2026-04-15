import re

with open('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Táº¡m tÃ­nh': 'Tạm tính',
    'HÆ°á»›ng DÆ°Æ¡ng': 'Hướng Dương',
    'Sá»± trung thÃ nh, kiÃªn Ä‘á»‹nh &amp; sá»©c sá»‘ng mÃ£nh liá»‡t': 'Sự trung thành, kiên định & sức sống mãnh liệt',
    'VNÄ /cÃ nh': 'VNĐ/cành',
    'Hoa Há»“ng': 'Hoa Hồng',
    'TÃ¬nh yÃªu, sá»± lÃ£ng máº¡n vÃ  sáº¯c Ä‘áº¹p': 'Tình yêu, sự lãng mạn và sắc đẹp',
    'Lá» i tá»  tÃ¬nh tinh táº¿ dÃ nh cho â€œngÆ°á» i thÆ°Æ¡ng&quot;': 'Lời tỏ tình tinh tế dành cho \"người thương\"',
    '8.000Ä‘/cÃ nh': '49.000 VNĐ/cành',
    'Sá»± â€œtrá»Ÿ láº¡iâ€  cá»§a háº¡nh phÃºc, may máº¯n': 'Sự \"trở lại\" của hạnh phúc, may mắn',
    'Cáº©m TÃº Cáº§u': 'Cẩm Tú Cầu',
    'LÃ²ng biáº¿t Æ¡n, sá»± chÃ¢n thÃ nh &amp; lá» i xin lá»—i': 'Lòng biết ơn, sự chân thành & lời xin lỗi',
    'CÃºc Ä á»“ng Tiá» n': 'Cúc Đồng Tiền',
    'Sá»± khá»Ÿi Ä‘áº§u má»›i': 'Sự khởi đầu mới',
    'Máº«u Ä Æ¡n': 'Mẫu Đơn',
    'Háº¡nh phÃºc, hoÃ n má»¹ &amp; thá»‹nh vÆ°á»£ng': 'Hạnh phúc, hoàn mỹ & thịnh vượng',
    'LÃ²ng chung thuá»· &amp; cao thÆ°á»£ng': 'Lòng chung thuỷ & cao thượng',
    'LÃ¡': 'Lá',
    'TÃºi': 'Túi',
    'Thiá»‡p': 'Thiệp',
    'Thanh toÃ¡n': 'Thanh toán',
    'TIáº¾P Tá»¤C': 'TIẾP TỤC',
    'Trang chá»§': 'Trang chủ',
    'Vá»  chÃºng tÃ´i': 'Về chúng tôi',
    'Thiáº¿t Káº¿ TÃºi': 'Thiết Kế Túi',
    'Dear, ChÃ©rie': 'Dear, Chérie',
    'NgÃ´n ngá»¯ Hoa': 'Ngôn ngữ Hoa',
    'LiÃªn Há»‡': 'Liên Hệ',
    'bg-rose-700': 'bg-[#AF2E38]',
    'outline-red-600': 'outline-[#AF2E38]',
    'text-rose-700': 'text-[#AF2E38]',
    'outline-rose-700': 'outline-[#AF2E38]',
    'bg-blue-200': 'bg-[#B8DAFF]',
    'text-slate-500': 'text-[#AF2E38]'
}

for k, v in replacements.items():
    content = content.replace(k, v)

# Update the 'Tạm tính' box bg
content = content.replace('bg-red-200/20', 'bg-[#AF2E38]')

# Maps images 
content = content.replace('\"https://placehold.co/120x160\"', '\"/images/CustomizeHoa/f9080b8321ae7c9df6ca5dda46cd96397c18d393.png\"')
content = content.replace('\"https://placehold.co/146x194\"', '\"/images/CustomizeHoa/4a11fcc5f36a3a414182283a738de97e74b7df02.png\"')
content = content.replace('\"https://placehold.co/127x169\"', '\"/images/CustomizeHoa/2bda025de717bd952aa48885fdfb0362789895da.png\"')
content = content.replace('\"https://placehold.co/137x182\"', '\"/images/CustomizeHoa/7f5795ac3c5d0413eb5ce56faf7b73904283c23d.png\"')

# Update the stepper
new_stepper = '''  <div className=\"w-[1131px] h-28 left-[150px] top-[135px] absolute overflow-hidden\">
    <div className=\"w-10 h-10 left-[50px] top-[27px] absolute bg-[#AF2E38] rounded-full\"></div>
    <div className=\"w-10 h-10 left-[290px] top-[25px] absolute bg-[#B8DAFF] rounded-full\"></div>
    <div className=\"w-36 h-0 left-[116px] top-[45px] absolute outline outline-1 outline-offset-[-0.50px] outline-black\"></div>
    <div className=\"w-36 h-0 left-[361px] top-[45px] absolute outline outline-1 outline-offset-[-0.50px] outline-black\"></div>
    <div className=\"w-10 h-10 left-[538px] top-[25px] absolute bg-[#B8DAFF] rounded-full\"></div>
    <div className=\"w-36 h-0 left-[850px] top-[45px] absolute outline outline-1 outline-offset-[-0.50px] outline-black\"></div>
    <div className=\"w-10 h-10 left-[1032px] top-[25px] absolute bg-[#B8DAFF] rounded-full\"></div>
    <div className=\"w-36 h-0 left-[606px] top-[45px] absolute outline outline-1 outline-offset-[-0.50px] outline-black\"></div>
    <div className=\"w-10 h-10 left-[785px] top-[25px] absolute bg-[#B8DAFF] rounded-full\"></div>
    <div className=\"w-16 h-6 left-[39px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9\">Hoa</div>
    <div className=\"w-16 h-6 left-[281px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9\">Lá</div>
    <div className=\"w-16 h-6 left-[526px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9\">Túi</div>
    <div className=\"w-16 h-6 left-[770px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9\">Thiệp</div>
    <div className=\"w-32 h-6 left-[982px] top-[75px] absolute text-center justify-center text-black text-2xl font-extralight font-['Geologica'] leading-9\">Thanh toán</div>
  </div>'''

content = re.sub(r'<div className=\"w-\\[1131px\\] h-28 left-\\[150px\\] top-\\[135px\\] absolute overflow-hidden\">.*?<div className=\"w-80 h-24 left-\\[1000px\\] top-\\[830px\\] absolute overflow-hidden\">', new_stepper + '\n  <div className=\"w-80 h-24 left-[1000px] top-[830px] absolute overflow-hidden\">', content, flags=re.DOTALL)

with open('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
