const test = require("node:test");
const assert = require("node:assert/strict");

const { buildRecognitionOptions } = require("../src/utils/ocr");

test("OCR config uses permissive settings", () => {
  const options = buildRecognitionOptions(() => {});

  assert.equal(options.oem, 1);
  assert.equal(options.tessedit_pageseg_mode, 3);
  assert.equal(options.tessedit_ocr_engine_mode, 1);
  assert.equal(options.preserve_interword_spaces, 1);
  assert.equal(options.tessedit_char_whitelist, undefined);
});
