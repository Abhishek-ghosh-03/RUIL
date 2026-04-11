import fs from 'fs';
let c = fs.readFileSync('src/components/BundleBuilder.jsx', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\$/g, '$');
c = c.replace(/\\\\n/g, '\\n');
fs.writeFileSync('src/components/BundleBuilder.jsx', c);
console.log('Fixed escape chars');
