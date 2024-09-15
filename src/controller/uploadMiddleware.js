const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Product = require("../models/product");


// Configure multer storage and file name
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Custom file upload middleware
const uploadMiddleware = (req, res, next) => {
  // Use multer upload instance
  upload.array('files', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    

    // Retrieve uploaded files
    const {name, category, brand, price, stock, description} = req.body
    
    const files = req.files;

    const errors = [];

    // Validate file types and sizes
    files.forEach((file) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.mimetype)) {
        errors.push(`Invalid file type: ${file.originalname}`);
      }

      if (file.size > maxSize) {
        errors.push(`File too large: ${file.originalname}`);
      }
    });

    // Get files names
    const filesNames = files.map(file => file.filename)
    console.log("files:"+filesNames)

    const _product = new Product({
      name:name,
      slug:name,
      category:category,
      images:filesNames,
      price:price,
      brand:brand,
      countInStock:stock,
      description:description
    });


    // Handle validation errors
    if (errors.length > 0) {
      // Remove uploaded files
      files.forEach((file) => {
        fs.unlinkSync(file.path);
      });

      return res.status(400).json({ errors });
    }

    // Store product in database
    _product.save((error, data) => {
      if (error) {
        console.log(error);
        return res.status(400).json({
          message: "something went wrong" + error,
        });
      }
  
      if (data) {
        console.log(data);
        console.log("Product created");

        const files = req.files;
  
        // Upload the files in a specific directory
        files.forEach((file) => {
          const filePath = `uploads/${file.filename}`;
          fs.rename(file.path, filePath, (err) => {
            if (err) {
              // Handle error appropriately and send an error response
              return res.status(500).json({ error: 'Failed to store the file' });
            }
          });
        });
      
        // Send an appropriate response to the client
        return res.status(200).json({
              name:name,
              slug:name,
              category:category,
              images:files,
              price:price,
              brand:brand,
              countInStock:stock,
              description:description,
        });
        }
    });



    // Attach files to the request object
    //req.files = files;



    // Proceed to the next middleware or route handler
    //next();
  });
};

module.exports = uploadMiddleware;