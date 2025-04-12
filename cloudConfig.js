const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: 'wanderlust_DEV',
//       allowedFormats: ["png","jpg","jpeg"],
//     },
//   });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
      return {
          folder: 'wanderlust_DEV',
          format: file.mimetype.split('/')[1], // Ensures correct format (jpg, png, etc.)
          public_id: `${Date.now()}-${file.originalname}`, // Unique filename
      };
  },
});

module.exports = {
    cloudinary,
    storage,
}