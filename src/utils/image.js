const sharp = require("sharp");

async function calculateBlur(imagePath) {

  const { data, info } = await sharp(imagePath)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });


  let sum = 0;
  let sumSquared = 0;
  let count = 0;


  // Laplacian variance calculation
  for (let y = 1; y < info.height - 1; y++) {

    for (let x = 1; x < info.width - 1; x++) {

      const index = y * info.width + x;

      const center = data[index];

      const left = data[index - 1];
      const right = data[index + 1];

      const top = data[index - info.width];
      const bottom = data[index + info.width];


      const edgeValue =
        Math.abs(
          left +
          right +
          top +
          bottom -
          (4 * center)
        );


      sum += edgeValue;
      sumSquared += edgeValue * edgeValue;

      count++;
    }
  }


  const mean = sum / count;

  const variance =
    (sumSquared / count) -
    (mean * mean);


  return Number(variance.toFixed(2));
}


module.exports = {
  calculateBlur,
};