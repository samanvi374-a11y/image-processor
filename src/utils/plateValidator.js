function validatePlate(ocrText) {
  // Remove spaces and special characters
  const cleaned = ocrText
    .replace(/[^A-Z0-9]/gi, "")
    .toUpperCase();

  // Indian Number Plate Pattern
  // Example: MH12NW8556
  const regex = /^([A-Z]{2})(\d{2})([A-Z]{1,3})(\d{4})$/;

  const match = cleaned.match(regex);

  if (!match) {
    return {
      detectedPlate: cleaned,
      isValid: false,
      stateCode: "",
      districtCode: "",
      series: "",
      vehicleNumber: "",
    };
  }

  return {
    detectedPlate: cleaned,
    isValid: true,
    stateCode: match[1],
    districtCode: match[2],
    series: match[3],
    vehicleNumber: match[4],
  };
}

module.exports = {
  validatePlate,
};