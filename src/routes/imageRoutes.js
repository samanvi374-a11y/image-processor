const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const { uploadImage } = require("../controllers/imageController");
const Image = require("../models/Image");

const router = express.Router();

const uploadDir = path.resolve(__dirname, "../../uploads/originals");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);
  },
});

// ==============================
// Upload Image
// ==============================

router.post(
  "/upload",
  (req, res, next) => {
    console.log("➡️ Route reached");
    next();
  },
  (req, res, next) => {
    if (
      req.headers["content-type"] &&
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Use form-data in Postman and add a file field named 'image' or 'file'.",
      });
    }

    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "file", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        if (err.message && err.message.includes("Malformed part header")) {
          return res.status(400).json({
            success: false,
            message:
              "The request body is not a valid multipart/form-data upload.",
          });
        }

        return next(err);
      }

      req.file = req.files?.image?.[0] || req.files?.file?.[0] || null;
      next();
    });
  },
  uploadImage
);

// ==============================
// Get Processing Result
// ==============================

router.get("/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: image,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;