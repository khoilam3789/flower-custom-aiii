const fs = require('fs');

let content = fs.readFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', 'utf8');

// Replace the placeholder background card with the nenhoa.png
content = content.replace(/https:\/\/placehold\.co\/251x312/g, '/images/CustomizeHoa/nenhoa.png');

fs.writeFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', content, 'utf8');
console.log('Replaced flower card backgrounds');
