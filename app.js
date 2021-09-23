var Jimp = require("jimp");
const inputFolder = "./images/";
const outputFolder = "./processed_images/";
const fs = require("fs");

// the metadata specs for each of the images
const imagesMetaData = {
  desktop: { width: 1920 },
  mobile: { width: 850 },
  thumb: { width: 176 },
};

// read all of the images in the `images` folder and resize each of them,
// then create and place each image in a folder with its name
fs.readdir(inputFolder, (err, files) => {
  files.forEach((file) => {
    if (file.toLowerCase().endsWith(".jpg")) {
      resizeImage(file);
    }
  });
});

function resizeImage(nameAndExt) {
  Jimp.read(inputFolder + nameAndExt)
    .then(function (image) {
      console.log("Processing Images...");
      generateImgSizes(image, nameAndExt);
      console.log('Image generation complete!');
    })
    .catch(function (e) {
      console.log(e, nameAndExt);
    });
}

function generateImgSizes(image, nameAndExt) {
  const imageSizes = Object.keys(imagesMetaData);
  const subFolderName = strToUrlFriendlyName(nameAndExt.replace(/\.[^/.]+$/, ""));

  imageSizes.forEach((size) => {
    const width = imagesMetaData[size].width;

    image
      .resize(width, Jimp.AUTO)
      .quality(60)
      .write(`./${outputFolder}/${subFolderName}/${size}.jpg`);

    console.log(`new image generated in: ./${outputFolder}/${subFolderName}/${size}.jpg`)
  });
}

function strToUrlFriendlyName(str) {
  if (!str) return '';
  const lowerCaseStr = str.toLowerCase();
  // remove all special chars
  const plainText = lowerCaseStr.replace(/[^a-zA-Z0-9\s]/g, '');
  // remove space from the edges and replaces space chars with a -
  return plainText.trim().split(' ').join('-').split('--').join('-');
}
