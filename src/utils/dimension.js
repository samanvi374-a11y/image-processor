const sharp = require("sharp");


async function validateDimensions(imagePath){

    const metadata = await sharp(imagePath).metadata();


    const width = metadata.width;
    const height = metadata.height;


    let status;


    if(width < 300 || height < 300){

        status = "Low Resolution";

    }
    else{

        status = "Valid";

    }


    return {
        width,
        height,
        status
    };

}


module.exports={
    validateDimensions
};