const { Worker } = require("bullmq");
const redis = require("../config/redis");
const Image = require("../models/Image");

const { generateImageHash } = require("../utils/hash");
const { calculateBrightness } = require("../utils/brightness");
const { calculateBlur } = require("../utils/image");
const { validateDimensions } = require("../utils/dimension");
const { extractText } = require("../utils/ocr");
const { cropPlate } = require("../utils/plateCrop");
const { validatePlate } = require("../utils/plateValidator");
const { analyzeMetadata } = require("../utils/metadata");


const worker = new Worker(
  "image-processing",
  async (job) => {

    const startTime = Date.now();

    try {

      console.log("\nProcessing Job");
      console.log(`Job ID : ${job.id}`);


      const image = await Image.findById(job.data.imageId);

      if (!image) {
        throw new Error("Image not found");
      }


      image.status = "processing";
      await image.save();



      // ==========================
      // Duplicate Detection
      // ==========================

      const hash = generateImageHash(image.filePath);

      image.imageHash = hash;

      const duplicate = await Image.findOne({
  imageHash: hash,
  _id: { $ne: image._id },
});

image.isDuplicate = !!duplicate;


// Console Output
console.log("\nDuplicate Detection");

if (image.isDuplicate) {
  console.log("Status : Duplicate Image");
} 
else {
  console.log("Status : Original Image");
}

      // ==========================
      // Brightness
      // ==========================

      const brightness = await calculateBrightness(image.filePath);

      image.brightnessScore = brightness;


      if (brightness < 80) {

        image.brightnessStatus = "Too Dark";

      } 
      else if (brightness > 200) {

        image.brightnessStatus = "Too Bright";

      } 
      else {

        image.brightnessStatus = "Well-lit";

      }


      console.log("\nBrightness");
      console.log(
        `${brightness} — ${image.brightnessStatus.toLowerCase()}`
      );



      // ==========================
      // Dimension Validation
      // ==========================

      const dimension = await validateDimensions(image.filePath);


      image.imageWidth = dimension.width;
      image.imageHeight = dimension.height;
      image.dimensionStatus = dimension.status;


      console.log("\nDimensions");
      console.log(
        `${dimension.width}x${dimension.height} — ${dimension.status}`
      );
// ==========================
// Metadata Analysis
// ==========================

const metadata = analyzeMetadata(image.filePath);


image.camera = metadata.camera;
image.cameraModel = metadata.model;
image.software = metadata.software;
image.capturedDate = metadata.date;


if(
    metadata.software !== "Unknown"
){

    image.metadataStatus =
    "Possible Edited Image";

}
else{

    image.metadataStatus =
    "Original Metadata";

}


console.log("\nMetadata");

console.log(
`Camera : ${metadata.camera}`
);

console.log(
`Model : ${metadata.model}`
);

console.log(
`Software : ${metadata.software}`
);

console.log(
`Status : ${image.metadataStatus}`
);


      // ==========================
      // Blur Detection
      // ==========================

      const blur = await calculateBlur(image.filePath);

      image.blurScore = blur;


      if (blur >= 1000) {

        image.blurStatus = "Sharp";

      } 
      else if (blur >= 200) {

        image.blurStatus = "Slightly Blurry";

      } 
      else {

        image.blurStatus = "Blurry";

      }


      console.log("\nBlur");
      console.log(`Score : ${blur}`);
      console.log(`Status : ${image.blurStatus}`);




      // ==========================
      // Plate Crop
      // ==========================

      const croppedImage = await cropPlate(image.filePath);



      // ==========================
      // OCR
      // ==========================

      const text = await extractText(croppedImage);

      image.extractedText = text;


      console.log("\nOCR");
      console.log(
        `Detected Text : ${text || "No text detected"}`
      );




      // ==========================
      // Plate Validation
      // ==========================

      const plate = validatePlate(text);


      image.plateNumber = plate.detectedPlate;
      image.plateValid = plate.isValid;
      image.stateCode = plate.stateCode;
      image.districtCode = plate.districtCode;
      image.series = plate.series;
      image.vehicleNumber = plate.vehicleNumber;



      console.log("\nPlate Analysis");


      if (plate.isValid) {

  console.log("Status : VALID");
  console.log(`Plate : ${plate.detectedPlate}`);

  image.plateDetectionReason =
    "Number plate detected successfully.";

  image.possibleCauses = [];

}
else {

  console.log("Status : FAILED");

  console.log("\nReason");

  if (!text || text.trim() === "") {

    image.plateDetectionReason =
      "No readable text could be extracted from the number plate.";

    image.possibleCauses = [
      "Plate too blurry",
      "Poor lighting conditions",
      "Plate not visible"
    ];

    console.log(
      "No readable text could be extracted from the number plate."
    );

  }
  else {

    image.plateDetectionReason =
      "The detected text does not match the standard Indian number plate format.";

    image.possibleCauses = [
      "Plate too small",
      "Plate tilted",
      "OCR misread characters",
      "Plate partially visible"
    ];

    console.log(
      "The detected text does not match the standard Indian number plate format."
    );

  }

  console.log("\nPossible causes");

  image.possibleCauses.forEach((cause) => {
    console.log(`• ${cause}`);
  });

}

      // ==========================
      // Final Save
      // ==========================

      image.status = "completed";

      image.processingTime =
        Date.now() - startTime;


      await image.save();


      console.log("\nCompleted");
      console.log(
        `Processing Time : ${image.processingTime} ms`
      );

      console.log("Image processed successfully.");



    } catch(error) {


      await Image.findByIdAndUpdate(
        job.data.imageId,
        {
          status:"failed",
          errorMessage:error.message
        }
      );


      console.error(error);

      throw error;

    }

  },
  {
    connection: redis,
  }
);



worker.on("completed",(job)=>{

  console.log(
    `\n✅ Job ${job.id} completed`
  );

});



worker.on("failed",(job,error)=>{

  console.log(
    `\n❌ Job ${job.id} failed`
  );

  console.log(error.message);

});