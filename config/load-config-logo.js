const multer  = require("multer");
const SharpMulter  =  require('./sharp-multer-logo')

const fileStorageEngine = SharpMulter({
    destination: (req, file, cb) => {
      cb(null, "./uploadsLogo");
    },
    imageOptions:{
      fileFormat: "jpeg",
      quality: 80,
      resize:{width:216}
    }
  });

module.exports = multer({ storage: fileStorageEngine,limits: { fileSize: 6214400 }});
 
 