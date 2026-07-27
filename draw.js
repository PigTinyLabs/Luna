const fs = require('fs');
const sharp = require('sharp');
sharp('public/favicon.svg').resize(20, 20).raw().toBuffer().then(b => {
  let s = '';
  for(let y=0; y<20; y++) {
    for(let x=0; x<20; x++) {
      let idx = (y*20+x)*4;
      s += b[idx+3] > 128 ? 'M' : '.';
    }
    s += '\n';
  }
  console.log(s);
});
