const fs = require('fs');
let content = fs.readFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', 'utf8');

// The header starts at <div className="w-[980px] h-24 relative bg-Color-3 outline outline-1 outline-offset-[-0.50px]">
// and ends at <img className="w-7 h-7 left-[1283px] top-[30px] absolute" src="https://placehold.co/30x30" />
const regex = /<div className="w-\\[980px\\] h-24 relative bg-Color-3 outline outline-1 outline-offset-\\[-0\\.50px\\]">[\\s\\S]*?<img className="w-7 h-7 left-\\[1283px\\] top-\\[30px\\] absolute" src="https:\\/\\/placehold\\.co\\/30x30" \\/>/g;

content = content.replace(regex, '');

fs.writeFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', content, 'utf8');
console.log('Removed header');
