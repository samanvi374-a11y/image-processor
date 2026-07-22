const sharp = require("sharp");
const path = require("path");

async function cropPlate(imagePath) {
  const extension = path.extname(imagePath);
  const outputPath = path.join(
    path.dirname(imagePath),
    `plate_${path.basename(imagePath, extension)}.png`
  );

  const metadata = await sharp(imagePath).metadata();

  const width = metadata.width;
  const height = metadata.height;

  // Rear auto number plate region (for GoGig sample images)
  const left = Math.floor(width * 0.80);
  const top = Math.floor(height * 0.70);
  const cropWidth = Math.floor(width * 0.15);
  const cropHeight = Math.floor(height * 0.14);

  // console.log("Cropping Plate...");
  // console.log({
  //   width,
  //   height,
  //   left,
  //   top,
  //   cropWidth,
  //   cropHeight,
  // });

  await sharp(imagePath)
    .extract({
      left,
      top,
      width: cropWidth,
      height: cropHeight,
    })
    .resize({ width: 1200, fit: "inside", withoutEnlargement: false })
    .greyscale()
    .normalize()
    .sharpen()
    .threshold(140)
    .toFormat("png")
    .toFile(outputPath);

  // console.log("Plate saved:");
  // console.log(outputPath);

  return outputPath;
}

module.exports = {
  cropPlate,
};