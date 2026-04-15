const fs = require('fs');
let content = fs.readFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', 'utf8');

const anchor1 = '<div className="w-[980px] h-24 relative bg-Color-3 outline outline-1 outline-offset-[-0.50px]">';
const anchor2 = '<img className="w-7 h-7 left-[1283px] top-[30px] absolute" src="https://placehold.co/30x30" />';

const index1 = content.indexOf(anchor1);
const index2 = content.indexOf(anchor2);

if (index1 !== -1 && index2 !== -1) {
    const endOfAnchor2 = index2 + anchor2.length;
    // Replace that whole block
    const blockToReplace = content.substring(index1, endOfAnchor2);
    content = content.replace(blockToReplace, '');
    fs.writeFileSync('d:/lamho/Folower/frontend/src/pages/legacy/custom-flowers.jsx', content, 'utf8');
    console.log('Removed header');
} else {
    console.log('Could not find anchors');
}
