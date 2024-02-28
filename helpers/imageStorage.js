const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
// const { Settings } = require("../models/settings");

aws.config.update({
  secretAccessKey: "vMacd2NsOKFXJoOZJx8G5LoNR9qlBy6nPpudoJqI",
  accessKeyId: "AKIAX4V6NCUOXMOTNHGN",
  region: "us-east-1",
});

let s3 = new aws.S3();
var fs = require("fs");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "video/mp4": "mp4", // Add video MIME types
  "video/mpeg": "mpeg",
};

const uploadbasicMulter = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadError = new Error("invalid image type");
      if (isValid) uploadError = null;

      // if (fs.existsSync(`./public/uploads/${file.originalname}`)) {
      //   // path exists
      //   console.log("exists:", `./public/uploads/${file.originalname}`);
      //   delete file

      // } else {
      //   console.log("DOES NOT exist:", `./public/uploads/${file.originalname}`);
      // }

      cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
    },
  }),
});

const uploadS3Multer = multer({
  storage: multerS3({
    s3: s3,
    // acl: "public-read",
    bucket: "handinhand-demo",
    key: function (req, file, cb) {
      // const isValid = FILE_TYPE_MAP[file.mimetype];
      const isValid = true;
      if (isValid) {
        cb(null, file.originalname); // Use Date.now() for unique file keys
      } else {
        cb(new Error("Invalid file type"));
      }
    },
  }),
});

//console.log(process.env.uploadS3)

const postImageLocatianSpecify = (req) => {
  const fileName = req.file ? req.file.filename : "";
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  if (type == "s3") {
    return req?.file?.location;
  } else {
    return `${basePath}${fileName}`;
  }
};

const uploadFile = (file, path) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "sitdown",
      Key: path,
      Body: file,
    };
    s3.upload(params, function (err, data) {
      if (err) {
        console.log("Error occured while trying to upload to S3 bucket", err);
        reject(err);
      }
      if (data) {
        console.log("Upload success", data.Location);
        resolve(data.Location);
      }
    });
  });
};
const postMultiImagesLocatianSpecify = (req) => {
  const files = req.files;
  let imagesPaths = [];
  const basePathes = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    if (type == "s3") {
      files.map((file) => {
        // console.log(file);
        imagesPaths.push(file.location);
      });
      return imagesPaths;
    } else {
      files.map((file) => {
        // console.log(file);
        imagesPaths.push(`${basePathes}${file.filename}`);
      });
      return imagesPaths;
    }
  }
};

let whichUpload =
  process.env.uploadS3 == "true" ? uploadS3Multer : uploadbasicMulter;
let type = process.env.uploadS3 == "true" ? "s3" : "basic";

module.exports.type = type;
module.exports.whichUpload = whichUpload;
module.exports.postImageLocatianSpecify = postImageLocatianSpecify;
module.exports.uploadFile = uploadFile;
module.exports.postMultiImagesLocatianSpecify = postMultiImagesLocatianSpecify;
