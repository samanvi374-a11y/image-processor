function getBrightnessStatus(score) {
  if (score <= 50) return "Very Dark";
  if (score <= 100) return "Dark";
  if (score <= 180) return "Normal";
  if (score <= 220) return "Bright";
  return "Overexposed";
}

function getBlurStatus(score) {
  if (score <= 100) return "Very Blurry";
  if (score <= 500) return "Slightly Blurry";
  return "Sharp";
}

module.exports = {
  getBrightnessStatus,
  getBlurStatus,
};