
'use strict';

const img = require('../models/image');
 exports.uploadImage = (rapidID,img) =>
 new Promise((resolve,reject) => {

     var newImg = new img;
    img.img.data = fs.readFileSync(imgPath);
    img.img.contentType = 'image/png';
    newImg.save(function (err, a) {
      if (err) throw err;
    console.error('saved img to mongo');

}
    )});
/*
     .remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    // store an img in binary in mongo

  */     