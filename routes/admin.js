var express = require('express');
const { addProduct } = require('../controllers/productContollers');
var router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage ({
  destination: (req, file, cb) => {
      cb(null, 'public/images/')
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname;
    cb(null, uniqueFilename);
  }
  
});

const upload = multer({ storage });

router.post('/add-product',upload.array('photos', 12),addProduct)


module.exports = router;