const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    storedFileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },
    // ==========================
// Image Dimension Analysis
// ==========================

imageWidth: {
  type: Number,
  default: 0,
},

imageHeight: {
  type: Number,
  default: 0,
},

dimensionStatus: {
  type: String,
  default: "",
},
// ==========================
// Metadata Analysis
// ==========================

camera: {
  type:String,
  default:""
},

cameraModel: {
  type:String,
  default:""
},

software: {
  type:String,
  default:""
},

capturedDate: {
  type:String,
  default:""
},

metadataStatus:{
  type:String,
  default:""
},

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },

    blurScore: {
      type: Number,
      default: 0,
    },

    blurStatus: {
      type: String,
      default: "",
    },

    brightnessScore: {
      type: Number,
      default: 0,
    },

    brightnessStatus: {
      type: String,
      default: "",
    },

    extractedText: {
      type: String,
      default: "",
    },

    // ==========================
    // Plate Details
    // ==========================

    plateNumber: {
      type: String,
      default: "",
    },

    plateValid: {
      type: Boolean,
      default: false,
    },

    stateCode: {
      type: String,
      default: "",
    },

    districtCode: {
      type: String,
      default: "",
    },

    series: {
      type: String,
      default: "",
    },

    vehicleNumber: {
      type: String,
      default: "",
    },

    // NEW FIELD
    plateDetectionReason: {
      type: String,
      default: "",
    },

    // ==========================
    // OCR Analysis
    // ==========================

    ocrStatus: {
      type: String,
      default: "",
    },

    ocrConfidence: {
      type: String,
      default: "",
    },

    ocrReason: {
      type: String,
      default: "",
    },

    possibleCauses: {
      type: [String],
      default: [],
    },

    issuesFound: {
      type: [String],
      default: [],
    },

    overallStatus: {
      type: String,
      default: "",
    },

    // ==========================

    isDuplicate: {
      type: Boolean,
      default: false,
    },

    imageHash: {
      type: String,
      default: "",
    },

    processingTime: {
      type: Number,
      default: 0,
    },

    errorMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);