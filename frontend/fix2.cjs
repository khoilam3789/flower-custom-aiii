const fs = require('fs');
let content = fs.readFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', 'utf8');

const replacements = {
    'Sá»± â€œtrá»Ÿ láº¡iâ€  cá»§a háº¡nh phÃºc, may máº¯n': 'Sự "trở lại" của hạnh phúc, may mắn',
    '89.000 VNÄ /cÃ nh': '89.000 VNĐ/cành',
    '39.000 VNÄ /cÃ nh': '39.000 VNĐ/cành',
    'LÃ²ng biáº¿t Æ¡n, sá»± chÃ¢n thÃ nh &amp; lá» i xin lá»—i': 'Lòng biết ơn, sự chân thành &amp; lời xin lỗi',
    '19.000 VNÄ /cÃ nh': '19.000 VNĐ/cành',
    'CÃºc Ä á»“ng Tiá» n': 'Cúc Đồng Tiền',
    '189.000 VNÄ /cÃ nh': '189.000 VNĐ/cành',
    '29.000 VNÄ /cÃ nh': '29.000 VNĐ/cành',
    'Vá»  chÃºng tÃ´i': 'Về chúng tôi',
    'Thiáº¿t Káº¿ Túi': 'Thiết Kế Túi'
};

for (const [k, v] of Object.entries(replacements)) {
    content = content.split(k).join(v);
}

fs.writeFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', content, 'utf8');
console.log("Fixed secondary typos");
