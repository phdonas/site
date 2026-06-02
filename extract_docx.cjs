const fs = require('fs');
const xml = fs.readFileSync('unzipped_blueprint/word/document.xml', 'utf8');
let text = xml.replace(/<w:p(\s+[^>]*>|>)/g, '\n');
text = text.replace(/<[^>]+>/g, '');
fs.writeFileSync('Blueprint.txt', text, 'utf8');
console.log('Done!');
