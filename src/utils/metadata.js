const fs = require("fs");
const exif = require("exif-parser");


function analyzeMetadata(imagePath) {

    try {

        const buffer = fs.readFileSync(imagePath);

        const parser = exif.create(buffer);

        const result = parser.parse();


        return {

            camera:
            result.tags.Make || "Unknown",

            model:
            result.tags.Model || "Unknown",

            software:
            result.tags.Software || "Unknown",

            date:
            result.tags.DateTimeOriginal || "Unknown"

        };


    } catch(error) {

        return {

            camera:"Unavailable",
            model:"Unavailable",
            software:"Unavailable",
            date:"Unavailable"

        };

    }

}


module.exports = {
    analyzeMetadata
};