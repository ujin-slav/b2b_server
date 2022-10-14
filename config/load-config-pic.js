const multer  = require("multer");
const SharpMulter  =  require('./sharp-multer')

const fileStorageEngine = SharpMulter({
    destination: (req, file, cb) => {
      cb(null, "./uploadsPic");
    },
    imageOptions:{
      fileFormat: "jpeg",
      quality: 80,
    },
    imageOptionsMini:{
      fileFormat: "jpeg",
      quality: 80,
      resize:{width:100}
    },
  });

module.exports = multer({ storage: fileStorageEngine,limits: { fileSize: 6214400 }});
 
 