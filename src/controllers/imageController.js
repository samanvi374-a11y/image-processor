const { v4: uuidv4 } = require("uuid");
const Image = require("../models/Image");
const imageQueue = require("../queue/imageQueue");

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No image uploaded. Please send the file under the 'image' or 'file' field in form-data.",
      });
    }

    const jobId = uuidv4();

    const image = await Image.create({
      jobId,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      status: "pending",
    });

    await imageQueue.add("process-image", {
      imageId: image._id,
      jobId,
    });

    res.status(201).json({
      success: true,
      jobId,
      imageId: image._id,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// NEW API
const getImageResult = async (req, res) => {
  try {
    const image = await Image.findOne({
      jobId: req.params.jobId,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json(image);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadImage,
  getImageResult,
};