const multer  = require("multer");
const priceController = require('../controllers/price-controller');

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./tempFile");
    },
    filename: (req, file, cb) => {
      const dateNow = Date.now()  
      cb(null, dateNow + "--" + file.originalname);
      req.filename = dateNow + "--" + file.originalname
    }
  });

module.exports = multer({ storage: fileStorageEngine,limits: { fileSize: 26214400 }});
 
 