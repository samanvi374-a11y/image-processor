const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

const imageRoutes = require("./routes/imageRoutes");
const Image = require("./models/Image");

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Serve static frontend files from public/
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "GoGig Media Processor API Running",
  });
});

app.get("/api/images/status/:imageId", async (req, res) => {
  try {
    const image = await Image.findById(req.params.imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    return res.json({
      success: true,
      status: image.status,
      extractedText: image.extractedText || "",
      plateNumber: image.plateNumber || "",
      plateDetectionReason: image.plateDetectionReason || "",
      image,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.use("/api/images", imageRoutes);

// Fallback to serve index.html for non-API web requests
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    return res.sendFile(path.join(__dirname, "../public/index.html"));
  }
  next();
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = err.message;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Maximum size is 10MB.";
    }

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  next();
});

module.exports = app;