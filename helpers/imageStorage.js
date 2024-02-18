const multer = require("multer");
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

      if (fs.existsSync(`./public/uploads/${file.originalname}`)) {
        // path exists
        console.log("exists:", `./public/uploads/${file.originalname}`);
        delete file;
      } else {
        console.log("DOES NOT exist:", `./public/uploads/${file.originalname}`);
      }

      cb(uploadError, "public/uploads");
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
    },
  }),
});

const postImageLocatianSpecify = (req) => {
  const fileName = req.file ? req.file.filename : "";
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  return `${basePath}${fileName}`;
};

const postMultiImagesLocatianSpecify = (req) => {
  const files = req.files;
  let imagesPaths = [];
  const basePathes = `${req.protocol}://${req.get("host")}/public/uploads/`;

  if (files) {
    files.map((file) => {
      // console.log(file);
      imagesPaths.push(`${basePathes}${file.filename}`);
    });
    return imagesPaths;
  }
};

module.exports.postImageLocatianSpecify = postImageLocatianSpecify;
module.exports.postMultiImagesLocatianSpecify = postMultiImagesLocatianSpecify;
module.exports.uploadbasicMulter = uploadbasicMulter;
