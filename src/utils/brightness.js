const sharp = require("sharp");

const calculateBrightness = async (imagePath) => {
  const { data, info } = await sharp(imagePath)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let totalBrightness = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Standard luminance formula
    totalBrightness += 0.299 * r + 0.587 * g + 0.114 * b;
  }

  const totalPixels = info.width * info.height;

  return Number((totalBrightness / totalPixels).toFixed(2));
};

module.exports = {
  calculateBrightness,
};