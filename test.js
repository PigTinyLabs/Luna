const sharp = require('sharp');
sharp('public/pwa-64x64.png').raw().toBuffer().then(b => {
  let s = '';
  for(let y=0; y<64; y+=3) {
    for(let x=0; x<64; x+=2) {
      let idx = (y*64+x)*4;
      s += b[idx+3] > 128 ? 'M' : '.';
    }
    s += '\n';
  }
  console.log("HEAD PWA-64x64.PNG:");
  console.log(s);
});
