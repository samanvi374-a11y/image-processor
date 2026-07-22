const Tesseract = require("tesseract.js");
const fs = require("fs");
const os = require("os");
const path = require("path");
const sharp = require("sharp");

function buildRecognitionOptions(logger) {
  const options = {
    oem: 1,
    tessedit_pageseg_mode: 3,
    tessedit_ocr_engine_mode: 1,
    preserve_interword_spaces: 1,
    tessedit_char_whitelist: undefined,
  };

  if (typeof logger === "function") {
    options.logger = logger;
  }

  return options;
}

async function prepareReadableImage(imagePath) {
  const extension = path.extname(imagePath).toLowerCase();
  const baseName = path.basename(imagePath, extension) || "ocr-image";
  const tempPath = path.join(os.tmpdir(), `${baseName}-${Date.now()}.png`);

  await sharp(imagePath)
    .resize({ width: 2200, fit: "inside", withoutEnlargement: false })
    .greyscale()
    .normalize()
    .modulate({ brightness: 1.1, saturation: 0.9 })
    .sharpen()
    .linear(1.15, -20)
    .threshold(140)
    .toFormat("png")
    .toFile(tempPath);

  return tempPath;
}

async function extractText(imagePath) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error("OCR image not found");
    }

    let imageToRead = imagePath;
    let tempImagePath = null;

    const shouldConvert = !/\.(png|jpe?g|bmp|tif|tiff|webp)$/i.test(imagePath);
    if (shouldConvert) {
      tempImagePath = await prepareReadableImage(imagePath);
      imageToRead = tempImagePath;
    }

    const {
      data: { text },
    } = await Tesseract.recognize(imageToRead, "eng", buildRecognitionOptions());

    if (tempImagePath && fs.existsSync(tempImagePath)) {
      fs.unlinkSync(tempImagePath);
    }

    let cleaned = text
      .replace(/[^A-Za-z0-9]/g, "")
      .toUpperCase()
      .trim();

    cleaned = cleaned
      .replace(/S/g, "5")
      .replace(/O/g, "0")
      .replace(/I/g, "1")
      .replace(/Z/g, "2")
      .replace(/B/g, "8")
      .replace(/G/g, "6")
      .replace(/Q/g, "9")
      .replace(/A/g, "4")
      .replace(/T/g, "7")
      .replace(/L/g, "1");

    const candidates = Array.from(
      new Set(
        cleaned
          .match(/[A-Z0-9]{3,10}/g)
          ?.filter((value) => value.length >= 4 && value.length <= 10) || []
      )
    );

    if (candidates.length) {
      const scored = candidates.map((value) => ({
        value,
        score: scorePlateCandidate(value),
      }));

      scored.sort((a, b) => b.score - a.score);
      const best = scored[0];
      if (best && best.score >= 12) {
        return best.value;
      }
    }

    const plateLike = cleaned.match(/[A-Z0-9]{4,8}/g)?.filter((value) => {
      const platePattern = /^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/;
      return platePattern.test(value);
    })?.[0];

    if (plateLike) {
      return plateLike;
    }

    return cleaned.slice(0, 12);
  } catch (err) {
    console.log("OCR Error:", err.message);
    return "";
  }
}

function scorePlateCandidate(value) {
  let score = 0;

  if (/^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/.test(value)) {
    return 100;
  }

  if (/^[A-Z]{2}\d{2}/.test(value)) {
    score += 20;
  }

  if (/\d{4}$/.test(value)) {
    score += 15;
  }

  if (/[A-Z]{2,4}/.test(value)) {
    score += 10;
  }

  if (/\d{2,4}/.test(value)) {
    score += 8;
  }

  if (value.length >= 6 && value.length <= 10) {
    score += 5;
  }

  return score;
}

module.exports = {
  extractText,
  buildRecognitionOptions,
};